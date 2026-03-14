const db = require('../config/db');

class CurrencyRepository {
    async initDB() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS exchange_rates (
                code VARCHAR(10) PRIMARY KEY,
                rate_to_inr NUMERIC(14, 6) NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);

        // Seed default exchange rates if table is empty
        const countRes = await db.query('SELECT COUNT(*) FROM exchange_rates');
        if (parseInt(countRes.rows[0].count) === 0) {
            await db.query(`
                INSERT INTO exchange_rates (code, rate_to_inr) VALUES
                ('INR', 1.000000),
                ('USD', 0.012000),
                ('EUR', 0.011000),
                ('GBP', 0.009400),
                ('JPY', 1.810000),
                ('CAD', 0.016000),
                ('AUD', 0.018000)
            `);
            console.log('Seeded default exchange rates.');
        }
    }

    async findAll() {
        const result = await db.query('SELECT * FROM exchange_rates ORDER BY code ASC');
        return result.rows;
    }

    async findByCode(code) {
        const result = await db.query('SELECT * FROM exchange_rates WHERE code = $1', [code]);
        return result.rows[0];
    }

    async upsert(code, rateToINR) {
        const result = await db.query(
            `INSERT INTO exchange_rates (code, rate_to_inr, updated_at)
             VALUES ($1, $2, CURRENT_TIMESTAMP)
             ON CONFLICT (code)
             DO UPDATE SET rate_to_inr = $2, updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [code.toUpperCase(), rateToINR]
        );
        return result.rows[0];
    }
}

module.exports = new CurrencyRepository();
