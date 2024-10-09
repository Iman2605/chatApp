const {Pool, Client}  = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT,
});

const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT,
});

async function createTable() {
    console.log("Create table in database");
    try {
        await client.connect();

        const createUserTableQuery = `
            CREATE TABLE IF NOT EXISTS "user" (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(100)
            );
        `;

        const createMessageTableQuery = `
            CREATE TABLE IF NOT EXISTS "message" (
                message_id SERIAL PRIMARY KEY,
                sender BIGINT,
                text VARCHAR(300),
                time TIME,
                FOREIGN KEY (sender) REFERENCES "user"(user_id)
            );
        `;

        const res = await client.query(createUserTableQuery);
        const res1 = await client.query(createMessageTableQuery);
        console.log('Table user created successfully:', res);
        console.log('Table message created successfully:', res1);

    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await client.end();
    }
}

createTable();

module.exports = pool;