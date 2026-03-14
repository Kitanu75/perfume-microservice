const adService = require('../services/adService');

class AdController {
    async getAds(req, res) {
        try {
            // Expecting categories conceptually passed as CSV query param
            const categoryQuery = req.query.categories;
            const categories = categoryQuery ? categoryQuery.split(',') : [];

            const ads = await adService.getAdsByCategory(categories);
            res.status(200).json({ success: true, count: ads.length, data: ads });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server Error', details: error.message });
        }
    }
}

module.exports = new AdController();
