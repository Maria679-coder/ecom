const express = require('express');
const { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome, } = require('../controllers/income.controller');
const router = express.Router();


router.post('/createincome', createIncome);
router.get('/incomes', getIncomes);
router.get('/getSingleincome/:id', getIncomeById);
router.patch('/updateincome/:id', updateIncome);
router.delete('/deleteincome/:id', deleteIncome);

module.exports = router;
