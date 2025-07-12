import { Request, Response } from 'express';
import Question from '../models/Question';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const getAllQuestions = async (req: Request, res: Response) => {
  const questions = await Question.find();
  return res.json(questions);
};

export const getQuestionById = async (req: Request, res: Response) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({ message: 'Not found' });
  }
  return res.json(question);
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  const { title, body, tags } = req.body;
  const question = new Question({ title, body, tags, author: req.user!.userId });
  await question.save();
  return res.status(201).json(question);
};

// Update a question (owner/admin)
export const updateQuestion = async (req: Request, res: Response) => {
  const { title, body, tags } = req.body;
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: 'Not found' });
  question.title = title ?? question.title;
  question.body = body ?? question.body;
  question.tags = tags ?? question.tags;
  await question.save();
  return res.json(question);
};

// Delete a question (owner/admin)
export const deleteQuestion = async (req: Request, res: Response) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: 'Not found' });
  await question.deleteOne();
  return res.json({ message: 'Question deleted' });
};

export const voteQuestion = async (req: Request, res: Response) => {
    const { vote } = req.body; // vote: 1 for upvote, -1 for downvote
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
  
    question.votes += vote;
    await question.save();
    return res.json({ votes: question.votes });
  };
