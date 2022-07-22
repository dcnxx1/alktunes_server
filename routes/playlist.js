const express = require('express')
const {jwtChecker, tokenify} = require('../auth/authenticator')
const router = express.Router()
const axios = require('axios')

const LAMBDA_URL="https://3nxhmnntzd.execute-api.eu-central-1.amazonaws.com/stage1"

router.get('/', jwtChecker, async (req,res) => {
    
    
    const data = {
        params: {
            user_id: req.token
        }
    }

    const playlistPromise = new Promise((resolve, reject) => {
       axios.get(`${LAMBDA_URL}/playlist/getplaylist`, data).then((res) => {
           const {Items : item} = res.data
        console.log(res.data)
           if(item[0].hasOwnProperty('playlists') === false){
            resolve({
                ERR: "NO_PLAYLIST",
                statusCode: 403,
                message: "You have no playlists",
                playlists: []
            })
           } else {
            const {playlists} = item[0]

            resolve(playlists)
           }

           resolve(item)
        }).catch((err) => {
            reject(err)
        })
    })

    const playlists = await playlistPromise
    const formatToJs = formatter(playlists)
    res.send(formatToJs)
   
})

function formatter(playlistsArray){
    const {L : playlistArray} = playlistsArray
    return playlistArray.map((playlist) => {
       let {S: playlist_id} =  playlist.M.playlist_id
       let {S: playlist_name} = playlist.M.playlist_name
       let {L: playlist_tracks} = playlist.M.playlist_tracks
        return {
            playlist_id,
            playlist_name,
            playlist_tracks
        }
    })
}


router.post('/create', jwtChecker, async (req,res) => {



    const config = {
        headers: {
            user_id: req.token
        }
    }

    const data = {
        playlistName : req.body.playlistName
    }
    
    
    const getPlaylist = await axios.post(`${LAMBDA_URL}/playlist/createplaylist`, data, config)
    
    res.send(getPlaylist.data)

})

module.exports = router