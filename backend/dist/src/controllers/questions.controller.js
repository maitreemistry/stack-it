"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteQuestion = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionById = exports.getAllQuestions = void 0;
const Question_1 = __importDefault(require("../models/Question"));
const getAllQuestions = async (req, res) => {
    const questions = await Question_1.default.find();
    return res.json(questions);
};
exports.getAllQuestions = getAllQuestions;
const getQuestionById = async (req, res) => {
    const question = await Question_1.default.findById(req.params.id);
    if (!question) {
        return res.status(404).json({ message: 'Not found' });
    }
    return res.json(question);
};
exports.getQuestionById = getQuestionById;
const createQuestion = async (req, res) => {
    const { title, body, tags } = req.body;
    const question = new Question_1.default({ title, body, tags, author: req.user.userId });
    await question.save();
    return res.status(201).json(question);
};
exports.createQuestion = createQuestion;
const updateQuestion = async (req, res) => {
    const { title, body, tags } = req.body;
    const question = await Question_1.default.findById(req.params.id);
    if (!question)
        return res.status(404).json({ message: 'Not found' });
    question.title = title ?? question.title;
    question.body = body ?? question.body;
    question.tags = tags ?? question.tags;
    await question.save();
    return res.json(question);
};
exports.updateQuestion = updateQuestion;
const deleteQuestion = async (req, res) => {
    const question = await Question_1.default.findById(req.params.id);
    if (!question)
        return res.status(404).json({ message: 'Not found' });
    await question.deleteOne();
    return res.json({ message: 'Question deleted' });
};
exports.deleteQuestion = deleteQuestion;
const voteQuestion = async (req, res) => {
    const { vote } = req.body;
    const question = await Question_1.default.findById(req.params.id);
    if (!question)
        return res.status(404).json({ message: 'Not found' });
    question.votes += vote;
    await question.save();
    return res.json({ votes: question.votes });
};
exports.voteQuestion = voteQuestion;
//# sourceMappingURL=questions.controller.js.map