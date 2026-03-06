const express = require('express');
const { db } = require('../../db');
const { stock_transactions, stocks, products } = require('../../schemas');
const { eq } = require('drizzle-orm');
const router = express.Router();


const transactionWithStockQuery = (condition) => {

    let query = db
        .select({
            id: stock_transactions.id,
            quantity: stock_transactions.quantity,
            type: stock_transactions.type,
            reference_id: stock_transactions.reference_id,
            notes: stock_transactions.notes,

            productId: products.id,
            productName: products.name,
            stockSerialNumber: stocks.serial_number
        })
        .from(stock_transactions)
        .leftJoin(stocks, eq(stock_transactions.stockId, stocks.id))
        .leftJoin(products, eq(stocks.productId, products.id));

    if (condition) {
        query = query.where(condition);
    }

    return query;
};


router.get('/', async (req, res) => {
    try {

        const allStockTransactions = await transactionWithStockQuery();

        res.json({ data: allStockTransactions, success: true });
    }
    catch (error) {
        console.error('Error fetching stock transactions:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});



router.post('/', async (req, res) => {

    const { quantity, stockId, type, reference_id, notes } = req.body;

    const qty = Number(quantity);

    try {

        // get current stock
        const [stock] = await db
            .select()
            .from(stocks)
            .where(eq(stocks.id, Number(stockId)));

        if (!stock) {
            return res.json({
                success: false,
                message: "Stock not found"
            });
        }

        let updatedQuantity = stock.quantity;

        if (type === "IN") {
            updatedQuantity = updatedQuantity + qty;
        }

        if (type === "OUT") {
            updatedQuantity = updatedQuantity - qty;
        }

        // create transaction
        const [newStockTransaction] = await db
            .insert(stock_transactions)
            .values({ quantity: qty, stockId, type, reference_id, notes })
            .returning();

        // update stock
        await db
            .update(stocks)
            .set({
                quantity: updatedQuantity
            })
            .where(eq(stocks.id, Number(stockId)));

        const stock_transaction =
            await transactionWithStockQuery(
                eq(stock_transactions.id, newStockTransaction.id)
            );

        res.json({
            success: true,
            data: stock_transaction[0]
        });

    } catch (error) {
        console.error('Error creating stock transaction:', error);

        res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});



router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.json({ success: false, message: 'Stock transaction ID is required' });
        }
        const [deletedStockTransaction] = await db.delete(stock_transactions).where(eq(stock_transactions.id, id)).returning()
        if (!deletedStockTransaction) {
            return res.json({ message: 'Stock transaction not found', success: false });
        }
        res.json({ success: true, message: 'Stock transaction deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting stock:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});



module.exports = router; 