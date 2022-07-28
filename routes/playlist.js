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
        const {playlists} = res.data

            if(playlists.length < 1){
                resolve([])
            } else {
                resolve(formatter(playlists))
            }

        }).catch((err) => {
            reject(err)
        })
    })
    const playlists = await playlistPromise
    res.send(playlists)
   
})

function formatter(playlistsArray){
    try{ 
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
    } catch(err) {
        //
    }
    
}

function formatterPlaylistCreated(playlistArray){
    return playlistArray.map((playlist) =>{
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
        const {L : playlist} = getPlaylist.data.Attributes.playlists
        let formatted = formatterPlaylistCreated(playlist)
        res.send(formatted)
    
})

router.post('/delete', jwtChecker, async (req,res) => {
    const config = {
        headers: {
            user_id : req.token
        }
    }
    const data = {
        playlists: req.body.playlists
    }
    
    const getNewPlaylist =  await axios.post(`${LAMBDA_URL}/playlist/delete`, data, config )
    const {L : playlist} = getNewPlaylist.data.Attributes.playlists 
    const formatted = formatterPlaylistCreated(playlist)
   res.send(formatted)
})

module.exports = router