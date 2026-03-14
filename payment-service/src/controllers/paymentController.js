const paymentService = require('../services/paymentService');

class PaymentController {
    async getPayments(req, res) {
        try {
            const payments = await paymentService.getAllPayments();
            res.status(200).json({ success: true, count: payments.length, data: payments });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server Error', details: error.message });
        }
    }

    async getPaymentByOrder(req, res) {
        try {
            const payment = await paymentService.getPaymentByOrderId(req.params.orderId);
            if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
            res.status(200).json({ success: true, data: payment });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async createPayment(req, res) {
        try {
            const payment = await paymentService.processPayment(req.body);
            res.status(201).json({ success: true, data: payment });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async refundPayment(req, res) {
        try {
            const payment = await paymentService.refundPayment(req.params.id);
            res.status(200).json({ success: true, data: payment });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = new PaymentController();
