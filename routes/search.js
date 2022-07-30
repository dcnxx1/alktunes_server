const express = require('express')
const router = express.Router()

const SUGGEST_URL= (query, suggester) => `https://search-searchtunes-ksvb5hyha5tdsoxjnb7jnargxq.eu-central-1.cloudsearch.amazonaws.com/2013-01-01/suggest?q=${query}&suggester=${suggester}`
const SEARCH_URL = (searcher) => `https://search-searchtunes-ksvb5hyha5tdsoxjnb7jnargxq.eu-central-1.cloudsearch.amazonaws.com/2013-01-01/search?q=${searcher}&size=4`

const axios = require('axios')


let track_suggester = 'alktunes_tracksuggester'
let album_suggester = 'alktunes_albumsuggester'
let artist_suggester = 'alktunessuggester'

let suggestFound = []
let searchFound = {}

let albumSuggestFound = []
let albumSearchFound = {}

let trackSuggestFound = []
let trackSearchFound = []

// format artist array
function formatter(searchDataArray, artistName){
    const {hit : artistFoundArray} = searchDataArray.hits
    const formatList = artistFoundArray.map(({fields}) => {
        return fields
    })

    searchFound = {
     artist_name: artistName,
     artist_tracks : formatList
    }
      
    return searchFound
}
// format album array
function formatAlbum(searchAlbumArray){
    const {hit : albumFoundArray}  = searchAlbumArray.hits
    return albumFoundArray.map(({fields}) => {
        return fields
    })
}

function formatTrack(searchTrackArray) {
    const {hit : trackArray}  = searchTrackArray.hits
    return trackArray.map(({fields}) => {
        return fields
    })
}

// handler for when user is searching for artist
async function predictArtistHandler(userInput){
    let getArtistSuggester = await axios.get(SUGGEST_URL(userInput, artist_suggester))
   
    try{
        // artist has been found by queries the artist
     const { suggestions } = getArtistSuggester.data.suggest
      
     // if suggestions array is not empty 
     if(suggestions.length >= 1){

        // get artist_name from found prediction
        const {suggestion: artist_name} = suggestions[0]

        //check if artist is already present in the suggestFound array
        const artistAlreadySearched = suggestFound.some(({artist}) => artist == artist_name)

        if(artistAlreadySearched === true){
            // return the SearchFound array
            return searchFound
        } else {
            // if there's an artist inside the suggestFound, remove it to prevent sending two different artist request
            // at the same time
            if(suggestFound.length >= 1) {
                suggestFound.pop()
                delete searchFound['artist_name']
                delete searchFound['artist_tracks']
            }
            suggestFound.push({artist: artist_name})
            // query for predicted artist and add it to the searchFound array
            const getSearchQuery = await axios.get(SEARCH_URL(artist_name))
            return formatter(getSearchQuery.data, artist_name)
        }    
        } else {
            // return suggestions (which is an empty array) and move on to the next suggestion
            // delete suggestionsArray
            suggestFound = []
            return suggestFound
     }   

    } catch (err) {
        return new Error("ARTIST_NOT_FOUND " + err )
    }


}
// handler for when user is searching for album
async function predictAlbumHandler(userInput){
    const getAlbumSuggestion = await axios.get(SUGGEST_URL(userInput, album_suggester))
    const {suggestions} = getAlbumSuggestion.data.suggest
    
    if(suggestions.length >= 1) {
        const {suggestion : album_name} = suggestions[0]
        const checkAlbumExists = albumSuggestFound.some(({album}) => album === album_name)
        
        if(checkAlbumExists == true){
            return albumSearchFound
        } else {
            if(albumSuggestFound.length >= 1){
                albumSuggestFound.pop()
                delete albumSearchFound['album']
            }
            albumSuggestFound.push({album: album_name})
            const getAlbum = await axios.get(SEARCH_URL(album_name))
            albumSearchFound.tracks = formatAlbum(getAlbum.data)
            albumSearchFound.album = album_name
            return albumSearchFound
        }
    }
    // clear array because the user is not searching for album
    
    albumSuggestFound = []
    delete albumSearchFound['album']
    delete albumSearchFound['artist_tracks']
    return albumSuggestFound
}

// handler for when user is searching for a track

async function predictTrackHandler(userInput){
    let trackSuggester = await axios.get(SUGGEST_URL(userInput, track_suggester))

    try {
        const { suggestions } = trackSuggester.data.suggest
        
        if(suggestions.length >= 1){
            const {suggestion : track} = suggestions[0]
            const trackExists = trackSuggestFound.some(({track_name}) => track_name == track)

            if(trackExists.hasOwnProperty('track_name') === true ){
                return trackSearchFound
            } else {
               if(trackSuggestFound.length >= 1){
                trackSuggestFound.pop()
                trackSearchFound.pop()
               } 
               trackSearchFound.push({track_name : track})
               const getTrack = await axios.get(SEARCH_URL(track))
               return formatTrack(getTrack.data)
            }

        }        
        return []
    } catch(err) {
    //
    }
}


async function predictInputHandler(input){
    const lowered = input.toLowerCase()
   try {
    const artistSuggestions = await predictArtistHandler(lowered)
    
    if(artistSuggestions.hasOwnProperty('artist_name') === true){
        return artistSuggestions 
    } else {
        const albumSuggestion = await predictAlbumHandler(lowered)
        if(albumSuggestion.hasOwnProperty('album') === true ){
            return albumSuggestion
        } else {
            const suggesterTrack = await predictTrackHandler(lowered)
            return suggesterTrack
        }
    }
    
   } catch(err) {
    return new Error(err)
   }

    
}





router.get('/', async (req,res) => {
    const {search} = req.query
    const got = await predictInputHandler(search)
    res.send(got)
})



module.exports = router