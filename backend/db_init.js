const pool = require('./db_connection');

async function createTable() {
    console.log("Create table in database");
    try {
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

        await pool.query(createUserTableQuery);
        await pool.query(createMessageTableQuery);
        console.log('Tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}

createTable();


