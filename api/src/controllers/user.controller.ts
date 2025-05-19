import { Request, Response, NextFunction } from "express";
import { IGetUserByEmail, IUserLogin, IUserRegister } from "../types/user.types";
import * as UserServices from "../services/user.service"
import { sendSuccess } from "../helpers/responseHandler";
import { comparePassword } from "../libs/bcrypt";
import HttpException from "../helpers/httpException";
import { jwtCreate } from "../libs/jwt";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password }: IUserRegister = req.body
        const user = await UserServices.registerUser({ name, email, password, role: 'user' })

        sendSuccess(res, 201, 'User berhasil didaftarkan', user)
    } catch (error) {
        next(error)
    }
};

export const loginUser = async (req: Request<{}, {}, IUserLogin>, res: Response, next: NextFunction) => {
    try {
        const { email, password }: IUserLogin = req.body
        const admin: IGetUserByEmail = await UserServices.loginUser(email)

        const isPwdCorrect: boolean = await comparePassword(password, admin.password)
        if (!isPwdCorrect) throw new HttpException(400, 'Akun tidak ditemukan atau tidak aktif')

        const token = await jwtCreate({ id: admin.id, name: admin.name, role: admin.role, email: admin.email })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 3600 * 3000,
        })

        sendSuccess(res, 201, 'Login berhasil', {
            token, admin: {
                name: admin.name,
                role: admin.role,
                email: admin.email
            }
        })

    } catch (error) {
        next(error)
    }
}