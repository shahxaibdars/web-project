// routes/reports.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Aggregate transactions by category
router.get('/transactions-summary', async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;