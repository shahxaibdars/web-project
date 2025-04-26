// routes/loanApplications.js
const express = require('express');
const router = express.Router();
const LoanApplication = require('../models/LoanApplication');
const auth = require('../middleware/auth');

// Get all loan applications
router.get('/', auth, async (req, res) => {
  try {
    const query = { user: req.user._id }; // Only get loans for the authenticated user
    const loans = await LoanApplication.find(query).populate('user', 'name email');
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get loan application by id
router.get('/:id', async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id).populate('user', 'name email');
    if (!loan) return res.status(404).json({ message: 'Loan application not found.' });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create loan application
router.post('/', async (req, res) => {
  const { user, amount, tax, purpose } = req.body;
  const loan = new LoanApplication({ user, amount, tax, purpose });
  try {
    const saved = await loan.save();
    res.status(201).json({ message: 'Loan application created.', loan: saved });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update loan application
router.put('/:id', auth, async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found.' });
    }

    // Only allow updates if the loan is pending
    if (loan.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending loans can be updated.' });
    }

    // Only allow the owner to update
    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this loan.' });
    }

    const { amount, purpose } = req.body;
    const tax = amount * 0.05; // Recalculate tax

    const updated = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { amount, purpose, tax },
      { new: true }
    );

    res.json({ message: 'Loan application updated.', loan: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete loan application
router.delete('/:id', auth, async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found.' });
    }

    // Only allow deletion if the loan is pending
    if (loan.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending loans can be deleted.' });
    }

    // Only allow the owner to delete
    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this loan.' });
    }

    await LoanApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Loan application deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;