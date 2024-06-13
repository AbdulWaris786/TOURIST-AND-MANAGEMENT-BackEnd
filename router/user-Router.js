const express = require("express")
const router = express.Router()
const authController = require('../Controller/auth-Controller')

router.post('/Signup',authController.userSignupPost)




module.exports=router