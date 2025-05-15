import { pool } from "../connection/msyql"
import { IAuthRegister, IGetSuperAdminByEmail } from "../types/auth.types"
import { OkPacket, RowDataPacket } from "mysql2"

export async function findUserByEmail(email: string): Promise<IGetSuperAdminByEmail[]> {
    const [rows] = await pool.query<(RowDataPacket & IGetSuperAdminByEmail)[]>(
        'SELECT name, email FROM mst_users WHERE email = ?',
        [email]
    );
    return rows;
}

export const createUser = async (user: IAuthRegister) => {
    const [result] = await pool.query<OkPacket>(
        `INSERT INTO mst_users (name, email, password, role)
        VALUES(?, ?, ?, ?)`,
        [user.name, user.email, user.password, 'admin']
    )

    return result;
}