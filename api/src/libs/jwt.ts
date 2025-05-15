import jsonwebtoken from "jsonwebtoken"

interface IJWT {
    id: string,
    role: string,
    email: string
}

export const jwtCreate = async ({ id, role, email }: IJWT) => {
    return jsonwebtoken.sign({ id, role, email }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: "3h"
    })
}

export const jwtVerify = async (token: string) => {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY as string)
}