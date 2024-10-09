const Income = require('../models/income.model');

const createIncome = async (req, res) => {
  try {
    const { amount_num, date, service, deduction } = req.body;
    const newIncome = new Income({ amount_num, date, service, deduction });
    await newIncome.save();
    res.status(201).json({ success: true, data: newIncome });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();
    res.status(200).json({ success: true, data: incomes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ success: false, msg: 'Income not found' });
    }
    res.status(200).json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const updateIncome = async (req, res) => {
  try {
    const { amount_num, date, service, deduction } = req.body;
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      { amount_num, date, service, deduction },
      { new: true, runValidators: true }
    );
    if (!updatedIncome) {
      return res.status(404).json({ success: false, msg: 'Income not found' });
    }
    res.status(200).json({ success: true, data: updatedIncome });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ success: false, msg: 'Income not found' });
    }
    res.status(200).json({ success: true, msg: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome, };

