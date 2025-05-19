import * as yup from "yup"

export const adminLoginSchema = yup.object({
    email: yup
        .string()
        .required('Email wajib diisi')
        .email('Format email tidak valid'),
    password: yup
        .string()
        .required('Password wajib diisi').min(6, 'Password minimal 6 karakter')
}).required();

export const adminRegisterSchema = yup.object({
    name: yup.string().required('Nama wajib diisi'),
    email: yup.string().required('Email wajib diisi').email('Format email tidak valid'),
    password: yup.string().required('Password wajib diisi').min(6, 'Password minimal 6 karakter'),
});