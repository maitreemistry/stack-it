import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}
export declare const getAllQuestions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getQuestionById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createQuestion: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateQuestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteQuestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const voteQuestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=questions.controller.d.ts.map