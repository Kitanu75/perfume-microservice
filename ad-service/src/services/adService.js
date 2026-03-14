const adRepository = require('../repositories/adRepository');

class AdService {
    async getAdsByCategory(categories = []) {
        if (!categories || categories.length === 0) {
            // If no specific category, return a random active ad
            const allAds = await adRepository.findAllActive();
            if (allAds.length === 0) return [];
            return [allAds[Math.floor(Math.random() * allAds.length)]];
        }

        let adsToReturn = [];
        for (const cat of categories) {
            const ads = await adRepository.findByCategory(cat);
            if (ads.length > 0) {
                adsToReturn.push(ads[Math.floor(Math.random() * ads.length)]); // Pick random ad for the category
            }
        }

        return adsToReturn;
    }
}

module.exports = new AdService();
