const recommendationRepository = require('../repositories/recommendationRepository');

class RecommendationService {
    async recordProductView(userId, productId) {
        if (!productId) throw new Error("Product ID is required to record view");
        return await recommendationRepository.recordView(userId || null, productId);
    }

    async getRecommendations(userId, limit = 5) {
        let recommendations = [];

        // Simple Recommendation Logic:
        // 1. If user is logged in, try to base recommendations on their recent views (mock logic here we just return top if no logic applied)
        // In a real app, this would involve collaborative filtering or content-based algorithms.

        let recentViews = [];
        if (userId) {
            recentViews = await recommendationRepository.getRecentViewsByUser(userId, limit);
        }

        // 2. Fallback to globally popular products
        if (recentViews.length === 0) {
            const topProducts = await recommendationRepository.getTopProducts(limit);
            recommendations = topProducts.map(tp => ({
                product_id: tp.product_id,
                reason: 'POPULAR'
            }));
        } else {
            // Mock: recommending items "similar" to what they viewed. We just return the viewed IDs here for simplicity.
            recommendations = recentViews.map(rv => ({
                product_id: rv.product_id,
                reason: 'BASED_ON_RECENT_VIEWS'
            }));
        }

        // Ensure we always return a list, even if it's empty (e.g., brand new db)
        return recommendations;
    }
}

module.exports = new RecommendationService();
