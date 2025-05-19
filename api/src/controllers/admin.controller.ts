import { Request, Response, NextFunction } from "express";
import { IAdminRegister, IAdminLogin, IGetSuperAdminByEmail } from "../types/admin.types";
import * as AdminServices from "../services/admin.service"
import { sendSuccess } from "../helpers/responseHandler";
import { comparePassword } from "../libs/bcrypt";
import HttpException from "../helpers/httpException";
import { jwtCreate } from "../libs/jwt";

export const registerAdmin = async (req: Request<{}, {}, IAdminRegister>, res: Response, next: NextFunction) => {
    try {
        const { name, email, password }: IAdminRegister = req.body
        const admin = await AdminServices.registerAdmin({ name, email, password })

        sendSuccess(res, 201, 'Admin berhasil didaftarkan', admin)
    } catch (error) {
        next(error)
    }
}

export const loginAdmin = async (req: Request<{}, {}, IAdminLogin>, res: Response, next: NextFunction) => {
    try {
        const { email, password }: IAdminLogin = req.body
        const admin: IGetSuperAdminByEmail = await AdminServices.loginAdmin(email)

        const isPwdCorrect: boolean = await comparePassword(password, admin.password)
        if (!isPwdCorrect) throw new HttpException(400, 'Akun Admin tidak ditemukan atau tidak aktif')

        const token = await jwtCreate({ id: admin.id, role: admin.role, email: admin.email })

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