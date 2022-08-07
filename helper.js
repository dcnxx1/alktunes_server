exports.trackFormatter = (trackArray) => {
    return trackArray.map(({ M : track }) => {
        let {S : track_album } = track.track_album
        let {S : track_source} = track.track_source
        let {S : track_cover } = track.track_cover
        let {S : track_name  } = track.track_name
        let {S : track_feel  } = track.track_feel
        let {S : track_length} = track.track_length
        let {N : track_id    } = track.track_id
        
        return {
            track_id,
            track_album,
            track_cover,
            track_feel,
            track_length,
            track_name,
            track_source
        }
    }) 
}


exports.updatedTracks = (tracksArray, playlistId) => {
   const findRequestedArray = tracksArray.find(({M : track}) => {
       const {S : playlist_id} = track.playlist_id
        return playlist_id === playlistId
   })

    const {L : tracks} = findRequestedArray.M.playlist_tracks
    
    return tracks.map(({M : track}) => {
        let {S : track_album } = track.track_album;
        let {S : track_source} = track.track_source;
        let {S : track_cover } = track.track_cover;
        let {S : track_name  } = track.track_name;
        let {S : track_feel  } = track.track_feel;
        let {S : track_length} = track.track_length;
        let {N : track_id    } = track.track_id;
        
        return {
            track_id,
            track_album,
            track_cover,
            track_feel,
            track_length,
            track_name,
            track_source
        }
    }) 

}

