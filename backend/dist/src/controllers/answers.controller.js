"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnswer = exports.updateAnswer = exports.createAnswer = void 0;
const Answer_1 = __importDefault(require("../models/Answer"));
const createAnswer = async (req, res) => {
    const { body } = req.body;
    const answer = new Answer_1.default({
        body,
        author: req.user.userId,
        question: req.params.id
    });
    await answer.save();
    return res.status(201).json(answer);
};
exports.createAnswer = createAnswer;
const updateAnswer = async (req, res) => {
    const { body } = req.body;
    const answer = await Answer_1.default.findById(req.params.id);
    if (!answer)
        return res.status(404).json({ message: 'Not found' });
    answer.body = body ?? answer.body;
    await answer.save();
    return res.json(answer);
};
exports.updateAnswer = updateAnswer;
const deleteAnswer = async (req, res) => {
    const answer = await Answer_1.default.findById(req.params.id);
    if (!answer)
        return res.status(404).json({ message: 'Not found' });
    await answer.deleteOne();
    return res.json({ message: 'Answer deleted' });
};
exports.deleteAnswer = deleteAnswer;
//# sourceMappingURL=answers.controller.js.map