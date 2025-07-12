"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const getUserProfile = async (req, res) => {
    const user = await User_1.default.findById(req.params.id).select('-password');
    if (!user)
        return res.status(404).json({ message: 'Not found' });
    return res.json(user);
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user)
        return res.status(404).json({ message: 'Not found' });
    user.fullName = req.body.fullName ?? user.fullName;
    user.profilePic = req.body.profilePic ?? user.profilePic;
    await user.save();
    return res.json(user);
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=users.controller.js.map