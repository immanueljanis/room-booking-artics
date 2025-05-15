import * as AuthRepository from '../repositories/auth.repository';
import { IAuthRegister } from '../types/auth.types';
import bcrypt from 'bcrypt';
import HttpException from '../helpers/httpException';

export const registerAdmin = async function (data: IAuthRegister) {
    const existing = await AuthRepository.findUserByEmail(data.email);
    if (existing.length) {
        throw new HttpException(409, 'Email sudah terdaftar');
    }

    const hashed = await bcrypt.hash(data.password, 10);

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
