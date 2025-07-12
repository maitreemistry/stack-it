import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extended Request interface to include user
interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

// Authentication middleware
export const authenticateUser = async (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'fallback-secret') as { userId: string };
        
        if (!decoded.userId) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        // Check if user exists in database
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // Add user to request object
        req.user = { userId: decoded.userId };
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
}; 