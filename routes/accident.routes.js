const express = require('express')
const {createAccident,getAccidents, getSingleAccident, updateAccident, deleteAccident} = require('../controllers/accident.controller')
const router = express.Router()

router.post('/createAccident', createAccident)
router.get('/getAccidents', getAccidents)
router.get('/getSingleAccident/:id', getSingleAccident)
router.patch('/updateAccident/:id', updateAccident)
router.delete('/deleteAccident/:id', deleteAccident)
module.exports = router