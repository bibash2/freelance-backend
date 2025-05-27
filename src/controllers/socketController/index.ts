import { Server } from 'socket.io';
import { Request, Response } from 'express';



class SocketController {
    private io: Server;
    constructor() {
        this.io = new Server();
     }

    async socket(req: Request, res: Response) {
        try {

            this.io.on('connection', (socket) => {
                console.log('🟢 A user connected:', socket.id);

                // Example: listen for a message
                socket.on('chat:message', (data: any) => {
                    console.log('📩 Message received:', data);
                    // Broadcast to all clients (except sender)
                    socket.broadcast.emit('chat:message', data);
                });

                socket.on('disconnect', () => {
                    console.log('🔴 A user disconnected:', socket.id);
                });
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

const socketController = new SocketController();

export default socketController;