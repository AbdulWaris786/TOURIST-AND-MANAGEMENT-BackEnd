const mongoose = require('mongoose')

const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.URI)
        console.log(`MongoDB Connected:${connection.connection.host}`);
    } catch (err) {
        console.log(err);
        
    }
}   
module.exports=connectDB