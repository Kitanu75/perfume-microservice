const db = require('../config/db');

// Database Layer for Cart System
class CartRepository {
    async initDB() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS carts (
                user_id VARCHAR(100) PRIMARY KEY,
                items JSONB NOT NULL DEFAULT '[]',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);
    }

    async getCart(user_id) {
        const result = await db.query('SELECT * FROM carts WHERE user_id = $1', [user_id]);
        return result.rows[0];
    }

    async saveCart(user_id, items) {
        const result = await db.query(
            `INSERT INTO carts (user_id, items, updated_at) 
             VALUES ($1, $2, CURRENT_TIMESTAMP) 
             ON CONFLICT (user_id) 
             DO UPDATE SET items = $2, updated_at = CURRENT_TIMESTAMP 
             RETURNING *`,
            [user_id, JSON.stringify(items)]
        );
        return result.rows[0];
    }

    async emptyCart(user_id) {
        const result = await db.query('DELETE FROM carts WHERE user_id = $1 RETURNING *', [user_id]);
        return result.rows[0];
    }
}

module.exports = new CartRepository();
