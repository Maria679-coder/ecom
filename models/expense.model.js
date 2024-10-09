const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount_num: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
  },
  description_num: {
    type: Number,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
