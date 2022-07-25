const express = require('express')
const {jwtChecker, tokenify} = require('../auth/authenticator')
const router = express.Router()
const axios = require('axios')

const LAMBDA_URL="https://3nxhmnntzd.execute-api.eu-central-1.amazonaws.com/stage1"

router.get('/tracks', jwtChecker, (req,res) => {
    const config = {params: {user_id: req.token}}
    const data = {playlist_id : req.body.playlist_id}
    axios.get(`${LAMBDA_URL}/tracks/gettracks`, data, config).then((res) => {
    }) 


})






module.exports = router