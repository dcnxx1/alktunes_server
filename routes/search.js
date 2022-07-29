const express = require('express')
const router = express.Router()

const SUGGEST_URL= (query, suggester) => `https://search-searchtunes-ksvb5hyha5tdsoxjnb7jnargxq.eu-central-1.cloudsearch.amazonaws.com/2013-01-01/suggest?q=${query}&suggester=${suggester}`
const SEARCH_URL = (searcher) => `https://search-searchtunes-ksvb5hyha5tdsoxjnb7jnargxq.eu-central-1.cloudsearch.amazonaws.com/2013-01-01/search?q=${searcher}&size=4`

const axios = require('axios')
const artists = ['Drake', 'Lil', 'Tjay', 'Lil Tjay', 'NLE', 'Choppa', 'NLE Choppa', 'Michael', 'Jackson', 'Michael Jackson', 'Tupac']
const albums = ['Me vs. Me', 'Certified LoverBoy', 'Bad', 'All Eyez On Me']

let track_suggester = 'alktunes_tracksuggester'
let album_suggester = 'alktunes_albumsuggester'
let artist_suggester = 'alktunessuggester'

let suggestFound = []
let searchFound = []



function formatter(searchDataArray, artistName){
    const {hit : artistFoundArray} = searchDataArray.hits
    const formatList = artistFoundArray.map(({fields}) => {
        return fields
    })
    searchFound.push({
        artist_name: artistName,
        artist_tracks: formatList
    })
    return searchFound
}

async function predictArtistHandler(userInput, suggestions){
    let getArtistSuggester = await axios.get(SUGGEST_URL(userInput, artist_suggester))
    
    try{
        // artist has been found by queries the artist
     const { suggestions } = getArtistSuggester.data.sugges
      
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
                searchFound.pop()
            }
            suggestFound.push({artist: artist_name})
            // query for predicted artist and add it to the searchFound array
            const getSearchQuery = await axios.get(SEARCH_URL(artist_name))
            return formatter(getSearchQuery.data, artist_name)
        }    
        } else {

        return suggestions
     }   

    } catch (err) {
        return new Error("ARTIST_NOT_FOUND")
    }


}


async function predictInputHandler(input){
    const lowered = input.toLowerCase()
    let getArtistSuggester = await axios.get(SUGGEST_URL(lowered, artist_suggester))
    
   try{
    const { suggestions }= getArtistSuggester.data.suggest
    
    // if a match has been found 
    
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
                searchFound.pop()
            }
            suggestFound.push({artist: artist_name})
            // query for predicted artist and add it to the searchFound array
            const getSearchQuery = await axios.get(SEARCH_URL(artist_name))
            return formatter(getSearchQuery.data, artist_name)
        }    
        } else {

        return suggestions
    }


   } catch(err) {
    return new Error(err)
   }

    
}


router.get('/', async (req,res) => {
    const {search} = req.query
    console.log(search)
    const got = await predictInputHandler(search)
    res.send(got)
})



module.exports = router