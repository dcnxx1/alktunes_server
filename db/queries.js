const connection = require('../db/db')(process.env.APP_ENV)
const codes = require('../errors/response.codes')

const id = require('../misc/id.generator')

async function loginUser({username, password}) { 
   const mysqlCon = await connection
   
   return new Promise((resolve, reject) => {
     mysqlCon.query(`SELECT username, password FROM alktunes_users WHERE username=? AND password=?`, [username, password], (err, results, fields) => {
        err || results.length == 0 ? reject(codes.ERRORS.ERR_USR_NOT_EXIST) : resolve(codes.SUCCESS.SUCCESS_USR_EXIST)
     })
   })
   
}

async function registerUser({username, password, email}) {
   const mysqlCon = await connection
   return new Promise((resolve, reject) => {
      mysqlCon.query('SELECT username, email from alktunes_users WHERE username=? OR email =?', [username, email], (err, results, fields) => {
         // if not records found, the user has been created. username, email, password will be stored as the newly created user
         const result = results[0]
         
         // reject if username and email have been found in the database
         if(result?.username == username && result?.email == email){
            reject(codes.ERRORS.ERR_EMAIL_USER_EXIST)
            // reject if email already exists
         } else if(result?.email == email){
            reject(codes.ERRORS.ERR_EMAIL_EXIST)
         } else if(result?.username == username){
            // reject if username already exists
            reject(codes.ERRORS.ERR_USER_EXIST)
         } else {
            mysqlCon.query(`INSERT INTO alktunes_users(user_id, username, password, email) VALUES(?, ?, ?, ?)`, [id(), username, password, email])
            resolve(codes.SUCCESS.SUCCESS_USR_CREATED)
         }
      })
   })
}


module.exports = {
   loginUser,
   registerUser
}