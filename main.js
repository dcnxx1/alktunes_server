require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.CUSTOM_PORT || 5054
const { jwtChecker} = require('./auth/authenticator')
app.use(express.json())

var whitelist = [process.env.CORS_HOST_BROAD, process.env.CORS_HOST_LOCAL, process.env.CORS_ALL]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback("Forbidden")
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
app.use(jwtChecker)
app.use('/entrance', routers.entrance)

app.use('/playlist', routers.playlist)
app.use('/tracks'  , routers.tracks  )
app.use('/search'  , routers.search  )






app.listen(PORT, () => {
 console.log("App running on port " + PORT)
})