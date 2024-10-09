const express = require('express')
const { createDriver, getDrivers, updateDriver, deleteDriver, getDriverById } = require('../controllers/driver.controller')
const router = express.Router()


router.post('/createDriver', createDriver)
router.get('/getDrivers', getDrivers)
router.get('/getDriverById/:id', getDriverById)
router.patch('/updateDriver/:id', updateDriver)
router.delete('/deleteDriver/:id', deleteDriver)

module.exports = router