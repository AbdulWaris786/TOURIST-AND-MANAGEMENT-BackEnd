const mongoose =require('mongoose')

const signupSchema =new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    Guide:{
        type:String
    },
    verification:{
        type:String
    },
    block:{
        type:String
    }
})

// Create the model
const signupModel = mongoose.model('userSignup', signupSchema);

// Export the model
module.exports = signupModel;