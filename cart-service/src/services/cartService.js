const cartRepository = require('../repositories/cartRepository');

// Business Logic Layer
class CartService {

    async getCart(userId) {
        if (!userId) throw new Error("User ID is required");

        let cart = await cartRepository.getCart(userId);
        if (!cart) {
            // Return empty cart structure if not exists
            cart = { user_id: userId, items: [] };
        }
        return cart;
    }

    async addItemToCart(userId, item) {
        if (!userId) throw new Error("User ID is required");
        if (!item || !item.product_id || !item.quantity) throw new Error("Invalid item format");

        let cart = await this.getCart(userId);
        let items = Array.isArray(cart.items) ? cart.items : [];

        // Check if item already exists in cart
        const existingItemIndex = items.findIndex(i => i.product_id === item.product_id);

        if (existingItemIndex > -1) {
            items[existingItemIndex].quantity += item.quantity;
        } else {
            items.push(item);
        }

        return await cartRepository.saveCart(userId, items);
    }

    async updateItemQuantity(userId, productId, quantity) {
        if (!userId) throw new Error("User ID is required");
        let cart = await this.getCart(userId);
        let items = Array.isArray(cart.items) ? cart.items : [];

        const existingItemIndex = items.findIndex(i => i.product_id === productId);
        if (existingItemIndex > -1) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                items.splice(existingItemIndex, 1);
            } else {
                items[existingItemIndex].quantity = quantity;
            }
        }

        return await cartRepository.saveCart(userId, items);
    }

    async emptyCart(userId) {
        if (!userId) throw new Error("User ID is required");
        return await cartRepository.emptyCart(userId);
    }
}

module.exports = new CartService();
