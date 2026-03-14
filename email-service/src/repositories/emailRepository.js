const db = require('../config/db');

class EmailRepository {
    async initDB() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS emails (
                id SERIAL PRIMARY KEY,
                recipient VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                body TEXT NOT NULL,
                type VARCHAR(50) NOT NULL, -- e.g., 'ORDER_CONFIRMATION', 'WELCOME'
                reference_id VARCHAR(100), -- Associated order_id or user_id
                status VARCHAR(50) DEFAULT 'PENDING',
                sent_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);
    }

    async findAll() {
        const result = await db.query('SELECT * FROM emails ORDER BY created_at DESC');
        return result.rows;
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM emails WHERE id = $1', [id]);
        return result.rows[0];
    }

    async findByRecipient(email) {
        const result = await db.query('SELECT * FROM emails WHERE recipient = $1 ORDER BY created_at DESC', [email]);
        return result.rows;
    }

    async saveEmail(emailData) {
        const { recipient, subject, body, type, reference_id, status, sent_at } = emailData;
        const result = await db.query(
            `INSERT INTO emails (recipient, subject, body, type, reference_id, status, sent_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [recipient, subject, body, type, reference_id, status || 'PENDING', sent_at]
        );
        return result.rows[0];
    }
}

module.exports = new EmailRepository();
