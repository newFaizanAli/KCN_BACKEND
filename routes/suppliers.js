const express = require('express');
const router = express.Router();
const { suppliers } = require('../schemas');
const { db } = require('../db');
const { protect } = require('../middleware/auth');
const { eq } = require('drizzle-orm');


// Get all suppliers
router.get('/', protect, async (req, res) => {
    try {
        const allSuppliers = await db.select().from(suppliers);
        res.json({ data: allSuppliers, success: true });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.json({ error: 'Internal Server Error' });
    }
});


// Create a new supplier
router.post('/', protect, async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {

        if (!name) {
            return res.json({ message: 'Name is required', success: false });
        }

        const [newSupplier] = await db.insert(suppliers).values({ name, email, phone, address }).returning();
        res.json({ data: newSupplier, success: true, message: 'Supplier created successfully' });

    } catch (error) {
        console.error('Error creating supplier:', error);
        response.json({ error: 'Internal Server Error' });
    }
});


// Update a supplier
router.put('/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if (!name) {
            return res.json({ message: 'Name is required', success: false });
        }
        const [updatedSupplier] = await db.update(suppliers).set({
            ...(req.body && { ...req.body })
        }).where(eq(suppliers.id, id)).returning();

        if (!updatedSupplier) {
            return res.json({ message: 'Supplier not found', success: false });
        }
        res.json({ data: updatedSupplier, success: true, message: 'Supplier updated successfully' });
    }
    catch (error) {
        console.error('Error updating supplier:', error);
        res.json({ error: 'Internal Server Error' });
    }
});

// // Delete a supplier
router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSupplier = await db.delete(suppliers).where(eq(suppliers.id, id)).returning()
        if (!deletedSupplier.length) {
            return res.json({ message: 'Supplier not found', success: false });
        }
        res.json({ data: deletedSupplier[0], success: true, message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.json({ error: 'Internal Server Error' });
    }
});

module.exports = router;