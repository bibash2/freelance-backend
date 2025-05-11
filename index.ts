// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './src/routes';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  console.log("Payload: ", JSON.stringify(req.body, null, 2));
  next()
})

// Routes
console.log(express.json())
app.use('/api', router);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
