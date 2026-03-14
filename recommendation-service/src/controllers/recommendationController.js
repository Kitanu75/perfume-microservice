const recommendationService = require('../services/recommendationService');

class RecommendationController {

    async recordView(req, res) {
        try {
            const { userId, productId } = req.body;
            const viewRecord = await recommendationService.recordProductView(userId, productId);
            res.status(201).json({ success: true, data: viewRecord });
        } catch (error) {
            res.status(400).json({ success: false, error: 'Database Error', details: error.message });
        }
    }

    async getRecommendations(req, res) {
        try {
            const { userId, limit } = req.query;
            const parsedLimit = limit ? parseInt(limit, 10) : 5;

            const recommendations = await recommendationService.getRecommendations(userId, parsedLimit);
            res.status(200).json({ success: true, count: recommendations.length, data: recommendations });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server Error', details: error.message });
        }
    }
}

module.exports = new RecommendationController();
