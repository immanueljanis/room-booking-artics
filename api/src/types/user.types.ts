export interface IUserRegister {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface IUserLogin {
    email: string;
    password: string
}

export interface IGetUserByEmail {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
}