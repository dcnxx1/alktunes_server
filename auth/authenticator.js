const jwt = require('jsonwebtoken')

function jwtChecker(req, res, next) {
    try{
        const header = req.headers['authorization']
        const token = header.split(" ")[1]
        const checkedToken = jwt.verify(token, process.env.JWT_TOKEN)
        
        next(checkedToken)
    } catch(err){
        next("No token provided")
    }

}


function tokenGenerator(req,res,next){
    const {username} = req.body
    const token = jwt.sign(username , process.env.JWT_TOKEN)
    req.token = token
    next()
}




module.exports = {
    jwtChecker,
    tokenGenerator
}