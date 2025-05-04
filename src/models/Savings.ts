import mongoose from 'mongoose';

const savingsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, required: true, default: 0 },
}, {
  timestamps: true,
});

export const Savings = mongoose.models.Savings || mongoose.model('Savings', savingsSchema); 