// routes/budgets.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Get all budgets
router.get('/', auth, async (req, res) => {
  try {
    const { userId, month, year } = req.query;
    let query = {};

    if (userId) {
      query.user = userId;
    }
    if (month) {
      query.month = parseInt(month);
    }
    if (year) {
      query.year = parseInt(year);
    }

    const budgets = await Budget.find(query).populate('user', 'name email');
    res.json({ budget: budgets[0] || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get budget summary
router.get('/summary', auth, async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get current month's budget
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const budget = await Budget.findOne({
      user: userId,
      month: currentMonth,
      year: currentYear
    });

    if (!budget) {
      return res.json({
        totalBudgeted: 0,
        totalSpent: 0,
        remainingBudget: 0,
        mostOverspentCategory: null,
        healthiestCategory: null
      });
    }

    const totalBudgeted = budget.categories.reduce((sum, cat) => sum + cat.limit, 0);
    const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
    const remainingBudget = totalBudgeted - totalSpent;

    // Find most overspent and healthiest categories
    let mostOverspentCategory = null;
    let healthiestCategory = null;
    let maxOverspent = 0;
    let minSpentPercentage = 100;

    budget.categories.forEach(category => {
      const spentPercentage = (category.spent / category.limit) * 100;
      
      if (spentPercentage > 100 && (spentPercentage - 100) > maxOverspent) {
        maxOverspent = spentPercentage - 100;
        mostOverspentCategory = category.category;
      }
      
      if (spentPercentage < minSpentPercentage) {
        minSpentPercentage = spentPercentage;
        healthiestCategory = category.category;
      }
    });

    res.json({
      totalBudgeted,
      totalSpent,
      remainingBudget,
      mostOverspentCategory,
      healthiestCategory
    });
  } catch (err) {
    console.error('Error fetching budget summary:', err);
    res.status(500).json({ message: 'Failed to fetch budget summary' });
  }
});

// Get budget by id
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id).populate('user', 'name email');
    if (!budget) return res.status(404).json({ message: 'Budget not found.' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create budget
router.post('/', auth, async (req, res) => {
  const { user, month, year, categories } = req.body;
  const budget = new Budget({ user, month, year, categories });
  try {
    const saved = await budget.save();
    res.status(201).json({ message: 'Budget created.', budget: saved });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const removed = await Budget.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Budget not found.' });
    res.json({ message: 'Budget deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create budget category
router.post('/:userId/:month/:year', auth, async (req, res) => {
  const { userId, month, year } = req.params;
  const { category, limit } = req.body;

  try {
    // Find existing budget for the month/year
    let budget = await Budget.findOne({ user: userId, month: parseInt(month), year: parseInt(year) });

    if (!budget) {
      // Create new budget if none exists
      budget = new Budget({
        user: userId,
        month: parseInt(month),
        year: parseInt(year),
        categories: [{ category, limit, spent: 0 }]
      });
    } else {
      // Add category to existing budget
      budget.categories.push({ category, limit, spent: 0 });
    }

    const saved = await budget.save();
    res.status(201).json({ message: 'Budget category created.', budget: saved });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update budget limit for a category
router.post('/update-limit', auth, async (req, res) => {
  try {
    const { user, category, amount, isIncome } = req.body;
    if (!user || !category || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const currentDate = new Date();
    let budget = await Budget.findOne({
      user,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    });

    if (!budget) {
      budget = new Budget({
        user,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        categories: []
      });
    }

    const categoryIndex = budget.categories.findIndex(c => c.category === category);
    if (categoryIndex === -1) {
      budget.categories.push({
        category,
        limit: isIncome ? amount : 0,
        spent: 0
      });
    } else {
      budget.categories[categoryIndex].limit += isIncome ? amount : 0;
    }

    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update spent amount for a category
router.post('/update-spent', auth, async (req, res) => {
  try {
    const { user, category, amount } = req.body;
    if (!user || !category || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const currentDate = new Date();
    let budget = await Budget.findOne({
      user,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    });

    if (!budget) {
      budget = new Budget({
        user,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        categories: []
      });
    }

    const categoryIndex = budget.categories.findIndex(c => c.category === category);
    if (categoryIndex === -1) {
      budget.categories.push({
        category,
        limit: 0,
        spent: amount
      });
    } else {
      budget.categories[categoryIndex].spent += amount;
    }

    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Budget not found.' });
    res.json({ message: 'Budget updated.', budget: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;