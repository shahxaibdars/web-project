// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

// Get all transactions for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { type, category, startDate, endDate, month, year, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.user._id };
    
    if (type) query.type = type;
    if (category) query.category = category;
    
    // Handle month and year filtering
    if (month !== undefined && year !== undefined) {
      // Create start and end dates for the specified month
      const startOfMonth = new Date(parseInt(year), parseInt(month), 1, 0, 0, 0, 0);
      const endOfMonth = new Date(parseInt(year), parseInt(month) + 1, 0, 23, 59, 59, 999);
      
      query.date = {
        $gte: startOfMonth,
        $lte: endOfMonth
      };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error in GET /transactions:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a single transaction
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper function to update budget
async function updateBudget(transaction, isDelete = false) {
  const transactionDate = new Date(transaction.date);
  let budget = await Budget.findOne({
    user: transaction.user,
    month: transactionDate.getMonth(),
    year: transactionDate.getFullYear()
  });

  if (!budget) {
    // Create new budget if none exists
    budget = new Budget({
      user: transaction.user,
      month: transactionDate.getMonth(),
      year: transactionDate.getFullYear(),
      categories: []
    });
  }

  const categoryIndex = budget.categories.findIndex(c => c.category === transaction.category);
  
  if (categoryIndex === -1) {
    // Add new category if it doesn't exist
    budget.categories.push({
      category: transaction.category,
      limit: transaction.type === 'income' ? transaction.amount : 0,
      spent: transaction.type === 'expense' ? transaction.amount : 0
    });
  } else {
    if (transaction.type === 'expense') {
      // For expenses, update spent amount
      budget.categories[categoryIndex].spent += isDelete ? -transaction.amount : transaction.amount;
    } else if (transaction.type === 'income') {
      // For income, extend the budget limit
      budget.categories[categoryIndex].limit += isDelete ? -transaction.amount : transaction.amount;
    }
  }
  
  await budget.save();
}

// Create a new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { user, type, amount, category, description, date } = req.body;
    if (!user || !type || !amount || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const transaction = new Transaction({
      user,
      type,
      amount,
      category,
      description,
      date: date || new Date()
    });

    const savedTransaction = await transaction.save();
    
    // Update budget after saving transaction
    await updateBudget(savedTransaction);

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a transaction
router.put('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['type', 'amount', 'category', 'description', 'date', 'status', 'tags', 'attachments'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Store old values for budget update
    const oldTransaction = { ...transaction.toObject() };

    // Update transaction
    updates.forEach(update => transaction[update] = req.body[update]);
    await transaction.save();

    // Update budgets for both old and new transaction
    await updateBudget(oldTransaction, true); // Remove old transaction's impact
    await updateBudget(transaction); // Add new transaction's impact

    res.json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update budget before deleting
    await updateBudget(transaction, true);

    await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get transaction summary
router.get('/summary/overview', auth, async (req, res) => {
  try {
    const { startDate, endDate, month, year } = req.query;
    
    const matchQuery = { user: req.user._id };
    
    if (month !== undefined && year !== undefined) {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);
      matchQuery.date = {
        $gte: startOfMonth,
        $lte: endOfMonth
      };
    } else if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    const summary = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;