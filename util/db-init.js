import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function ensureDbExists() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASS,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.end;
}