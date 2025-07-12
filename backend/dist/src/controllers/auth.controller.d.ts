import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}
export declare const signup: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => Promise<void>;
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const createAdmin: (req: Request, res: Response) => Promise<void>;
export declare const updateUserRole: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=auth.controller.d.ts.map