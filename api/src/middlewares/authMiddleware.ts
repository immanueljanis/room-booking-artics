import { Request, Response, NextFunction } from "express";
import HttpException from "../helpers/httpException";
import { jwtVerify } from "../libs/jwt";

export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export const authenticate: (req: Request, res: Response, next: NextFunction) => void = async (req, res, next) => {
    let token = req?.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return next(new HttpException(401, "Token tidak ditemukan"));
    }

    try {
        const payload = await jwtVerify(token);
        (req as any).user = payload;
        next();
    } catch (err) {
        next(new HttpException(401, "Token tidak valid atau sudah kadaluarsa"));
    }
};

export const authorize = (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
        return next(new HttpException(403, "Forbidden"));
    }
    next();
};