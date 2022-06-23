const express = require('express')
const router = express.Router()
const {jwtChecker, tokenGenerator} = require('../auth/authenticator')

router.post('/login', tokenGenerator, (req,res) => {
    res.send(req.token)
})

router.post('/register', jwtChecker, (checkedToken, req,res) => {
    const {username, password, email, avatarul} = req.body
    console.log(`checkedTOken : ${checkedToken}`)
    res.send("register output")
})



module.exports = router