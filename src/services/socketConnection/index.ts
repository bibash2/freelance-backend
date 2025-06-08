// src/services/socketConnection.ts - FIXED VERSION
import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
import messageRepository from "../message";

interface SocketUser {
    id: string;
    userId: string;
    workCallId?: string;
    token?: string;
}

interface ChatMessage {
    content: string;
    senderId: string;
    workCallId?: string;
    createdAt: string;
    token?: string;
}

export default function socketConnection(httpServer: HttpServer): Server {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    // Store connected users
    const connectedUsers = new Map<string, SocketUser>();
      
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        
        // Handle authentication and user joining
        socket.on('authenticate', (authData: { token: string; userId: string; workCallId?: string }) => {
            const user: SocketUser = {
                id: socket.id,
                userId: authData.userId,
                workCallId: authData.workCallId,
                token: authData.token
            };
            
            connectedUsers.set(socket.id, user);
            
            // Join work call room if provided
            if (authData.workCallId) {
                socket.join(`workCall_${authData.workCallId}`);
                console.log(`User ${authData.userId} joined work call ${authData.workCallId}`);
            }
            
            // Send welcome message to the connected user
            socket.emit('connectionStatus', { 
                type: 'connected', 
                message: 'Successfully connected to chat server',
                socketId: socket.id,
                timestamp: new Date().toISOString()
            });
            
            // Notify others in the same work call
            if (authData.workCallId) {
                socket.to(`workCall_${authData.workCallId}`).emit('userJoined', {
                    type: 'notification',
                    message: `User joined the conversation`,
                    userId: authData.userId,
                    timestamp: new Date().toISOString()
                });
            }
        });
      
        // Handle chat messages
        socket.on('chatMessage', async (messageData: ChatMessage, callback) => {
            try {
                console.log('Received message:', messageData);
                
                const user = connectedUsers.get(socket.id);
                if (!user) {
                    if (callback) callback({ success: false, error: 'User not authenticated' });
                    return;
                }

                // Validate message data
                if (!messageData.content || !messageData.content.trim()) {
                    if (callback) callback({ success: false, error: 'Message content is required' });
                    return;
                }

                // Create message object with proper structure
                const message = {
                    id: generateMessageId(), // Generate unique ID
                    content: messageData.content.trim(),
                    senderId: messageData.senderId || user.userId,
                    workCallId: messageData.workCallId || user.workCallId,
                    createdAt: new Date().toISOString(),
                    senderSocketId: socket.id
                };

                // Save message to database
                try {
                    const savedMessage = await messageRepository.saveMessage(message);
                    console.log('Message saved to database:', savedMessage);
                } catch (dbError) {
                    console.error('Failed to save message to database:', dbError);
                    if (callback) callback({ success: false, error: 'Failed to save message' });
                    return;
                }

                // Emit message to all users in the work call room
                if (message.workCallId) {
                    io.to(`workCall_${message.workCallId}`).emit('newMessage', {
                        id: message.id,
                        content: message.content,
                        senderId: message.senderId,
                        workCallId: message.workCallId,
                        createdAt: message.createdAt,
                        timestamp: message.createdAt
                    });
                } else {
                    // Fallback: emit to all connected clients
                    io.emit('newMessage', {
                        id: message.id,
                        content: message.content,
                        senderId: message.senderId,
                        createdAt: message.createdAt,
                        timestamp: message.createdAt
                    });
                }

                // Send acknowledgment to sender
                if (callback) {
                    callback({ 
                        success: true, 
                        messageId: message.id,
                        timestamp: message.createdAt
                    });
                }

            } catch (error) {
                console.error('Error handling chat message:', error);
                if (callback) {
                    callback({ 
                        success: false, 
                        error: 'Failed to process message' 
                    });
                }
            }
        });

        // Handle typing indicators
        socket.on('typing', (data: { workCallId: string; isTyping: boolean }) => {
            const user = connectedUsers.get(socket.id);
            if (user && data.workCallId) {
                socket.to(`workCall_${data.workCallId}`).emit('userTyping', {
                    userId: user.userId,
                    isTyping: data.isTyping,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Handle message read status
        socket.on('markAsRead', async (data: { messageId: string; workCallId: string }) => {
            try {
                const user = connectedUsers.get(socket.id);
                if (user) {
                    // Update read status in database
                    await messageRepository.markAsRead(data.messageId, user.userId);
                    
                    // Notify other users in the work call
                    socket.to(`workCall_${data.workCallId}`).emit('messageRead', {
                        messageId: data.messageId,
                        readBy: user.userId,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });

        // Handle work call status updates
        socket.on('workCallStatusUpdate', (data: { workCallId: string; status: string }) => {
            const user = connectedUsers.get(socket.id);
            if (user && data.workCallId) {
                socket.to(`workCall_${data.workCallId}`).emit('statusUpdate', {
                    workCallId: data.workCallId,
                    status: data.status,
                    updatedBy: user.userId,
                    timestamp: new Date().toISOString()
                });
            }
        });
      
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            
            const user = connectedUsers.get(socket.id);
            if (user) {
                // Notify others in the work call about user leaving
                if (user.workCallId) {
                    socket.to(`workCall_${user.workCallId}`).emit('userLeft', {
                        type: 'notification',
                        message: `User left the conversation`,
                        userId: user.userId,
                        timestamp: new Date().toISOString()
                    });
                }
                
                // Remove user from connected users
                connectedUsers.delete(socket.id);
            }
        });

        // Handle errors
        socket.on('error', (error) => {
            console.error(`Socket error for ${socket.id}:`, error);
        });
    });

    return io;
}

// Helper function to generate unique message IDs
function generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

