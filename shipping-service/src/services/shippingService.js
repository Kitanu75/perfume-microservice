const shippingRepository = require('../repositories/shippingRepository');
const { v4: uuidv4 } = require('uuid');

class ShippingService {
    async getAllShipments() {
        return await shippingRepository.findAll();
    }

    async getShipmentByOrderId(orderId) {
        if (!orderId) throw new Error("Order ID is required");
        return await shippingRepository.findByOrderId(orderId);
    }

    async getShipmentByTrackingNumber(trackingNumber) {
        if (!trackingNumber) throw new Error("Tracking number is required");
        return await shippingRepository.findByTrackingNumber(trackingNumber);
    }

    async createShipment(shipmentReq) {
        if (!shipmentReq.order_id || !shipmentReq.address) {
            throw new Error("Order ID and Shipping Address are required");
        }

        // Mock tracking logic
        const trackingId = `TRK-${uuidv4().substring(0, 8).toUpperCase()}`;

        // Mock estimate (today + 3 to 7 days)
        const daysToAdd = Math.floor(Math.random() * 5) + 3;
        const estimate = new Date();
        estimate.setDate(estimate.getDate() + daysToAdd);

        const newShipment = {
            order_id: shipmentReq.order_id,
            tracking_number: trackingId,
            provider: shipmentReq.provider || 'FedEx Express',
            status: 'LABEL_CREATED',
            address: shipmentReq.address,
            estimated_delivery: estimate
        };

        return await shippingRepository.create(newShipment);
    }

    async updateShipmentStatus(id, status) {
        const validStatuses = ['PENDING', 'LABEL_CREATED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'];
        if (!validStatuses.includes(status)) throw new Error("Invalid shipping status");

        return await shippingRepository.updateStatus(id, status);
    }
}

module.exports = new ShippingService();
