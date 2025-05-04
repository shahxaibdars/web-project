import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  tax: { type: Number, required: true }
}, {
  timestamps: true,
});

export const Loan = mongoose.models.Loan || mongoose.model('Loan', loanSchema); 