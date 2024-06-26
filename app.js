const express = require('express')
const app = express()
require('dotenv').config()
const userRouter = require('./router/user-Router')
const adminRouter = require("./router/admin-Router")
const Port = process.env.PORT
const DBConnection =require('./config/DB')
const cors =require('cors')
const session = require('express-session')
app.use(cors())
app.use(session({
    secret: 'your-secret-key', // Change this to a secret key for session encryption
    resave: false,
    saveUninitialized: false
}))
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.use('/',userRouter)
// app.use('/admin',adminRouter)





DBConnection().then(()=>{
    app.listen(Port,()=>console.log(`server is running ${Port}`))
}).catch(()=>{
    console.log('error connection database');
})