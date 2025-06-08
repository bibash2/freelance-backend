// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './src/routes';
import { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import socketConnection from './src/services/socketConnection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware - remains exactly the same
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' })); // Increase as needed
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  console.log("Payload: ", JSON.stringify(req.body, null, 2));
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - remains exactly the same
app.use('/api', router);

// Create HTTP server - remains the same
const httpServer = http.createServer(app);

// Initialize Socket.IO - THE KEY FIX IS HERE
// Pass the httpServer instead of the express app
const io = socketConnection(httpServer); // Modified socketConnection to accept httpServer

// REST API remains completely unchanged below this line
httpServer.listen(PORT, () => {
  console.log(`
  Server running on port ${PORT}
  REST API: http://localhost:${PORT}/api
  WebSocket: ws://localhost:${PORT}
  `);
});