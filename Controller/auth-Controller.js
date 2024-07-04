const bcrypt = require('bcryptjs')
const signupModel = require('../models/signup-Schema')
const otpVerification = require('../utility/otpVerification');
const mailOtp =require('../middleware/otpVerify')
const jwt = require('jsonwebtoken');
const jwtSecret =process.env.JWT
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

module.exports={
    userSignupPost: async(req,res)=>{
        const {email,password,confirmpassword}=req.body
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
        let OtpArray =[] 
        OtpArray = data.otp1+data.otp2+data.otp3+data.otp4+data.otp5+data.otp6
        const userEmail =email.email
        try {
            if(!userEmail){
                console.log('user email not Exist');
            }else{
                const recivedOtp =parseInt(OtpArray)
                const getOtp =mailOtp.otpCode;
                if(recivedOtp == getOtp){
                    const user = await signupModel.findOneAndUpdate(
                        {email:userEmail},
                        {$set:{verification:'true'}}
                    )
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
        const userEmail = email.email
        if(!userEmail){
            console.log('user not exist');
        }else{
            otpVerification(userEmail)
        }
    },
    userLoginPost:async(req,res)=>{
        const {email,password} = req.body
        const user = await signupModel.findOne({email})
        try {
            if(!email){
                console.log('user not exist');
            }else{
                const passwordMatch =await bcrypt.compare(password ,user.password)
                if(passwordMatch){
                    if(user.verification == 'true'){
                        const token =jwt.sign(
                            {emailId : email},
                            jwtSecret,
                            {expiresIn:'1h'}
                        )
                        res.status(200).json({message:'login Sucessfully',token})
                    }else{
                        res.status(404).json({error:'Email not verified'})
                    }
                }else{
                    res.status(401).json({ error: 'Invalid credentials' });
                }

            }
        } catch (error) {
            console.error(error);
        }
    },

} 