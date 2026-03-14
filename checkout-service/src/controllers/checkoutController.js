const checkoutService = require('../services/checkoutService');

class CheckoutController {
    async getCheckouts(req, res) {
        try {
            const checkouts = await checkoutService.getAllCheckouts();
            res.status(200).json({ success: true, count: checkouts.length, data: checkouts });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getCheckout(req, res) {
        try {
            const checkout = await checkoutService.getCheckoutById(req.params.id);
            if (!checkout) return res.status(404).json({ success: false, error: 'Checkout not found' });
            res.status(200).json({ success: true, data: checkout });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async initiateCheckout(req, res) {
        try {
            const checkout = await checkoutService.processCheckout(req.body);
            res.status(201).json({ success: true, data: checkout });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async markCompleted(req, res) {
        try {
            const checkout = await checkoutService.completeCheckout(req.params.id);
            res.status(200).json({ success: true, data: checkout });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = new CheckoutController();
