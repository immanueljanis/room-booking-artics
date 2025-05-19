import { IUserRegister } from "../types/user.types";
import * as UserRepository from "../repositories/user.repository";
import HttpException from "../helpers/httpException";
import { hashPassword } from "../libs/bcrypt";

export const registerUser = async function (data: IUserRegister) {
    const existing = await UserRepository.findUserByEmail(data.email, false, false);
    if (existing.length) throw new HttpException(400, 'Email sudah terdaftar');

    const hashed = await hashPassword(data.password);

    await UserRepository.createUser({
        name: data.name,
        email: data.email,
        password: hashed,
        role: 'user'
    });

    return {
        name: data.name,
        email: data.email,
        role: 'user'
    };
}

export const loginUser = async function (email: string) {
    const user = await UserRepository.findUserByEmail(email, true, true);
    if (!user.length) throw new HttpException(400, 'Akun tidak ditemukan atau tidak aktif');
    if (user.length >= 2) throw new HttpException(400, 'Akun bermasalah, silahkan hubungi administrator');

    return user[0];
}