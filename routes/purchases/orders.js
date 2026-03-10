const express = require("express");
const { db } = require("../../db");
const { purchase_orders, suppliers } = require("../../schemas");
const { eq } = require("drizzle-orm");
const router = express.Router();


const orderWithSupplierQuery = (condition) => {

    let query = db
        .select({
            id: purchase_orders.id,
            status: purchase_orders.status,
            tax: purchase_orders.tax,
            total_amount: purchase_orders.total_amount,
            createdAt: purchase_orders.createdAt,
            supplierId: suppliers.id,
            supplierName: suppliers.name
        })
        .from(purchase_orders)
        .leftJoin(suppliers, eq(purchase_orders.supplierId, suppliers.id))

    if (condition) {
        query = query.where(condition);
    }

    return query;
};


router.get('/', async (req, resp) => {
    try {
        const allOrders = await orderWithSupplierQuery();
        resp.json({ success: true, data: allOrders })
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        resp.json({ success: false, message: 'Internal Server Error' });
    }
})


router.post('/', async (req, res) => {
    try {

        const { status, tax, total_amount, supplierId } = req.body;

        const [newOrder] = await db.insert(purchase_orders).values({ status, tax, total_amount, supplierId }).returning();

        const [order] = await orderWithSupplierQuery(
            eq(purchase_orders.id, newOrder.id)
        );

        res.json({ data: order, success: true });

    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
})


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, tax, total_amount, supplierId } = req.body;

        if (total_amount === undefined || !supplierId || !status) {
            return res.json({
                success: false,
                message: "Fields are required"
            });
        }

        const [updatedOrder] = await db
            .update(purchase_orders)
            .set({
                ...(status !== undefined && { status }),
                ...(tax !== undefined && { tax }),
                ...(total_amount !== undefined && { total_amount }),
                ...(supplierId && { supplierId }),
            })
            .where(eq(purchase_orders.id, Number(id)))
            .returning();

        if (!updatedOrder) {
            return res.json({
                success: false,
                message: 'Order not found'
            });
        }

        const [order] = await orderWithSupplierQuery(eq(purchase_orders.id, updatedOrder.id));

        res.json({ data: order, success: true });

    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
})


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.json({ success: false, message: 'Order ID is required' });
        }
        const [deletedOrder] = await db.delete(purchase_orders).where(eq(purchase_orders.id, id)).returning()
        if (!deletedOrder) {
            return res.json({ message: 'Order not found', success: false });
        }
        res.json({ success: true, message: 'Order deleted successfully' });
    }
    catch (err) {
        console.error('Error fetching orders:', err);
        res.json({ success: false, message: 'Internal Server Error' });
    }
})
module.exports = router