const express = require('express');
const router = express.Router();
const { customers } = require('../schemas');
const { db } = require('../db');
const { protect } = require('../middleware/auth');
const { eq } = require('drizzle-orm');


// Get all customers
router.get('/', protect, async (req, res) => {
    try {
        const allCustomers = await db.select().from(customers);
        res.json({ data: allCustomers, success: true });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.json({ error: 'Internal Server Error' });
    }
});


// Create a new customer
router.post('/', protect, async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {

        if (!name) {
            return res.json({ message: 'Name is required', success: false });
        }

        const [newCustomer] = await db.insert(customers).values({ name, email, phone, address }).returning();
        res.json({ data: newCustomer, success: true, message: 'Customer created successfully' });

    } catch (error) {
        console.error('Error creating customer:', error);
        response.json({ error: 'Internal Server Error' });
    }
});


// Update a customer
router.put('/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if (!name) {
            return res.json({ message: 'Name is required', success: false });
        }
        const [updatedCustomer] = await db.update(customers).set({
            ...(req.body && { ...req.body })
        }).where(eq(customers.id, id)).returning();

        if (!updatedCustomer) {
            return res.json({ message: 'Customer not found', success: false });
        }
        res.json({ data: updatedCustomer, success: true, message: 'Customer updated successfully' });
    }
    catch (error) {
        console.error('Error updating customer:', error);
        res.json({ error: 'Internal Server Error' });
    }
});

// // Delete a customer
router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCustomer = await db.delete(customers).where(eq(customers.id, id)).returning()
        if (!deletedCustomer.length) {
            return res.json({ message: 'Customer not found', success: false });
        }
        res.json({ data: deletedCustomer[0], success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.json({ error: 'Internal Server Error' });
    }
});

module.exports = router;