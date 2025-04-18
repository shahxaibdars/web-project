// routes/bills.js
const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Get all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().populate('user', 'name email');
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bill by id
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('user', 'name email');
    if (!bill) return res.status(404).json({ message: 'Bill not found.' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create bill
router.post('/', async (req, res) => {
  const { user, name, dueDate, amount, isRecurring } = req.body;
  const bill = new Bill({ user, name, dueDate, amount, isRecurring });
  try {
    const saved = await bill.save();
    res.status(201).json({ message: 'Bill created.', bill: saved });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update bill
router.put('/:id', async (req, res) => {
  try {
    const updated = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Bill not found.' });
    res.json({ message: 'Bill updated.', bill: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete bill
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Bill.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Bill not found.' });
    res.json({ message: 'Bill deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;