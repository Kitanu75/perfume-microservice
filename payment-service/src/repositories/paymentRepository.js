const db = require('../config/db');

class PaymentRepository {
    async initDB() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                order_id INT NOT NULL,
                user_id VARCHAR(100) NOT NULL,
                amount NUMERIC(10, 2) NOT NULL,
                currency VARCHAR(10) DEFAULT 'INR',
                status VARCHAR(50) DEFAULT 'PENDING',
                transaction_id VARCHAR(255) UNIQUE,
                payment_method VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);
    }

    async findAll() {
        const result = await db.query('SELECT * FROM payments ORDER BY id DESC');
        return result.rows;
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM payments WHERE id = $1', [id]);
        return result.rows[0];
    }

    async findByOrderId(orderId) {
        const result = await db.query('SELECT * FROM payments WHERE order_id = $1', [orderId]);
        return result.rows[0];
    }

    async create(paymentData) {
        const { order_id, user_id, amount, currency, status, transaction_id, payment_method } = paymentData;
        const result = await db.query(
            `INSERT INTO payments (order_id, user_id, amount, currency, status, transaction_id, payment_method) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [order_id, user_id, amount, currency || 'INR', status || 'PENDING', transaction_id, payment_method]
        );
        return result.rows[0];
    }

    async updateStatus(id, status) {
        const result = await db.query(
            `UPDATE payments SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }
}

module.exports = new PaymentRepository();
