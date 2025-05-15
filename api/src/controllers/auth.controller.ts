import { Request, Response, NextFunction } from "express";
import { IAuthRegister } from "../types/auth.types";
import * as AuthServices from "../services/auth.service"
import { sendSuccess } from "../helpers/responseHandler";

export const registerAdmin = async (req: Request<{}, {}, IAuthRegister>, res: Response, next: NextFunction) => {
    try {
        const { name, email, password }: IAuthRegister = req.body
        const user = await AuthServices.registerAdmin({ name, email, password })

        return sendSuccess(res, 201, 'Admin berhasil didaftarkan', user)
    } catch (error) {
        next(error)
    }
}