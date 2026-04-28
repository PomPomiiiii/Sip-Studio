const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('☕ Sip Studio API is running'))

app.post('/api/orders', async (req, res) => {
  try {
    const { drink_name, type, base, milk, syrup, extra, size, temp } = req.body
    const result = await pool.query(
      `INSERT INTO Orders (drink_name, type, base, milk, syrup, extra, size, temp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [drink_name, type, base, milk, syrup, extra, size, temp]
    )
    res.json({ success: true, orderId: result.rows[0].id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
})

app.listen(3001, async () => {
  console.log('🚀 Server running on port 3001')
  try {
    await pool.query('SELECT 1')
    console.log('✅ Connected to Supabase')
  } catch (err) {
    console.error('❌ DB error:', err.message)
  }
})