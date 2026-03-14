const cartService = require('../services/cartService');

class CartController {
    async getCart(req, res) {
        try {
            const userId = req.params.userId;
            const cart = await cartService.getCart(userId);
            res.status(200).json({ success: true, data: cart });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async addItem(req, res) {
        try {
            const userId = req.params.userId;
            const cart = await cartService.addItemToCart(userId, req.body);
            res.status(200).json({ success: true, data: cart });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async updateItem(req, res) {
        try {
            const userId = req.params.userId;
            const productId = parseInt(req.params.productId);
            const { quantity } = req.body;

            if (quantity === undefined || isNaN(productId)) {
                return res.status(400).json({ success: false, error: "Valid product ID and quantity required" });
            }

            const cart = await cartService.updateItemQuantity(userId, productId, quantity);
            res.status(200).json({ success: true, data: cart });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async emptyCart(req, res) {
        try {
            const userId = req.params.userId;
            await cartService.emptyCart(userId);
            res.status(200).json({ success: true, message: "Cart emptied successfully" });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = new CartController();
