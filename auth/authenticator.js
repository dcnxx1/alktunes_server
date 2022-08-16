const jwt = require('jsonwebtoken')

function jwtChecker(req, res, next) {
    try{
        const header = req.headers['authorization']
        const token = header.split(" ")[1]
        const checkedToken = jwt.verify(token, process.env.JWT_TOKEN)
        req.token = checkedToken
        next()
    } catch(err){
       next("FORBIDDEN")
    }

}



function tokenify(user_id) {
    return jwt.sign(user_id, process.env.JWT_TOKEN)
}

function validateToken(req,res, next){
    try{
        const header = req.headers['authorization']
        const token = header.split(" ")[1]
        const checkedToken = jwt.verify(token, process.env.JWT_TOKEN)
        req.token = checkedToken
    
        next()
    } catch(err){
       next("NO_TOKEN")
    }
}


module.exports = {
    jwtChecker,
    tokenify,
    validateToken
}