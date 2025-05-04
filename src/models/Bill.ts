import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  isRecurring: { type: Boolean, default: true },
}, { timestamps: true });

export const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema); 