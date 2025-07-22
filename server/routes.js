import express from 'express';
import pool from './db.js'; // ← تأكد أن db.js في نفس المجلد

const router = express.Router();

// تحديث الطلب
router.post('/update', async (req, res) => {
  const order = req.body;

  try {
    const result = await pool.query(
      `UPDATE orders SET 
        price = $1,
        total_quantity = $2,
        product_name = $3,
        status = $4
      WHERE order_id = $5`,
      [order.Price, order.Total_Quantity, order.Product_Name, order.Status, order.Order_ID]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error updating DB:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;