import express from 'express';
import * as questionsController from '../controllers/questions.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', questionsController.getAllQuestions);
router.get('/:id', questionsController.getQuestionById);
router.post('/', authenticateUser, questionsController.createQuestion);
router.put('/:id', authenticateUser, questionsController.updateQuestion);
router.delete('/:id', authenticateUser, questionsController.deleteQuestion);
router.post('/:id/vote', authenticateUser, questionsController.voteQuestion);

export default router;