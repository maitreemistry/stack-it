import express from 'express';
import * as usersController from '../controllers/users.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/:id', usersController.getUserProfile);
router.put('/:id', authenticateUser, usersController.updateUserProfile);

export default router;
