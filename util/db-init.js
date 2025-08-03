import mysql from 'mysql2/promise';

export async function ensureDbExists() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ZeroTwoPie3469'
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS training`);
    await connection.end;
}