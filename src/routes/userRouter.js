const router = require('express').Router();
const userController = require('../controllers/userController')

router.post('/sign-up', userController.signUp)
router.post('/sign-in', userController.signIn)
router.post('/send-otp', userController.sendOtp)
router.post('/verify-otp', userController.verifyOtp)

module.exports = router