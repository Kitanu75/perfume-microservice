const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const recommendationRoutes = require('./routes/recommendationRoutes');
const recommendationRepository = require('./repositories/recommendationRepository');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/v1/recommendations', recommendationRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'recommendation-service' });
});

const PORT = process.env.PORT || 7007;

const server = app.listen(PORT, async () => {
    console.log(`Recommendation Service running on port ${PORT}`);
    try {
        await recommendationRepository.initDB();
        console.log('Recommendation Database Initialized.');
    } catch (err) {
        console.error('DB Init Error:', err.message);
    }
});

// Graceful shutdown
const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down Recommendation Service gracefully...`);
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
