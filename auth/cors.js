
var whitelist = [process.env.CORS_HOST_BROAD, process.env.CORS_HOST_LOCAL, process.env.CORS_ALL]
    
module.exports = {
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback("Forbidden")
        }
      }
    }