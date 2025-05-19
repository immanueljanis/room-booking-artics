import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../helpers/responseHandler";

export const whoAmI = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name, email, role } = (req as any).user;
        sendSuccess(res, 200, "Success", { id, name, email, role });
    } catch (err) {
        next(err);
    }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/',
        });

        sendSuccess(res, 200, 'Logout berhasil', null);
    } catch (err) {
        next(err);
    }
}