const express = require('express')
const router = express.Router()
const {jwtChecker} = require('../auth/authenticator')




router.all('/',  (req,res) => {
    res.sendStatus(403)
})







module.exports = router