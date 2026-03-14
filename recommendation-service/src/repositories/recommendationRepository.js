const db = require('../config/db');

class RecommendationRepository {
    async initDB() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS product_views (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(100), -- Can be null for anonymous users
                product_id INT NOT NULL,
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);
    }

    async recordView(userId, productId) {
        const result = await db.query(
            `INSERT INTO product_views (user_id, product_id) VALUES ($1, $2) RETURNING *`,
            [userId, productId]
        );
        return result.rows[0];
    }

    // Get the most viewed products overall
    async getTopProducts(limit = 5) {
        const result = await db.query(`
            SELECT product_id, COUNT(id) as view_count
            FROM product_views
            GROUP BY product_id
            ORDER BY view_count DESC
            LIMIT $1
        `, [limit]);
        return result.rows;
    }

    // Get recently viewed products by a specific user
    async getRecentViewsByUser(userId, limit = 5) {
        const result = await db.query(`
            SELECT DISTINCT product_id
            FROM product_views
            WHERE user_id = $1
            ORDER BY viewed_at DESC
            LIMIT $2
        `, [userId, limit]);
        return result.rows;
    }
}

module.exports = new RecommendationRepository();
