const express = require('express')
const router = express.Router()
const { registerAdmin, getAdmins, getSingleAdmin, deleteAdmin, updateAdmin, loginAdmin, forgetPassword, resetPassword, updatePassword, } = require('../controllers/admin.controller')

router.post('/register', registerAdmin)
router.get('/loginAdmin', loginAdmin)
router.get('/getAdmins', getAdmins)
router.get('/getAdmin/:id', getSingleAdmin)
router.delete('/deleteAdmin/:id', deleteAdmin)
router.patch('/updateAdmin/:id', updateAdmin)
router.post('/admin/forgetPassword', forgetPassword)
router.post('/admin/resetPassword/:token', resetPassword)
router.post('/admin/updatePassword/:id', updatePassword)


module.exports = router