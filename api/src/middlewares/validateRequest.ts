import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export function validateRequest(req: Request, res: Response, next: NextFunction) {
    const errors: any = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: errors.array().map(err => ({
            field: err.param,
            message: err.msg,
        })),
    });
}
