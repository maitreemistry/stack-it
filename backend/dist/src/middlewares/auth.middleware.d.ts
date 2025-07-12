import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}
export declare const authenticateUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=auth.middleware.d.ts.map