import { Request, Response } from 'express';
import Answer from '../models/Answer';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const createAnswer = async (req: AuthRequest, res: Response) => {
  const { body } = req.body;
  const answer = new Answer({
    body,
    author: req.user!.userId,
    question: req.params.id
  });
  await answer.save();
  return res.status(201).json(answer);
};

export const updateAnswer = async (req: Request, res: Response) => {
  const { body } = req.body;
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ message: 'Not found' });

  // Optionally: check if req.user.userId === answer.author or is admin

  answer.body = body ?? answer.body;
  await answer.save();
  return res.json(answer);
};

export const deleteAnswer = async (req: Request, res: Response) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ message: 'Not found' });

  // Optionally: check if req.user.userId === answer.author or is admin

  await answer.deleteOne();
  return res.json({ message: 'Answer deleted' });
};
