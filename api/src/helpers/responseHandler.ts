import { Request, Response, NextFunction } from 'express';
import HttpException from './httpException';

export interface SuccessPayload<T> {
    status: 'success';
    code: number;
    message: string;
    data?: T;
}

export function sendSuccess<T>(
    res: Response,
    code: number,
    message: string,
    data?: T
): Response<SuccessPayload<T>> {
    return res.status(code).json({
        status: 'success',
        message,
        data
    });
}

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const status = err instanceof HttpException ? err.status : 500;
    const message = err.message || 'Internal Server Error';
    const details = err instanceof HttpException ? err.details : undefined;

    res.status(status).json({
        status: 'error',
        message,
        ...(details !== undefined ? { details } : {})
    });
}
