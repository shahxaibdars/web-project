// routes/savings.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Savings = require('../models/savings');

// Get all savings goals for a user
router.get('/', auth, async (req, res) => {
  try {
    const savings = await Savings.find({ user: req.user._id });
    res.json(savings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific savings goal
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('Fetching savings goal:', req.params.id);
    const savings = await Savings.findById(req.params.id);
    
    if (!savings) {
      console.log('Savings goal not found');
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    // Check if the savings goal belongs to the user
    if (savings.user.toString() !== req.user._id.toString()) {
      console.log('Unauthorized access attempt');
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    console.log('Savings goal found:', savings);
    res.json(savings);
  } catch (err) {
    console.error('Error fetching savings goal:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new savings goal
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating savings goal with data:', req.body);
    
    if (!req.body) {
      console.error('No request body provided');
      return res.status(400).json({ message: 'Request body is required' });
    }

    const { name, targetAmount, currentAmount = 0 } = req.body;

    if (!name || !targetAmount) {
      console.error('Missing required fields:', { name, targetAmount });
      return res.status(400).json({ 
        message: 'Name and target amount are required' 
      });
    }

    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      console.error('Invalid target amount:', targetAmount);
      return res.status(400).json({ 
        message: 'Target amount must be a positive number' 
      });
    }

    if (typeof currentAmount !== 'number' || currentAmount < 0) {
      console.error('Invalid current amount:', currentAmount);
      return res.status(400).json({ 
        message: 'Current amount must be a non-negative number' 
      });
    }

    const savings = new Savings({
      name,
      targetAmount,
      currentAmount,
      user: req.user._id,
      status: 'in_progress'
    });

    console.log('Saving new savings goal:', savings);
    const newSavings = await savings.save();
    console.log('Saved savings goal:', newSavings);
    
    return res.status(201).json(newSavings);
  } catch (err) {
    console.error('Error creating savings goal:', err);
    return res.status(500).json({ 
      message: 'Failed to create savings goal',
      error: err.message 
    });
  }
});

// Update a savings goal
router.put('/:id', auth, async (req, res) => {
  try {
    const savings = await Savings.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!savings) return res.status(404).json({ message: 'Savings goal not found' });
    res.json(savings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a savings goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const savings = await Savings.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!savings) return res.status(404).json({ message: 'Savings goal not found' });
    res.json({ message: 'Savings goal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update progress for a savings goal
router.patch('/:id/progress', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const savings = await Savings.findOne({ _id: req.params.id, user: req.user._id });
    if (!savings) return res.status(404).json({ message: 'Savings goal not found' });

    savings.currentAmount += amount;
    if (savings.currentAmount >= savings.targetAmount) {
      savings.status = 'completed';
    }
    await savings.save();
    res.json(savings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;