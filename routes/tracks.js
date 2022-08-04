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

// TODO : handle if recieved is empty;
router.get('/artist', async (req,res) => {
    const data = {
        params : {
            artist_name : req.query.artist,
            type: req.query.type
        }   
    }
    try {
    const recieved = await axios.get(`${LAMBDA_URL}/tracks/artist`, data)
    res.send(recieved.data)
    } catch(err) {
        console.log(err)
    }
})

router.post('/upload', jwtChecker, (req,res) => {
    const data = {
        user_id : req.token,
        playlist_id : req.body.playlist_id[0].id,
        track:  req.body.track
    }
    axios.post(`${LAMBDA_URL}/tracks/upload`, data).then((res) => {
        console.log(res.data)
    })
   
})


module.exports = router