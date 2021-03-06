require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.CUSTOM_PORT || 5054


var whitelist = ['http://192.168.1.210:3000', 'http://localhost:3000', 'http://192.168.1.210']
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
}



app.use(express.json())
app.use(cors(corsOptions))
app.use('/entrance', routers.entrance)
app.use('/playlist', routers.playlist)



app.listen(PORT, () => {
    console.log("Server started on port " + PORT )
})