const jwt = require('jsonwebtoken')
const checkAuth = (req,res,next)=>{
    try {
        const token =req.cookies.token;
        if(!token){
            return res.status(401).json({errorMessage:"Unauthorised"}).send()
        }
        const verifyUser = jwt.verify(token,process.env.JWT_SECRET)
        req.user = verifyUser.user
        next()
    } catch (error) {
        res.status(401).json({errorMessage:"Unauthorised"}).send()
    }
}

module.exports = checkAuth