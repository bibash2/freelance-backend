import { Server } from "socket.io";
import http from 'http';
// import { saveMessage } from "../message";


const socketConnection = (app: any) => {
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"]
        }
      });
      // app.use('/socket.io', io);
      
      // Socket.IO connection handler
      
      io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
      
        // Send welcome message
        socket.emit('message', { 
          type: 'welcome', 
          message: 'Connected to Socket.IO server',
          id: socket.id
        });
      
        // Broadcast when a user connects
        socket.broadcast.emit('message', {
          type: 'notification',
          message: `User ${socket.id} joined`
        });
      
        // Handle custom events
        socket.on('chatMessage', (msg) => {
          console.log('Message received:', msg);
        // saveMessage(msg);
          io.emit('message', { 
            type: 'chat', 
            user: socket.id,
            message: msg,
            timestamp: new Date().toISOString()
          });
        });
      
        // Handle disconnection
        socket.on('disconnect', () => {
          console.log(`Client disconnected: ${socket.id}`);
          io.emit('message', {
            type: 'notification',
            message: `User ${socket.id} left`
          });
        });
      });
    
}

export default socketConnection;
