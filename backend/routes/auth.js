// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registration endpoint
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists.' });
    user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login endpoint (simple password comparison; in production, use hashed passwords and JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(400).json({ message: 'Invalid credentials.' });
    res.json({ message: 'Login successful.', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;