const orderRepository = require('../repositories/orderRepository');

class OrderService {

    async getAllOrders() {
        return await orderRepository.findAll();
    }

    async getOrderById(id) {
        if (!id) throw new Error("Order ID is required");
        return await orderRepository.findById(id);
    }

    async getOrdersByUser(userId) {
        if (!userId) throw new Error("User ID is required");
        return await orderRepository.findByUserId(userId);
    }

    async createOrderFromCheckout(checkoutData) {
        if (!checkoutData.checkout_id || !checkoutData.user_id || !checkoutData.order_total) {
            throw new Error("Invalid checkout data for order creation");
        }

        const newOrder = await orderRepository.create(checkoutData);
        return newOrder;
    }

    async markOrderProcessing(id) {
        // Business logic simulation before marking status
        return await orderRepository.updateStatus(id, 'PROCESSING');
    }

    async markOrderShipped(id, trackingNumber) {
        if (!trackingNumber) throw new Error("Tracking number required for shipping status");
        return await orderRepository.updateStatus(id, 'SHIPPED', trackingNumber);
    }

    async markOrderDelivered(id) {
        return await orderRepository.updateStatus(id, 'DELIVERED');
    }
}

module.exports = new OrderService();
