const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/test-connection', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      message: 'Database connected successfully!', 
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Failed to connect to database',
      details: error.message 
    });
  }
});

app.get('/api/tables', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    res.json({ tables: result.rows });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
