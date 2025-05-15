import { RowDataPacket } from 'mysql2';

export interface MstFeatureRecord extends RowDataPacket {
    id: number;
    nama: string;
    active: number;
    created_at: Date;
    updated_at: Date;
}