require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.CUSTOM_PORT || 5054
const logger = require('./db/queries')

const routers = { 
    entrance: require('./routes/entrance'),
}


app.use(express.json())

app.use('/entrance', routers.entrance)



app.listen(PORT, () => {
    console.log("Server started on port " + PORT )
})