const currencyService = require('../services/currencyService');

class CurrencyController {

    async getCurrencies(req, res) {
        try {
            const currencies = await currencyService.getSupportedCurrencies();
            res.status(200).json({ success: true, count: currencies.length, data: currencies });
        } catch (error) {
            console.error('Error in getCurrencies:', error.message);
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }

    async getRates(req, res) {
        try {
            const rates = await currencyService.getAllRates();
            res.status(200).json({ success: true, count: rates.length, data: rates });
        } catch (error) {
            console.error('Error in getRates:', error.message);
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }

    async convertCurrency(req, res) {
        try {
            const { amount, from, to } = req.body;

            const converted = await currencyService.convert(
                parseFloat(amount),
                from,
                to
            );

            res.status(200).json({ success: true, data: converted });
        } catch (error) {
            console.error('Error in convertCurrency:', error.message);
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async upsertRate(req, res) {
        try {
            const { code, rate_to_inr } = req.body;
            const rate = await currencyService.upsertRate(code, rate_to_inr);
            res.status(200).json({ success: true, data: rate });
        } catch (error) {
            console.error('Error in upsertRate:', error.message);
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = new CurrencyController();
