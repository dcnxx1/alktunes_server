const connection = require('../db/db')(process.env.APP_ENV)




async function loginUser({username, password}) { 
   const mysqlCon = await connection
   
   return new Promise((resolve, reject) => {
     mysqlCon.query(`SELECT username, password FROM alktunes_users WHERE username=? AND password=?`, [username, password], (err, results, fields) => {
        err || results.length == 0 ? reject('Please put in a valid email or passcode') : resolve(results)
     })
   })
    
}




module.exports = loginUser