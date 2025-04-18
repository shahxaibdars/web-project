// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get transaction by id
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('user', 'name email');
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create transaction
router.post('/', async (req, res) => {
  const { user, amount, category, description, type } = req.body;
  const transaction = new Transaction({ user, amount, category, description, type });
  try {
    const saved = await transaction.save();
    res.status(201).json({ message: 'Transaction created.', transaction: saved });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Transaction not found.' });
    res.json({ message: 'Transaction updated.', transaction: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Transaction.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Transaction not found.' });
    res.json({ message: 'Transaction deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;