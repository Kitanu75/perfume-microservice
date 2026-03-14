const db = require('../config/db');

class CheckoutRepository {
    async initDB() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS checkouts (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(100) NOT NULL,
                items JSONB NOT NULL,
                total_amount NUMERIC(10, 2) NOT NULL,
                shipping_address JSONB NOT NULL,
                status VARCHAR(50) DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);
    }

    async findAll() {
        const result = await db.query('SELECT * FROM checkouts ORDER BY id DESC');
        return result.rows;
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM checkouts WHERE id = $1', [id]);
        return result.rows[0];
    }

    async create(checkoutData) {
        const { user_id, items, total_amount, shipping_address } = checkoutData;
        const result = await db.query(
            `INSERT INTO checkouts (user_id, items, total_amount, shipping_address, status) 
             VALUES ($1, $2, $3, $4, 'PENDING') RETURNING *`,
            [user_id, JSON.stringify(items), total_amount, JSON.stringify(shipping_address)]
        );
        return result.rows[0];
    }

    async updateStatus(id, status) {
        const result = await db.query(
            `UPDATE checkouts SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }
}

module.exports = new CheckoutRepository();
