const orderService = require('../services/orderService');

class OrderController {
    async getOrders(req, res) {
        try {
            const { userId } = req.query;
            let orders;

            if (userId) {
                orders = await orderService.getOrdersByUser(userId);
            } else {
                orders = await orderService.getAllOrders();
            }

            res.status(200).json({ success: true, count: orders.length, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server Error', details: error.message });
        }
    }

    async getOrder(req, res) {
        try {
            const order = await orderService.getOrderById(req.params.id);
            if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async createOrder(req, res) {
        try {
            const order = await orderService.createOrderFromCheckout(req.body);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const { status, tracking_number } = req.body;
            const id = req.params.id;
            let order;

            switch (status) {
                case 'PROCESSING':
                    order = await orderService.markOrderProcessing(id);
                    break;
                case 'SHIPPED':
                    order = await orderService.markOrderShipped(id, tracking_number);
                    break;
                case 'DELIVERED':
                    order = await orderService.markOrderDelivered(id);
                    break;
                default:
                    return res.status(400).json({ success: false, error: 'Invalid status' });
            }

            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = new OrderController();
