import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}
export declare const createAnswer: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAnswer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAnswer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=answers.controller.d.ts.map