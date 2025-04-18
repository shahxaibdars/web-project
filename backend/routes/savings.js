// routes/savings.js
const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');

// Get all savings goals
router.get('/', async (req, res) => {
  try {
    const goals = await SavingsGoal.find().populate('user', 'name email');
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get savings goal by id
router.get('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id).populate('user', 'name email');
    if (!goal) return res.status(404).json({ message: 'Savings goal not found.' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create savings goal
router.post('/', async (req, res) => {
  const { user, name, targetAmount, currentAmount } = req.body;
  const goal = new SavingsGoal({ user, name, targetAmount, currentAmount });
  try {
    const saved = await goal.save();
    res.status(201).json({ message: 'Savings goal created.', goal: saved });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update savings goal
router.put('/:id', async (req, res) => {
  try {
    const updated = await SavingsGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Savings goal not found.' });
    res.json({ message: 'Savings goal updated.', goal: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete savings goal
router.delete('/:id', async (req, res) => {
  try {
    const removed = await SavingsGoal.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Savings goal not found.' });
    res.json({ message: 'Savings goal deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;