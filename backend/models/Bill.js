// models/Bill.js
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  isRecurring: { type: Boolean, default: false },
});

module.exports = mongoose.model('Bill', billSchema);