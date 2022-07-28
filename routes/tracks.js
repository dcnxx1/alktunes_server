const express = require('express')
const {jwtChecker, tokenify} = require('../auth/authenticator')
const router = express.Router()
const axios = require('axios')

const LAMBDA_URL="https://3nxhmnntzd.execute-api.eu-central-1.amazonaws.com/stage1"

router.get('/', jwtChecker, async (req,res) => {
     const {playlist_id} = req.query
    const config = {
        params: {
            user_id: req.token,
            playlist_id
        }
    }
    
    const getPlaylistData = await axios.get(`${LAMBDA_URL}/tracks/gettracks`, config)
    
    res.send(getPlaylistData.data)

})






module.exports = router