const express = require('express');
const router = express.Router();
const { categories } = require('../schemas');
const { db } = require('../db');
const { protect } = require('../middleware/auth');
const { eq } = require('drizzle-orm');


// Get all categories
router.get('/', protect, async (req, res) => {
    try {
        const allCategories = await db.select().from(categories);
        res.json({ data: allCategories, success: true });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.json({ error: 'Internal Server Error' });
    }
});


// Create a new category
router.post('/', protect, async (req, res) => {
    const { name } = req.body;
    try {

        if (!name) {
            return res.json({ message: 'Name is required', success: false });
        }

        const [newCategory] = await db.insert(categories).values({ name }).returning();
        res.json({ data: newCategory, success: true, message: 'Category created successfully' });

    } catch (error) {
        console.error('Error creating category:', error);
        response.json({ error: 'Internal Server Error' });
    }
});


// Update a category
router.put('/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if (!name) {
            return res.json({ message: 'Name is required', success: false });
        }
        const [updatedCategory] = await db.update(categories).set({
            ...(name && { name }),
        }).where(eq(categories.id, id)).returning();

        if (!updatedCategory) {
            return res.json({ message: 'Category not found', success: false });
        }
        res.json({ data: updatedCategory, success: true, message: 'Category updated successfully' });
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.json({ error: 'Internal Server Error' });
    }
});

// Delete a category
router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await db.delete(categories).where(eq(categories.id, id)).returning()
        if (!deletedCategory.length) {
            return res.json({ message: 'Category not found', success: false });
        }
        res.json({ data: deletedCategory[0], success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.json({ error: 'Internal Server Error' });
    }
});

module.exports = router;