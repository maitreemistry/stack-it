import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Extended Request interface to include user
interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

// Admin middleware to check if user is admin
export const requireAdmin = async (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 