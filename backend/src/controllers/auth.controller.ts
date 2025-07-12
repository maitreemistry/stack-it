import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extended Request interface to include user
interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

// Signup controller
export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email regex
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: "Invalid email format" });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists, please use a different email" });
            return;
        }

        const softColors = ['fcd34d', 'fca5a5', '6ee7b7', 'a5b4fc', 'f9a8d4', 'bfdbfe'];

        const getRandomColor = (): string => {
            const idx = Math.floor(Math.random() * softColors.length);
            return softColors[idx];
        };

        const bgColor = getRandomColor();
        const randomAvatar = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=Brian&backgroundColor=${bgColor}`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        const token = jwt.sign(
            { userId: newUser._id }, 
            process.env.JWT_SECRET_KEY || 'fallback-secret', 
            { expiresIn: '7d' }
        );

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // cookie is not accessible from client side (prevents XSS attacks)
            sameSite: 'strict' as const, // cookie is sent only to same site (prevents CSRF attacks)
            secure: process.env.NODE_ENV === 'production',
            path: '/' // cookie is sent only over HTTPS in production
        });

        res.status(201).json({ 
            success: true, 
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                role: newUser.role
            }
        });
    } catch (error) {
        console.log('Error in signup controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET_KEY || 'fallback-secret', 
            { expiresIn: '7d' }
        );

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // cookie is not accessible from client side (prevents XSS attacks)
            sameSite: 'strict' as const, // cookie is sent only to same site (prevents CSRF attacks)
            secure: process.env.NODE_ENV === 'production', // cookie is sent only over HTTPS in production
            path: '/' // cookie is accessible from all routes
        });

        res.status(200).json({ 
            success: true, 
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role
            }
        });
    } catch (error) {
        console.log('Error in login controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Logout controller
export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'strict' as const, // or 'none' if using cross-site cookies
        secure: process.env.NODE_ENV === 'production', // match the secure flag
        path: '/' // ensure the cookie is cleared for all routes
    });
    res.status(200).json({ message: 'Logged out' });
};

// Get profile controller
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.userId).select("fullName email profilePic");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ 
            username: user.fullName, 
            email: user.email, 
            profilePic: user.profilePic,
            role: user.role
        });
    } catch (error) {
        console.log('Error in getProfile controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Admin: Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({ 
            success: true, 
            users,
            count: users.length
        });
    } catch (error) {
        console.log('Error in getAllUsers controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Temporary: Create admin user (remove this in production)
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password || !fullName) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        const softColors = ['fcd34d', 'fca5a5', '6ee7b7', 'a5b4fc', 'f9a8d4', 'bfdbfe'];
        const getRandomColor = (): string => {
            const idx = Math.floor(Math.random() * softColors.length);
            return softColors[idx];
        };

        const bgColor = getRandomColor();
        const randomAvatar = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=Admin&backgroundColor=${bgColor}`;

        const adminUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
            role: 'admin'
        });

        res.status(201).json({ 
            success: true, 
            message: "Admin user created successfully",
            user: {
                _id: adminUser._id,
                fullName: adminUser.fullName,
                email: adminUser.email,
                profilePic: adminUser.profilePic,
                role: adminUser.role
            }
        });
    } catch (error) {
        console.log('Error in createAdmin controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Admin: Update user role (admin only)
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            res.status(400).json({ message: "Role must be 'user' or 'admin'" });
            return;
        }

        const user = await User.findByIdAndUpdate(
            userId, 
            { role }, 
            { new: true }
        ).select('-password');

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ 
            success: true, 
            message: "User role updated successfully",
            user
        });
    } catch (error) {
        console.log('Error in updateUserRole controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
