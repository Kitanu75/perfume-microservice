const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'email_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database (Email Service)');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle pg client (Email Service):', err.message);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};
