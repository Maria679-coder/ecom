const mongoose = require('mongoose');

incomeSchema = new mongoose.Schema({
  amount_num: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  service: {
    type: String,
    required: true,
  },
  deduction: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Income', incomeSchema);
