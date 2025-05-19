import { body } from 'express-validator';

export const adminRegisterRules = [
    body('name')
        .notEmpty()
        .withMessage('Nama wajib diisi')
        .isString()
        .withMessage('Nama harus berupa teks'),

    body('email')
        .notEmpty()
        .withMessage('Email wajib diisi')
        .isEmail()
        .withMessage('Format email tidak valid'),

    body('password')
        .notEmpty()
        .withMessage('Password wajib diisi')
        .isLength({ min: 6 })
        .withMessage('Password minimal 6 karakter'),
];
