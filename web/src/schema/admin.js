import * as yup from "yup"

export const adminLoginSchema = yup.object({
    email: yup
        .string()
        .required('Email wajib diisi')
        .email('Format email tidak valid'),
    password: yup
        .string()
        .required('Password wajib diisi')
}).required();
