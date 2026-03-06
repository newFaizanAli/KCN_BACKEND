const express = require('express');
const router = express.Router();
const { db } = require('../../db');
const { attributes } = require('../../schemas');
const { eq } = require('drizzle-orm');

router.get('/', async (req, res) => {
    try {
        const allAttributes = await db.select().from(attributes);
        res.json({ data: allAttributes, success: true });
    }
    catch (error) {
        console.error('Error fetching attributes:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/product/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        if (!productId) {
            return res.json({ success: false, message: 'Product ID is required' });
        }

        const productAttributes = await db.select().from(attributes).where(eq(attributes.productId, parseInt(productId)));

        res.json({ data: productAttributes, success: true });
    }
    catch (error) {
        console.error('Error fetching product attributes:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});


router.post('/', async (req, res) => {
    const { productId, key, value } = req.body;
    try {

        const [newAttribute] = await db.insert(attributes).values({ productId, key, value }).returning();

        res.json({ data: newAttribute, success: true });

    }
    catch (error) {
        console.error('Error creating attribute:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});


module.exports = router;