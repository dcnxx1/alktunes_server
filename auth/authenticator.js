const jwt = require('jsonwebtoken')
const {getId} = require('../db/queries')
function jwtChecker(req, res, next) {
    try{
        const header = req.headers['authorization']
        const token = header.split(" ")[1]
        const checkedToken = jwt.verify(token, process.env.JWT_TOKEN)
        req.token = checkedToken
    
        next()
    } catch(err){
        next("No token provided")
    }

}


function tokenify(user_id) {
    return jwt.sign(user_id, process.env.JWT_TOKEN)
}



module.exports = {
    jwtChecker,
    tokenify
}