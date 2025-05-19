import { pool } from "../connection/msyql"
import { IGetUserByEmail, IUserRegister } from "../types/user.types";
import { OkPacket, RowDataPacket } from "mysql2"

export async function findUserByEmail(email: string, password?: boolean, needActive?: boolean): Promise<IGetUserByEmail[]> {
    const [rows] = await pool.query<(RowDataPacket & IGetUserByEmail)[]>(
        `
        SELECT id, name, role, email ${password ? ', password' : ''} FROM mst_users WHERE 1=1 
            AND BINARY email = ? 
            AND role IN ("user") 
            ${needActive ? 'AND active = 1' : ''}
        `,
        [email]
    );
    return rows;
}

export const createUser = async (user: IUserRegister) => {
    const [result] = await pool.query<OkPacket>(
        `INSERT INTO mst_users (name, email, password, role)
        VALUES(?, ?, ?, ?)`,
        [user.name, user.email, user.password, 'user']
    )

    return result;
}