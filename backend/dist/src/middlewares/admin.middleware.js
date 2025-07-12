"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const user = await User_1.default.findById(req.user.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        if (user.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=admin.middleware.js.map