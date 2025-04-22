const mongoose = require('mongoose');

// Check if the model already exists
const Savings = mongoose.models.Savings || mongoose.model('Savings', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
}));

// Add index for faster queries
Savings.schema.index({ user: 1, createdAt: -1 });

module.exports = Savings; 