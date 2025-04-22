// routes/init.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Savings = require('../models/savings');
const Bill = require('../models/Bill');
const LoanApplication = require('../models/LoanApplication');

router.post('/', async (req, res) => {
  try {
    // Clear collections
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    await Savings.deleteMany({});
    await Bill.deleteMany({});
    await LoanApplication.deleteMany({});

    // Insert dummy users
    const users = await User.insertMany([
      { name: 'Alice', email: 'alice@example.com', password: 'pass123', role: 'regular' },
      { name: 'Bob', email: 'bob@example.com', password: 'pass123', role: 'premium' },
      { name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'admin' },
    ]);

    // Insert dummy transactions
    await Transaction.insertMany([
      { user: users[0]._id, amount: 100, category: 'Food', description: 'Groceries', type: 'expense' },
      { user: users[0]._id, amount: 200, category: 'Salary', description: 'Monthly salary', type: 'income' },
      { user: users[1]._id, amount: 50, category: 'Transport', description: 'Bus fare', type: 'expense' },
    ]);

    // Insert dummy budget
    await Budget.insertMany([
      {
        user: users[0]._id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        categories: [
          { category: 'Food', limit: 300, spent: 100 },
          { category: 'Transport', limit: 100, spent: 50 },
        ],
      },
    ]);

    // Insert dummy savings goal
    await Savings.insertMany([
      { user: users[0]._id, name: 'Emergency Fund', targetAmount: 1000, currentAmount: 250 },
    ]);

    // Insert dummy bill
    await Bill.insertMany([
      { user: users[0]._id, name: 'Electricity Bill', dueDate: new Date(), amount: 75, isRecurring: true },
    ]);

    // Insert dummy loan application
    await LoanApplication.insertMany([
      { user: users[1]._id, amount: 5000, tax: 300, status: 'pending' },
    ]);

    res.status(200).json({ message: 'Database initialized with dummy data.' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;