// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './src/routes';
import { Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import socketConnection from './src/services/socketConnection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  console.log("Payload: ", JSON.stringify(req.body, null, 2));
  next();
});

// Routes
app.use('/api', router);

socketConnection(app);
// Create HTTP server
const httpServer = http.createServer(app);



// Start the server using httpServer (not app.listen())
httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});