// app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB (adjust the URI as needed)
mongoose.connect('mongodb://localhost:27017/finwise')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const savingsRoutes = require('./routes/savings');
const billRoutes = require('./routes/bills');
const loanRoutes = require('./routes/loanApplications');
const reportRoutes = require('./routes/reports');
const initRoutes = require('./routes/init');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/loan-applications', loanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/init', initRoutes); // Route to initialize the database with dummy data

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));