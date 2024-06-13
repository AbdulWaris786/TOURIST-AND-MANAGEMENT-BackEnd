const bcrypt = require('bcrypt')
const signupModel = require('../models/signup-Schema')

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
                const dataOtp={email}
                res.status(200).json({message:'Sucessfull User Signup',dataOtp})
            }
        } catch (error) {
            console.log(error);
        }

    }
}