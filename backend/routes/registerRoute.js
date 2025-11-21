const express = require('express');
const bcrypt = require('bcrypt');
const { getPool } = require('../db');

const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, password required' });
    }

    const pool = await getPool();

    const existing = await pool.request()
      .input('email', email)
      .input('username', username)
      .query(`SELECT * FROM Users WHERE email = @email OR username = @username`);

    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.request()
      .input('username', username)
      .input('email', email)
      .input('password', hash)
      .query(`
        INSERT INTO Users (username, email, password)
        VALUES (@username, @email, @password)
      `);

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;
