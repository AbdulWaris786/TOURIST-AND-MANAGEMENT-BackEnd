const signupModel =require('../models/signup-Schema')
const signupData =require('../Controller/auth-Controller')
const nodemailer = require('nodemailer')
const mailOtp = require("../middleware/otpVerify")
module.exports= function otpVerification(email){
    console.log(email ,'jjj');
    const Transpoter = nodemailer.createTransport({
        service:"gmail",
        auth: {
           // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "warismuthuparamba@gmail.com",
            pass: "cedc bvrn adsj hwkd",
        },
    })
    // newemail='123456'
    const mailOption = {
        from: 'warismuthuparmba@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'inna pidichoo  OTP ',
        text: `YOUR OTP IS ${mailOtp.otpCode}`
    }
    const sendMail = async(newTranspoter,newmailOption)=>{
        try { 
            await newTranspoter.sendMail(newmailOption)
            console.log(mailOtp.otpCode);
            console.log('Your Otp sending is sucessfully');
            return mailOption.otpCode
        } catch (error) {
            console.log(`error occurred while sending email:${error}`);
        }
    }
    sendMail(Transpoter,mailOption)
}
