// models/SavingsGoal.js
const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);