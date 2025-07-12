import express from 'express';
import * as answersController from '../controllers/answers.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/questions/:id/answers', authenticateUser, answersController.createAnswer);
router.put('/answers/:id', authenticateUser, answersController.updateAnswer);
router.delete('/answers/:id', authenticateUser, answersController.deleteAnswer);

export default router;
