export interface IAdminRegister {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface IAdminLogin {
    email: string;
    password: string
}

export interface IGetSuperAdminByEmail {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
}