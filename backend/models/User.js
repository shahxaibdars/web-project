// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, always hash passwords!
  role: {
    type: String,
    enum: ['regular', 'premium', 'admin', 'bank_manager', 'loan_distributor', 'financial_advisor'],
    default: 'regular',
  },
});

module.exports = mongoose.model('User', userSchema);