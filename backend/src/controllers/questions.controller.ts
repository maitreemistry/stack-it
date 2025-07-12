import { Request, Response } from 'express';
import Question from '../models/Question';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find()
      .populate('author', 'fullName email profilePic')
      .sort({ createdAt: -1 });
    
    return res.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'fullName email profilePic');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    return res.json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, body, tags } = req.body;
    
    // Validation
    if (!title || !body || !tags || !Array.isArray(tags)) {
      return res.status(400).json({ 
        success: false,
        message: 'Title, body, and tags are required' 
      });
    }
    
    if (!req.user?.userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }
    
    const question = new Question({ 
      title: title.trim(), 
      body: body.trim(), 
      tags: tags.map(tag => tag.trim()).filter(tag => tag.length > 0),
      author: req.user.userId 
    });
    
    await question.save();
    
    // Populate author info for response
    await question.populate('author', 'fullName email profilePic');
    
    // Type assertion for populated author
    const populatedQuestion = question.toObject() as any;
    
    return res.status(201).json({ 
      success: true,
      question: {
        id: question._id,
        title: question.title,
        body: question.body,
        tags: question.tags,
        author: {
          id: populatedQuestion.author._id,
          name: populatedQuestion.author.fullName,
          username: populatedQuestion.author.email.split('@')[0],
          avatar: populatedQuestion.author.profilePic
        },
        votes: question.votes,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt
      }
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
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
