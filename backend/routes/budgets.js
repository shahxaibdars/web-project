// routes/budgets.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find().populate('user', 'name email');
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get budget by id
router.get('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id).populate('user', 'name email');
    if (!budget) return res.status(404).json({ message: 'Budget not found.' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create budget
router.post('/', async (req, res) => {
  const { user, month, year, categories } = req.body;
  const budget = new Budget({ user, month, year, categories });
  try {
    const saved = await budget.save();
    res.status(201).json({ message: 'Budget created.', budget: saved });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Budget not found.' });
    res.json({ message: 'Budget updated.', budget: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Budget.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Budget not found.' });
    res.json({ message: 'Budget deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;