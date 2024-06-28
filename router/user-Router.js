const express = require("express")
const router = express.Router()
const authController = require('../Controller/auth-Controller')

router.post('/Signup',authController.userSignupPost)
router.post('/otp',authController.otpPost)
router.post('/resendOtp',authController.resendOtp)



module.exports=router