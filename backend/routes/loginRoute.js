const express = require('express');
const bcrypt = require('bcrypt');
const { getPool } = require('../db');

const router = express.Router();

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const pool = await getPool();

    const result = await pool.request()
      .input('email', email)
      .query('SELECT * FROM Users WHERE email = @email');

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
