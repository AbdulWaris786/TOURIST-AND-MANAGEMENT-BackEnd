const jwt = require('jsonwebtoken')
module.exports=function JwtVerify(req,res,next){
    const token = req.header('authorization')?.replace('bearer ','')
    if(!token){
        return res.status(401).json({ error: 'No token provided' });
    }else{
        try {
            const decoded = jwt.verify(token,process.env.JWT)
            req.emailId = decoded.emailId
            next()
        } catch (err) {
            res.status(401).json({ error: 'Invalid token' });
        }
    }
}