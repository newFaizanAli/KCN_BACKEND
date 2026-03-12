const express = require("express");
const { db } = require("../../db");
const { goods_receipt_notes } = require("../../schemas");
const { eq } = require("drizzle-orm");
const { updateStockAfterGRN } = require("../../helpers/stock");
const router = express.Router();


const grnWithPurchaseQuery = (condition) => {

    let query = db
        .select({
            id: goods_receipt_notes.id,
            createdAt: goods_receipt_notes.createdAt,
        })
        .from(goods_receipt_notes)

    if (condition) {
        query = query.where(condition);
    }

    return query;
};


router.get('/', async (req, resp) => {
    try {
        const allNotes = await grnWithPurchaseQuery();
        resp.json({ success: true, data: allNotes })
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        resp.json({ success: false, message: 'Internal Server Error' });
    }
})


router.post('/', async (req, res) => {
    try {

        const { purchaseId, createdAt } = req.body;

        const [newNote] = await db.insert(goods_receipt_notes).values({ purchaseId, createdAt }).returning();


        await updateStockAfterGRN(newOrder.id);


        const [note] = await grnWithPurchaseQuery(
            eq(goods_receipt_notes.id, newNote.id)
        );

        res.json({ data: note, success: true });

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
            return res.json({ success: false, message: 'Note ID is required' });
        }
        const [deletedNote] = await db.delete(goods_receipt_notes).where(eq(goods_receipt_notes.id, id)).returning()
        if (!deletedNote) {
            return res.json({ message: 'Note not found', success: false });
        }
        res.json({ success: true, message: 'Note deleted successfully' });
    }
    catch (err) {
        console.error('Error fetching notes:', err);
        res.json({ success: false, message: 'Internal Server Error' });
    }
})
module.exports = router