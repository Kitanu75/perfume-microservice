const db = require('../config/db');

class AdRepository {
    async initDB() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ads (
                id SERIAL PRIMARY KEY,
                category VARCHAR(100) NOT NULL,
                redirect_url VARCHAR(255) NOT NULL,
                text VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);

        // Seed some initial data if empty
        const countRes = await db.query('SELECT COUNT(*) FROM ads');
        if (parseInt(countRes.rows[0].count) === 0) {
            await db.query(`
                INSERT INTO ads (category, redirect_url, text) VALUES
                ('Men', '/category/men', 'Discover the Bold New Collection for Men - 20% Off!'),
                ('Women', '/category/women', 'Elegance Redefined: Shop the Women''s Signature Series.'),
                ('Unisex', '/category/unisex', 'Find Your Shared Scent - Unisex Classics.'),
                ('Kids', '/category/kids', 'Gentle Fragrances Perfect for Kids.')
            `);
        }
    }

    async findByCategory(category) {
        const result = await db.query(
            'SELECT * FROM ads WHERE category = $1 AND active = true',
            [category]
        );
        return result.rows;
    }

    async findAllActive() {
        const result = await db.query('SELECT * FROM ads WHERE active = true');
        return result.rows;
    }
}

module.exports = new AdRepository();
