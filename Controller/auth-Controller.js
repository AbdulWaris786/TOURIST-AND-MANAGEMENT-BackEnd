const bcrypt = require('bcryptjs')
const signupModel = require('../models/signup-Schema')
const otpVerification = require('../utility/otpVerification');
const mailOtp =require('../middleware/otpVerify')
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

module.exports={
    userSignupPost: async(req,res)=>{
        const {email,password,confirmpassword}=req.body
        console.log(email);

        try {
            const saltedPass = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(password,saltedPass)
            const userSignup = new signupModel({
                email,
                password:hashedPass,
                Guide:'false',
                verification:'false',
                block:'false'
            })
            let userData =await signupModel.find()
            let userExist= userData.find((val)=>val.email === email)
            if(userExist){
                res.status(200).json({message:'User Already Exist....please login',userExist})
            }else if(!emailPattern.test(email)){
                res.status(404).json({message:'Invalid Email'})
            }else if(!passwordPattern.test(password)){
                res.status(404).json({messsage:'Inavlid Password'})
            }else{
                await userSignup.save()
                const OtpEmail={email}
                
                otpVerification(email)
                res.status(200).json({message:'Sucessfull User Signup',OtpEmail})
            }
        } catch (error) {
            console.log(error);
        }

    },
    otpPost:async(req,res)=>{
        const {data,email}=req.body 
        console.log(req.body);
        let OtpArray =[] 
        OtpArray = data.otp1+data.otp2+data.otp3+data.otp4+data.otp5+data.otp6
        console.log(OtpArray,email);
        const userEmail =email.email
        console.log(userEmail,'kkkk');
        try {
            if(!userEmail){
                console.log('email vennilla');
            }else{
                console.log(OtpArray,typeof(mailOtp.otpCode));
                const recivedOtp =parseInt(OtpArray)
                const getOtp =mailOtp.otpCode;
                if(recivedOtp == getOtp){
                    console.log('ready');
                    const user = await signupModel.findOneAndUpdate(
                        {email:userEmail},
                        {$set:{verification:'true'}}
                    )
                    console.log(user);
                    res.status(200).json({message:'hellooo'})
                }else{
                    console.log('ready alla');
                    res.status(400).json({message:'Otp in correct'})
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    resendOtp:async(req,res)=>{
        const {email}=req.body
        console.log(req.body);
        console.log('ki',email.email);
        const userEmail = email.email
        if(!userEmail){
            console.log('user not exist');
        }else{
            otpVerification(userEmail)
        }
    }
} 