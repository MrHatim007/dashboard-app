const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());

// ⚙️ PostgreSQL connection
const pool = new Pool({
  connectionString: 'YOUR_RENDER_DATABASE_URL', // ← ضع رابط قاعدة البيانات هنا
  ssl: { rejectUnauthorized: false }
});

// ✅ جلب الطلبات
app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ✅ تعديل الطلب
app.post('/orders/update', async (req, res) => {
  const updated = req.body;
  try {
    await pool.query(
      `UPDATE orders SET 
        price=$1, total_quantity=$2, product_name=$3, status=$4 
        WHERE order_id=$5`,
      [updated.Price, updated.Total_Quantity, updated.Product_Name, updated.Status, updated.Order_ID]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});