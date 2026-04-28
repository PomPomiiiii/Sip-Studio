const express = require('express')
const cors = require('cors')
const { sql, poolPromise } = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('☕ Sip Studio API is running'))

// Place an order
app.post('/api/orders', async (req, res) => {
  try {
    const { drink_name, type, base, milk, syrup, extra, size, temp } = req.body
    const pool = await poolPromise
    const result = await pool.request()
  .input('drink_name', sql.NVarChar, drink_name)
  .input('type', sql.NVarChar, type)
  .input('base', sql.NVarChar, base)
  .input('milk', sql.NVarChar, milk)
  .input('syrup', sql.NVarChar, syrup)
  .input('extra', sql.NVarChar, extra)
  .input('size', sql.NVarChar, size)
  .input('temp', sql.NVarChar, temp)
  .query(`INSERT INTO Orders 
    (drink_name, type, base, milk, syrup, extra, size, temp) 
    VALUES 
    (@drink_name, @type, @base, @milk, @syrup, @extra, @size, @temp);
    SELECT SCOPE_IDENTITY() AS orderId`)

res.json({ success: true, orderId: result.recordset[0].orderId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
})

app.listen(3001, async () => {
  console.log('🚀 Server running on port 3001')
  try {
    await poolPromise
    console.log('✅ DB connection confirmed')
  } catch (err) {
    console.error('❌ DB error:', err.message)
  }
})