const express = require("express");
const { db } = require("../../db");
const { purchase_orders, purchase_items, products } = require("../../schemas");
const { eq } = require("drizzle-orm");
const router = express.Router();


const itemWithOrderQuery = (condition) => {

    let query = db
        .select({
            id: purchase_items.id,
            quantity: purchase_items.quantity,
            unit_cost: purchase_items.unit_cost,
            total: purchase_items.total,

            purchaseId: purchase_orders.id,
            orderStatus: purchase_orders.status,
            orderTax: purchase_orders.tax,

            productId: products.id,
            productName: products.name,
            productSku: products.sku,

        })
        .from(purchase_items)
        .leftJoin(purchase_orders, eq(purchase_items.purchaseId, purchase_orders.id))
        .leftJoin(products, eq(purchase_items.productId, products.id))

    if (condition) {
        query = query.where(condition);
    }

    return query;
};


router.get('/', async (req, resp) => {
    try {
        const allItems = await itemWithOrderQuery();
        resp.json({ success: true, data: allItems })
    }
    catch (error) {
        console.error('Error fetching items:', error);
        resp.json({ success: false, message: 'Internal Server Error' });
    }
})


router.get('/order/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
        if (!orderId) {
            return res.json({ success: false, message: 'Order ID is required' });
        }

        const orderItems = await itemWithOrderQuery(eq(purchase_orders.id, parseInt(orderId)));

        res.json({ data: orderItems, success: true });
    }
    catch (error) {
        console.error('Error fetching product attributes:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});


router.post('/', async (req, res) => {
    try {

        const { purchaseId, productId, quantity, unit_cost, total } = req.body;

        const [newItems] = await db.insert(purchase_items).values({ purchaseId, productId, quantity, unit_cost, total }).returning();

        const [item] = await itemWithOrderQuery(
            eq(purchase_items.id, newItems.id)
        );



        res.json({ data: item, success: true });

    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
})


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { purchaseId, productId, quantity, unit_cost, total } = req.body;



        if (total === undefined || !purchaseId || !purchaseId) {
            return res.json({
                success: false,
                message: "Fields are required"
            });
        }

        const [updatedItems] = await db
            .update(purchase_items)
            .set({
                ...(purchaseId && { purchaseId }),
                ...(productId && { productId }),
                ...(quantity && { quantity }),
                ...(unit_cost && { unit_cost }),
                ...(total && { total }),
            })
            .where(eq(purchase_items.id, Number(id)))
            .returning();

        if (!updatedItems) {
            return res.json({
                success: false,
                message: 'Items not found'
            });
        }

        const [item] = await itemWithOrderQuery(eq(purchase_items.id, updatedItems.id));

        res.json({ data: item, success: true });

    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
})


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.json({ success: false, message: 'Item ID is required' });
        }

        const [deletedItem] = await db.delete(purchase_items).where(eq(purchase_items.id, id)).returning()
        if (!deletedItem) {
            return res.json({ message: 'Item not found', success: false });
        }
        res.json({ success: true, message: 'Item deleted successfully' });
    }
    catch (err) {
        console.error('Error fetching items:', err);
        res.json({ success: false, message: 'Internal Server Error' });
    }
})


module.exports = router