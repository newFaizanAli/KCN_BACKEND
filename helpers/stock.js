const { purchase_items, stocks, stock_transactions } = require("../schemas");
const { db } = require("../db");
const { eq } = require("drizzle-orm");

// helpers/stockHelpers.ts
const updateStockAfterGRN = async (orderId) => {
    // Fetch all purchase items for this order
    const items = await db.select().from(purchase_items).where(eq(purchase_items.purchaseId, orderId));

    for (const item of items) {
        const [stock] = await db.select().from(stocks).where(eq(stocks.productId, item.productId));

        let stockId;
        if (stock) {
            // Update existing stock
            const [updatedStock] = await db.update(stocks)
                .set({ quantity: stock.quantity + item.quantity })
                .where(eq(stocks.id, stock.id))
                .returning();
            stockId = updatedStock.id;
        } else {
            // Create new stock
            const [newStock] = await db.insert(stocks)
                .values({ productId: item.productId, quantity: item.quantity })
                .returning();
            stockId = newStock.id;
        }

        // Log stock transaction
        await db.insert(stock_transactions).values({
            stockId,
            quantity: item.quantity,
            type: "PURCHASE",
            reference_id: String(orderId),
            notes: "Stock updated after purchase order completed"
        });
    }
};


module.exports = {
    updateStockAfterGRN
}
