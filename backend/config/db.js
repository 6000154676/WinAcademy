require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL Database');
        connection.release();
    })
    .catch(err => {
        console.error('Unexpected error connecting to MySQL', err);
    });

module.exports = {
    // Wrapper to simulate pg's { rows } return type for SELECT queries
    // while still returning the standard mysql object for INSERTs.
    query: async (text, params) => {
        const [result] = await pool.query(text, params);
        if (Array.isArray(result)) {
            return { rows: result };
        }
        return result; // For INSERT/UPDATE/DELETE, return the object (contains insertId)
    },
};
