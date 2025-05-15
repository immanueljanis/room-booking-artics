export interface IAuthRegister {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface IGetSuperAdminByEmail {
    name: string;
    email: string;
}