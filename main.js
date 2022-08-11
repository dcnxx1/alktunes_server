require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.CUSTOM_PORT || 5054

app.use(express.json())

var whitelist = [process.env.CORS_HOST_BROAD, process.env.CORS_HOST_LOCAL, process.env.CORS_ALL]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


const routers = { 
  entrance: require('./routes/entrance'),
  playlist: require('./routes/playlist'),
  tracks  : require('./routes/tracks'  ),
  search  : require('./routes/search'  )
}




app.use(cors(corsOptions))
app.use('/entrance', routers.entrance)
app.use('/playlist', routers.playlist)
app.use('/tracks'  , routers.tracks  )
app.use('/search'  , routers.search  )




app.listen(PORT, () => {
    console.log("Server started on port " + PORT )
})