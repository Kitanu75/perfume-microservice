const checkoutRepository = require('../repositories/checkoutRepository');

class CheckoutService {
    async getAllCheckouts() {
        return await checkoutRepository.findAll();
    }

    async getCheckoutById(id) {
        if (!id) throw new Error("Checkout ID required");
        return await checkoutRepository.findById(id);
    }

    async processCheckout(checkoutData) {
        // Business Validation
        if (!checkoutData.user_id || !checkoutData.items || !checkoutData.shipping_address) {
            throw new Error("Missing required checkout information");
        }

        // Calculate total amount based on items (business logic mock)
        let calculatedTotal = checkoutData.items.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0);

        // Add dummy shipping cost logically
        const shippingCost = calculatedTotal > 5000 ? 0 : 500;
        calculatedTotal += shippingCost;

        const newCheckout = {
            user_id: checkoutData.user_id,
            items: checkoutData.items,
            total_amount: calculatedTotal,
            shipping_address: checkoutData.shipping_address
        };

        const result = await checkoutRepository.create(newCheckout);

        // In a real EDA, we would publish an 'OrderPlaced' event here.
        return result;
    }

    async completeCheckout(id) {
        return await checkoutRepository.updateStatus(id, 'COMPLETED');
    }
}

module.exports = new CheckoutService();
