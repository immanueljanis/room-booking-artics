import bcrypt from "bcrypt"

const saltRounds: number = 10

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (passwordBody: string, passwordDb: any) => {
    return await bcrypt.compare(passwordBody, passwordDb)
}