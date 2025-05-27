import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

interface JWTPayload {
    id: string;
    iat?: number;
    exp?: number;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
        if(req.body){
            req.body.userId = decoded?.id;
        }
        if(req.params){
            req.params.userId = decoded?.id;
        }
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
        }
        throw new Error('Internal server error');
    }
};

export const getUserFromToken = (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    return decoded?.id;
}