import { pool } from "../connection/msyql"
import { IAdminRegister, IGetSuperAdminByEmail } from "../types/admin.types"
import { OkPacket, RowDataPacket } from "mysql2"

export async function findAdminByEmail(email: string, password?: boolean, needActive?: boolean): Promise<IGetSuperAdminByEmail[]> {
    const [rows] = await pool.query<(RowDataPacket & IGetSuperAdminByEmail)[]>(
        `
        SELECT id, name, role, email ${password ? ', password' : ''} FROM mst_users WHERE 1=1 
            AND BINARY email = ? 
            AND role IN ("admin", "super_admin") 
            ${needActive ? 'AND active = 1' : ''}
        `,
        [email]
    );
    return rows;
}

export const createUser = async (user: IAdminRegister) => {
    const [result] = await pool.query<OkPacket>(
        `INSERT INTO mst_users (name, email, password, role)
        VALUES(?, ?, ?, ?)`,
        [user.name, user.email, user.password, 'admin']
    )

    return result;
}