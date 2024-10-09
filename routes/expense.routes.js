const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, } = require('../controllers/expense.controller');

router.post('/createExpense', createExpense);
router.get('/expenses', getExpenses);
router.get('/getSingleExpense/:id', getExpenseById);
router.patch('/updateExpense/:id', updateExpense);
router.delete('/deleteExpense/:id', deleteExpense);

module.exports = router;
