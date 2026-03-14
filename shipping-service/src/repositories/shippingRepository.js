const db = require('../config/db');

class ShippingRepository {
    async initDB() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS shipments (
                id SERIAL PRIMARY KEY,
                order_id INT NOT NULL,
                tracking_number VARCHAR(100) UNIQUE,
                provider VARCHAR(100),
                status VARCHAR(50) DEFAULT 'PENDING',
                address JSONB NOT NULL,
                estimated_delivery DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);
    }

    async findAll() {
        const result = await db.query('SELECT * FROM shipments ORDER BY id DESC');
        return result.rows;
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM shipments WHERE id = $1', [id]);
        return result.rows[0];
    }

    async findByOrderId(orderId) {
        const result = await db.query('SELECT * FROM shipments WHERE order_id = $1', [orderId]);
        return result.rows[0];
    }

    async findByTrackingNumber(trackingNumber) {
        const result = await db.query('SELECT * FROM shipments WHERE tracking_number = $1', [trackingNumber]);
        return result.rows[0];
    }

    async create(shipmentData) {
        const { order_id, tracking_number, provider, status, address, estimated_delivery } = shipmentData;
        const result = await db.query(
            `INSERT INTO shipments (order_id, tracking_number, provider, status, address, estimated_delivery) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [order_id, tracking_number, provider || 'Standard Post', status || 'PENDING', JSON.stringify(address), estimated_delivery]
        );
        return result.rows[0];
    }

    async updateStatus(id, status) {
        const result = await db.query(
            `UPDATE shipments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }
}

module.exports = new ShippingRepository();
