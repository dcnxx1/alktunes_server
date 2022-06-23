const express = require('express')
const router = express.Router()
const {jwtChecker, tokenGenerator} = require('../auth/authenticator')
const {loginUser, registerUser} = require('../db/queries.js')
const id = require('../misc/id.generator')





router.post('/login', tokenGenerator, (req,res) => {
    const {username, password} = req.body
     
    loginUser({username, password}).then((result) => {
        res.json({
            statusCode: result.statusCode,
            token: result.token(req.token),
            message: result.message
        })
    }).catch((err) => {
        res.json({
            statusCode: err.statusCode,
            message: err.message
        })
    })
    
})



router.post('/register', tokenGenerator, ( req,res) => {
    const {username, password, email} = req.body
    
    registerUser({username, password, email}).then((result) => {
        res.json({
            statusCode: result.statusCode,
            token: result.token(req.token)
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