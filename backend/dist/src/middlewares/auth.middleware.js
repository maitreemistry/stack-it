"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || 'fallback-secret');
        if (!decoded.userId) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        req.user = { userId: decoded.userId };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=auth.middleware.js.map