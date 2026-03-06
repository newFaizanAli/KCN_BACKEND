const express = require('express');
const { db } = require('../../db');
const { products } = require('../../schemas');
const { eq } = require('drizzle-orm');
const router = express.Router();

router.use('/attributes', require('./attributes'));

router.get('/', async (req, res) => {
    try {
        const allProducts = await db.select().from(products);
        res.json({ data: allProducts, success: true });
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    const { name, categoryId, brand, sku, type, description, price, cost_price } = req.body;
    try {
        const [newProduct] = await db.insert(products).values({
            name, categoryId, brand,
            sku, type, price, cost_price, description
        }).returning();
        res.json({ data: newProduct, success: true });
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, categoryId, brand, sku, type, price, cost_price, description } = req.body;
    try {
        if (!name || !id) {
            return res.json({ success: false, message: 'Name and ID are required' });
        }
        const [updatedProduct] = await db.update(products).set({
            ...(name && { name }),
            ...(categoryId && { categoryId }),
            ...(brand && { brand }),
            ...(sku && { sku }),
            ...(type && { type }),
            ...(price && { price }),
            ...(cost_price && { cost_price }),
            ...(description && { description }),
        }).where(eq(products.id, id)).returning();

        res.json({ data: updatedProduct, success: true, message: 'Product updated successfully' });
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.json({ success: false, message: 'Product ID is required' });
        }
        const [deletedProduct] = await db.delete(products).where(eq(products.id, id)).returning()
        if (!deletedProduct) {
            return res.json({ message: 'Product not found', success: false });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router; 