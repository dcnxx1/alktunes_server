const express = require('express')
const {jwtChecker, tokenify} = require('../auth/authenticator')
const router = express.Router()
const axios = require('axios')
const {trackFormatter, updatedTracks} = require('../helper')
const LAMBDA_URL="https://3nxhmnntzd.execute-api.eu-central-1.amazonaws.com/stage1"


router.get('/',   async (req,res) => {
     const {playlist_id} = req.query
    const config = {
        params: {
            user_id: req.token,
            playlist_id
        }
    }

    const getPlaylistData = await axios.get(`${LAMBDA_URL}/tracks/gettracks`, config)
    const playlistData = getPlaylistData.data


    res.send({
        playlist_id : playlistData.playlist_id,
        playlist_name: playlistData.playlist_name,
        playlist_tracks: trackFormatter(playlistData.playlist_tracks)
    })
    
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

router.post('/upload',  (req,res) => {
    const data = {
        user_id : req.token,
        playlist_id : req.body.playlist_id[0].id,
        track:  req.body.track
    }
    axios.post(`${LAMBDA_URL}/tracks/upload`, data).then((tracksResponse) => {
       const {L : playlists} = tracksResponse.data.Attributes.playlists
       let formattedTracks = updatedTracks(playlists, data.playlist_id)

       res.send(formattedTracks)
    })
   
})


router.post('/delete',   (req,res) => {
    const data = {
        user_id : req.token,
        tracksDeleteId : req.body.tracksToDelete,
        playlistId: req.body.playlist_id
    }
    axios.post(`${LAMBDA_URL}/tracks/delete`, data).then((response) => {
        try{
            const {L : playlist_tracks} = response.data.Attributes.playlists

            let formattedTracks = updatedTracks(playlist_tracks, data.playlistId)
            res.send(formattedTracks) 
        } catch(err){ 
            console.log(err)
        }   
    })
    
})


router.get('/tracktalker',  async (req,res) => {
    try {
        let getTracks = await axios.get(`${LAMBDA_URL}/tracks/tracktalker`)
        res.send(getTracks.data)
    } catch(err){
        res.send([])
    }
        
})

module.exports = router