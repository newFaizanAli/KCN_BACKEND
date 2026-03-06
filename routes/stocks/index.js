const express = require('express');
const { db } = require('../../db');
const { stocks, products } = require('../../schemas');
const { eq } = require('drizzle-orm');
const router = express.Router();



const stockWithProductQuery = (condition) => {

    let query = db
        .select({
            id: stocks.id,
            quantity: stocks.quantity,
            serial_number: stocks.serial_number,
            productId: products.id,
            productName: products.name,
            price: products.price
        })
        .from(stocks)
        .leftJoin(products, eq(stocks.productId, products.id));

    if (condition) {
        query = query.where(condition);
    }

    return query;
};

router.use('/transactions', require('./transactions'));


router.get('/', async (req, res) => {
    try {

        const allStocks = await stockWithProductQuery();

        res.json({ data: allStocks, success: true });
    }
    catch (error) {
        console.error('Error fetching stocks:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {

    const { quantity, productId, serial_number } = req.body;

    try {


        const [newStock] = await db
            .insert(stocks)
            .values({ quantity, productId, serial_number })
            .returning();


        const stock = await stockWithProductQuery(eq(stocks.id, newStock.id))


        res.json({
            success: true,
            data: stock[0]
        });

    } catch (error) {
        console.error('Error creating stock:', error);
        res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});
router.put('/:id', async (req, res) => {

    const { id } = req.params;
    const { quantity, productId, serial_number } = req.body;

    try {


        if (quantity === undefined || !productId) {
            return res.json({
                success: false,
                message: 'Quantity and Product are required'
            });
        }

        const [updatedStock] = await db
            .update(stocks)
            .set({
                ...(quantity !== undefined && { quantity }),
                ...(productId && { productId }),
                ...(serial_number && { serial_number }),
            })
            .where(eq(stocks.id, Number(id)))
            .returning();

        if (!updatedStock) {
            return res.json({
                success: false,
                message: 'Stock not found'
            });
        }

        const stock = await stockWithProductQuery(eq(stocks.id, updatedStock.id));

        res.json({
            success: true,
            data: stock[0],
            message: 'Stock updated successfully'
        });

    } catch (error) {
        console.error('Error updating stock:', error);
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
            return res.json({ success: false, message: 'Stock ID is required' });
        }
        const [deletedStock] = await db.delete(stocks).where(eq(stocks.id, id)).returning()
        if (!deletedStock) {
            return res.json({ message: 'Stock not found', success: false });
        }
        res.json({ success: true, message: 'Stock deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting stock:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router; 