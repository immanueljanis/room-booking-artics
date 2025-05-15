import { pool } from "../connection/msyql"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { IFeature } from "../types/feature.types";
import { MstFeatureRecord } from "../types/table/mstFeatures";
import { ParsedFilter, ParsedQuery } from "../helpers/queryParser";

export async function getAllFeatures(filters: ParsedFilter[], sortBy: string, order: "ASC" | "DESC", limit: number, offset: number): Promise<MstFeatureRecord[]> {
    let sql = `
      SELECT id, name, active
      FROM mst_features
    `;
    const params: (string | number)[] = [];

    if (filters.length) {
        const clauses = filters.map(f => {
            params.push(f.value);
            return `${f.column} ${f.operator} ?`;
        });
        sql += " WHERE " + clauses.join(" AND ");
    }

    sql += ` ORDER BY ${sortBy} ${order}`;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query<MstFeatureRecord[]>(sql, params);
    return rows;
}

export const createFeature = async (feature: string) => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO mst_features (name) 
        VALUES(?)`,
        [feature]
    )

    return result;
}

export const findFeatureByName = async (feature: string) => {
    const [result] = await pool.query<IFeature & RowDataPacket[]>(
        `SELECT id, name, active FROM mst_features WHERE UPPER(name) = ?`,
        [feature.toUpperCase()]
    )

    return result
}

export const findFeatureById = async (id: number) => {
    const [result] = await pool.query<IFeature & RowDataPacket[]>(
        `SELECT id, name, active FROM mst_features WHERE id = ? AND active=1`,
        [id]
    )

    return result[0]
}

export const deleteFeatureById = async (id: number) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        const [result] = await conn.query<ResultSetHeader>(
            `UPDATE mst_features SET active = 0 WHERE id = ?`,
            [id]
        )

        if (result.affectedRows != 1) {
            await conn.rollback();
            throw new Error('Something went wrong, rolling back!');
        }

        await conn.commit();

        return result;
    } catch (error) {
        conn.rollback()
    } finally {
        conn.release();
    }
}