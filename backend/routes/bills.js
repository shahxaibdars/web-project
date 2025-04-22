// routes/bills.js
const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Get all bills
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    
    if (userId) {
      query.user = userId;
    }

    const bills = await Bill.find(query).populate('user', 'name email');
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get upcoming bills
router.get('/upcoming', async (req, res) => {
  try {
    const { userId, days = 7 } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));
    futureDate.setHours(23, 59, 59, 999); // Set to end of day

    const bills = await Bill.find({
      user: userId,
      dueDate: {
        $gte: today,
        $lte: futureDate
      }
    }).sort({ dueDate: 1 });

    res.json({ bills });
  } catch (err) {
    console.error('Error fetching upcoming bills:', err);
    res.status(500).json({ message: 'Failed to fetch upcoming bills' });
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