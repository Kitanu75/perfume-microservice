const shippingService = require('../services/shippingService');

class ShippingController {
    async getShipments(req, res) {
        try {
            const shipments = await shippingService.getAllShipments();
            res.status(200).json({ success: true, count: shipments.length, data: shipments });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server Error', details: error.message });
        }
    }

    async getShipmentByOrder(req, res) {
        try {
            const shipment = await shippingService.getShipmentByOrderId(req.params.orderId);
            if (!shipment) return res.status(404).json({ success: false, error: 'Shipment not found' });
            res.status(200).json({ success: true, data: shipment });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async trackShipment(req, res) {
        try {
            const shipment = await shippingService.getShipmentByTrackingNumber(req.params.trackingNumber);
            if (!shipment) return res.status(404).json({ success: false, error: 'Shipment not found' });
            res.status(200).json({ success: true, data: shipment });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async initiateShipment(req, res) {
        try {
            const shipment = await shippingService.createShipment(req.body);
            res.status(201).json({ success: true, data: shipment });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const shipment = await shippingService.updateShipmentStatus(req.params.id, status);
            res.status(200).json({ success: true, data: shipment });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = new ShippingController();
