const paymentRepository = require('../repositories/paymentRepository');
const { v4: uuidv4 } = require('uuid');

class PaymentService {

    async getAllPayments() {
        return await paymentRepository.findAll();
    }

    async getPaymentByOrderId(orderId) {
        if (!orderId) throw new Error("Order ID is required");
        return await paymentRepository.findByOrderId(orderId);
    }

    async processPayment(paymentData) {
        if (!paymentData.order_id || !paymentData.user_id || !paymentData.amount) {
            throw new Error("Missing required payment information");
        }

        // Check if payment already exists for this order
        const existingPayment = await paymentRepository.findByOrderId(paymentData.order_id);
        if (existingPayment && existingPayment.status === 'COMPLETED') {
            throw new Error("Payment already completed for this order");
        }

        // Simulate external payment gateway processing (e.g., Stripe, Razorpay)
        // In a real scenario, this would involve API calls to the provider.
        const isSuccess = Math.random() > 0.1; // 90% success rate simulation

        const newPaymentReq = {
            order_id: paymentData.order_id,
            user_id: paymentData.user_id,
            amount: paymentData.amount,
            currency: paymentData.currency || 'INR',
            status: isSuccess ? 'COMPLETED' : 'FAILED',
            transaction_id: uuidv4(), // Generate a mock transaction ID
            payment_method: paymentData.payment_method || 'CREDIT_CARD'
        };

        const result = await paymentRepository.create(newPaymentReq);

        if (!isSuccess) {
            throw new Error("Payment failed by mock gateway provider.");
        }

        return result;
    }

    async refundPayment(id) {
        const payment = await paymentRepository.findById(id);
        if (!payment) throw new Error("Payment not found");
        if (payment.status !== 'COMPLETED') throw new Error("Only completed payments can be refunded");

        return await paymentRepository.updateStatus(id, 'REFUNDED');
    }
}

module.exports = new PaymentService();
