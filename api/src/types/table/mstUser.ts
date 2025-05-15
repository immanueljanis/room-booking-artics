import { RowDataPacket } from 'mysql2';

export interface MstUserRecord extends RowDataPacket {
    id: string,
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'super_admin' | 'user',
    active: number,
    created_at: Date,
    updated_at: Date
}