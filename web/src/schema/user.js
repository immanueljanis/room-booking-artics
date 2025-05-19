import * as yup from 'yup';

export const loginUserSchema = yup.object({
    email: yup
        .string()
        .required('Email wajib diisi')
        .email('Format email tidak valid'),
    password: yup
        .string()
        .required('Password wajib diisi').min(6, 'Password minimal 6 karakter')
}).required();

export const registerUserSchema = yup.object({
    email: yup
        .string()
        .required('Email wajib diisi')
        .email('Format email tidak valid'),
    name: yup
        .string()
        .required('Nama wajib diisi'),
    password: yup
        .string()
        .required('Password wajib diisi')
        .min(6, 'Password minimal 6 karakter'),
});
