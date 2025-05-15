import * as AuthRepository from '../repositories/auth.repository';
import { IAdminRegister } from '../types/admin.types';
import HttpException from '../helpers/httpException';
import { hashPassword } from '../libs/bcrypt';

export const registerAdmin = async function (data: IAdminRegister) {
    const existing = await AuthRepository.findAdminByEmail(data.email);
    if (existing.length) throw new HttpException(400, 'Email sudah terdaftar');

    const hashed = await hashPassword(data.password);

    await AuthRepository.createUser({
        name: data.name,
        email: data.email,
        password: hashed,
        role: 'admin'
    });

    return {
        name: data.name,
        email: data.email,
        role: 'admin'
    };
}

export const loginAdmin = async function (email: string) {
    const admin = await AuthRepository.findAdminByEmail(email, true);
    if (!admin.length) throw new HttpException(400, 'Akun Admin tidak ditemukan atau tidak aktif');
    if (admin.length >= 2) throw new HttpException(400, 'Akun Admin bermasalah, silahkan hubungi administrator');

    return admin[0];
}