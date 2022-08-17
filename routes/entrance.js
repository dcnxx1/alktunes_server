const express = require('express')
const router = express.Router()
const {jwtChecker, tokenify} = require('../auth/authenticator')
const {loginUser, registerUser} = require('../db/queries.js')
const id = require('../misc/id.generator')


router.post('/login', (req,res) => {
    
    const {username, password} = req.body
   try {
    loginUser({username, password}).then((result) => {
        res.json({
            statusCode: result.statusCode, 
            token: tokenify(result.user_id),
            message: result.message 
        })
	console.log(result)
    }).catch((err) => {
        res.json({
            statusCode: err.statusCode,
            message: err.message
        })
    })
   } catch(err) {
    console.log(err)
   }
    
    
})








router.post('/register', ( req,res) => {
    const {username, password, email} = req.body
    
    registerUser({username, password, email}).then((result) => {
        
        res.json({
            SUCCESS: result.SUCESS,
            statusCode: result.statusCode,
            message: result.message,
            token : tokenify(result.user_id)
        })
    }).catch((err) => {
        res.json({
            statusCode: err.statusCode,
            message: err.ERR
        })
    })   
})

router.post('/uuidtester', (req,res) => {
    res.send(id())
})



module.exports = router 
