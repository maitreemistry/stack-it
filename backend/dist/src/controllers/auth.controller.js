"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.createAdmin = exports.getAllUsers = exports.getProfile = exports.logout = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const signup = async (req, res) => {
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: "Invalid email format" });
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists, please use a different email" });
            return;
        }
        const softColors = ['fcd34d', 'fca5a5', '6ee7b7', 'a5b4fc', 'f9a8d4', 'bfdbfe'];
        const getRandomColor = () => {
            const idx = Math.floor(Math.random() * softColors.length);
            return softColors[idx];
        };
        const bgColor = getRandomColor();
        const randomAvatar = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=Brian&backgroundColor=${bgColor}`;
        const newUser = await User_1.default.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY || 'fallback-secret', { expiresIn: '7d' });
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
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
    }
    catch (error) {
        console.log('Error in signup controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET_KEY || 'fallback-secret', { expiresIn: '7d' });
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
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
    }
    catch (error) {
        console.log('Error in login controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });
    res.status(200).json({ message: 'Logged out' });
};
exports.logout = logout;
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.userId).select("fullName email profilePic");
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
    }
    catch (error) {
        console.log('Error in getProfile controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getProfile = getProfile;
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find({}).select('-password');
        res.status(200).json({
            success: true,
            users,
            count: users.length
        });
    }
    catch (error) {
        console.log('Error in getAllUsers controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAllUsers = getAllUsers;
const createAdmin = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password || !fullName) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }
        const softColors = ['fcd34d', 'fca5a5', '6ee7b7', 'a5b4fc', 'f9a8d4', 'bfdbfe'];
        const getRandomColor = () => {
            const idx = Math.floor(Math.random() * softColors.length);
            return softColors[idx];
        };
        const bgColor = getRandomColor();
        const randomAvatar = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=Admin&backgroundColor=${bgColor}`;
        const adminUser = await User_1.default.create({
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
    }
    catch (error) {
        console.log('Error in createAdmin controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.createAdmin = createAdmin;
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            res.status(400).json({ message: "Role must be 'user' or 'admin'" });
            return;
        }
        const user = await User_1.default.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user
        });
    }
    catch (error) {
        console.log('Error in updateUserRole controller', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateUserRole = updateUserRole;
//# sourceMappingURL=auth.controller.js.map