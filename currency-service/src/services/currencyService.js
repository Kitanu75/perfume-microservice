const currencyRepository = require('../repositories/currencyRepository');

class CurrencyService {

    async getSupportedCurrencies() {
        const rates = await currencyRepository.findAll();
        return rates.map(r => r.code);
    }

    async getAllRates() {
        return await currencyRepository.findAll();
    }

    async convert(amount, fromCurrency, toCurrency) {
        if (!amount || isNaN(amount)) throw new Error("Valid amount is required");

        const fromCode = (fromCurrency || 'INR').toUpperCase();
        const toCode = (toCurrency || 'INR').toUpperCase();

        const fromRate = await currencyRepository.findByCode(fromCode);
        const toRate = await currencyRepository.findByCode(toCode);

        if (!fromRate || !toRate) {
            const supported = await this.getSupportedCurrencies();
            throw new Error(`Unsupported currency code. Supported: ${supported.join(', ')}`);
        }

        // Convert: amount in fromCurrency → INR (base) → toCurrency
        const amountInINR = amount / parseFloat(fromRate.rate_to_inr);
        const convertedAmount = amountInINR * parseFloat(toRate.rate_to_inr);

        return {
            amount: Number(convertedAmount.toFixed(2)),
            from: fromCode,
            to: toCode
        };
    }

    async upsertRate(code, rateToINR) {
        if (!code) throw new Error("Currency code is required");
        if (!rateToINR || isNaN(rateToINR)) throw new Error("Valid rate is required");
        return await currencyRepository.upsert(code, rateToINR);
    }
}

module.exports = new CurrencyService();
