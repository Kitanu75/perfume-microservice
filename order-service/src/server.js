const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');
const orderRepository = require('./repositories/orderRepository');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/v1/orders', orderRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'order-service' });
});

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, async () => {
    console.log(`Order Service running on port ${PORT}`);
    try {
        await orderRepository.initDB();
        console.log('Order Database Initialized.');
    } catch (err) {
        console.error('DB Init Error:', err.message);
    }
});

// Graceful shutdown
const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down Order Service gracefully...`);
    server.close(async () => {
        try {
            const { pool } = require('./config/db');
            await pool.end();
            console.log('Database pool closed.');
        } catch (err) {
            console.error('Error closing DB pool:', err.message);
        }
        process.exit(0);
    });
    setTimeout(() => { process.exit(1); }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
