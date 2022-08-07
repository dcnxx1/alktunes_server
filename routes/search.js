const express = require('express')
const router = express.Router()

const SUGGEST_URL= (query, suggester) => `https://search-searchtunes-ksvb5hyha5tdsoxjnb7jnargxq.eu-central-1.cloudsearch.amazonaws.com/2013-01-01/suggest?q=${query}&suggester=${suggester}`
const SEARCH_URL = (searcher) => `https://search-searchtunes-ksvb5hyha5tdsoxjnb7jnargxq.eu-central-1.cloudsearch.amazonaws.com/2013-01-01/search?q=${searcher}&size=4`

const axios = require('axios')


let track_suggester = 'alktunes_tracksuggester'
let album_suggester = 'alktunes_albumsuggester'
let artist_suggester = 'alktunessuggester'

let artistSuggestFound = []
let artistSearchFound = []

let albumSuggestFound = []
let albumSearchFound = []


let trackSuggestFound = []
let trackSearchFound = []

function formatter(searchArray, type){
 
    const { hit } =  searchArray.hits
    artistSearchFound.push({
        type: 'artist',
        name: type,
        searchResults : hit.map(({fields}) => fields)
    })
    return artistSearchFound 
}

function albumFormatter(albumArray,album_name){
    const {hit} = albumArray.hits
    albumSearchFound.push({
        type: 'album',
        name: album_name,
        searchResults: hit.map(({fields}) => fields)
    })
    return albumSearchFound
}

function trackSuggestFormatter(suggestionsArray){
    return suggestionsArray.map(({suggestion}) => {
        return {track_name : suggestion}
    })
}

function trackFormatter(trackArray){
    const { hit } = trackArray.hits
    const getMatchTrack = hit.map(({fields}) => fields)
    trackSearchFound.push({
        type: 'track',
        searchResults: getMatchTrack
    })
    return trackSearchFound
}

async function handleArtist(userInput) {
    const getArtistData = await axios.get(SUGGEST_URL(userInput, artist_suggester))

    try {
        const {suggestions} = getArtistData.data.suggest
        if(suggestions.length === 0 || suggestions === undefined) {
            clearArtist()
            return []
        }
        const { suggestion : artist_found } = getArtistData.data.suggest.suggestions[0] 
        const checkArtistExists = artistSuggestFound.some(({artist}) => artist === artist_found)

        if(checkArtistExists === true ){
            return artistSearchFound
        } else {
            if(artistSuggestFound.length >= 1){
                clearArtist()
            }
            artistSuggestFound.push({artist: artist_found})
            const getSearchedArtist = await axios.get(SEARCH_URL(artist_found))
            return formatter(getSearchedArtist.data, artist_found)
        }
       
    } catch(err){
    console.log(err)
    }
   
}

async function handleAlbum(userInput){
    const getAlbumSuggester = await axios.get(SUGGEST_URL(userInput, album_suggester))
    try{ 
        const {suggestions} = getAlbumSuggester.data.suggest
        if(suggestions.length < 1) return []
        const { suggestion : album_name } = getAlbumSuggester.data.suggest.suggestions[0]
        const checkAlbumExists = albumSuggestFound.some(({album}) => album === album_name)

        if(checkAlbumExists === true ){
            return albumSearchFound
        } else {
            if(albumSuggestFound.length >= 1){
                clearAlbum()
            }

            albumSuggestFound.push({album: album_name})
            const getAlbum = await axios.get(SEARCH_URL(album_name))
            return albumFormatter(getAlbum.data, album_name)
        }

    } catch(err) {
       console.log(err)
    }
    
}

async function handleTrack(userInput){
    const trackSuggester = await axios.get(SUGGEST_URL(userInput, track_suggester))
    const { suggestions } = trackSuggester.data.suggest
    if(suggestions.length < 1) return []
    const {suggestion : trackFound} = suggestions[0]
    const checkIfTrackExists = trackSuggestFound.some(({track_name}) => suggestions.indexOf(track_name))
    
    if(checkIfTrackExists === true ){
        return trackSearchFound
    } else {
        if(trackSuggestFound.length >= 1){
            clearTrack()
        }  
        const formattedSuggestion = trackSuggestFormatter(suggestions)
        if(formattedSuggestion.length > 1){
            trackSearchFound.push({
                type: 'track',
                tracks: formattedSuggestion
            })
            return trackSearchFound
        } else {
            clearTrack()
            const getSpecificTrack = await axios.get(SEARCH_URL(trackFound))
            return trackFormatter(getSpecificTrack.data)
        }
    }
}

async function predictInputHandler(input){
    const lowered = input.toLowerCase().trim()
    
    try {
        const artistHandler = await handleArtist(lowered)
        if(artistHandler.length !== 0) return artistHandler
        clearArtist()        
        const albumHandler = await handleAlbum(lowered)
        if(albumHandler.length !== 0) return albumHandler
        clearAlbum()
        const trackHandler = await handleTrack(lowered)
        if(trackHandler.length !== 0) return trackHandler
        
        clearArrays()
        return []
 
    } catch(err){
        console.log(err)
    }
        
}

function clearArtist (){
    artistSuggestFound = []
    artistSearchFound = []
}

function clearAlbum (){
    albumSuggestFound = []
    albumSearchFound = []
}

function clearTrack (){
    trackSuggestFound = []
    trackSearchFound = []
}

function clearArrays(){
    clearArtist()
    clearAlbum()
    clearTrack()
}


function checkInput (string) {
    if((/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/).test(string) === true) return false
    return true
}

router.get('/', async (req,res) => {
    const {search} = req.query
    if(search !== "" && /\uFFFD/g.test(search) === false && checkInput(search) === true) {
        const got = await predictInputHandler(search.trim())
        res.send(got)
    } else {
        clearArrays()
        res.send([])
    }
    
})



module.exports = router