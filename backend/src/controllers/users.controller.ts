import { Request, Response } from 'express';
import User from '../models/User';

export const getUserProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Not found' });
  return res.json(user);
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });

  // Optionally: check if req.user.userId === user._id

  user.fullName = req.body.fullName ?? user.fullName;
  user.profilePic = req.body.profilePic ?? user.profilePic;
  await user.save();
  return res.json(user);
};
