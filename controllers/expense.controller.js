const adminModel = require('../models/admin.model');
const Expense = require('../models/expense.model');


const createExpense = async (req, res) => {
  try {
    const { amount_num, date, category, description_num, payment_method, admin } = req.body;

    const newExpense = new Expense({ amount_num, date, category, description_num, payment_method, admin })
    await newExpense.save();

    const adminExpense = await adminModel.findById(admin) 
    adminExpense.expenses.push(newExpense._id)
    await adminExpense.save();

    res.status(201).json({ success: true, data: adminExpense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, msg: 'Expense not found' });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const updateExpense = async (req, res) => {
  try {
    const { amount_num, date, category, description_num, payment_method } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { amount_num, date, category, description_num, payment_method },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ success: false, msg: 'Expense not found' });
    }

    res.status(200).json({ success: true, data: updatedExpense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, msg: 'Expense not found' });
    }

    res.status(200).json({ success: true, msg: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, };

