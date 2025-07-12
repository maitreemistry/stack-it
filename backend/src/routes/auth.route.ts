import express, { Router } from 'express';
import { signup, login, logout, getProfile, getAllUsers, updateUserRole, createAdmin } from '../controllers/auth.controller'; // import auth controller functions
import { authenticateUser } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router: Router = express.Router();

// Public routes
router.post('/signup', signup);  
router.post('/login', login);
router.post('/logout', logout);
router.post('/create-admin', createAdmin); // Temporary route - remove in production

// Protected routes (user authentication required)
router.get("/me", authenticateUser, getProfile);

// Admin routes (admin authentication required)
router.get("/admin/users", authenticateUser, requireAdmin, getAllUsers);
router.put("/admin/users/:userId/role", authenticateUser, requireAdmin, updateUserRole);

export default router;
