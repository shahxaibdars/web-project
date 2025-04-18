// models/Budget.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  categories: [
    {
      category: { type: String, required: true },
      limit: { type: Number, required: true },
      spent: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model('Budget', budgetSchema);