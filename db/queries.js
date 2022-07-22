const connection = require('../db/db')(process.env.APP_ENV)
const codes = require('../errors/response.codes')
const LAMBDA_URL="https://3nxhmnntzd.execute-api.eu-central-1.amazonaws.com/stage1"
const id = require('../misc/id.generator')
const axios = require('axios')
async function loginUser({username, password}) { 
   const mysqlCon = await connection
   
   return new Promise((resolve, reject) => {
     mysqlCon.query(`SELECT user_id, username, password FROM alktunes_users WHERE username=? AND password=?`, [username, password], (err, results, fields) => {
      err || results.length == 0 ? reject(codes.ERRORS.ERR_USR_NOT_EXIST) 
        : resolve({
         SUCCESS: codes.SUCCESS.SUCCESS_USR_EXIST.SUCCESS,
         statusCode: codes.SUCCESS.SUCCESS_USR_EXIST.statusCode,   
         message: codes.SUCCESS.SUCCESS_USR_EXIST.message,   
         user_id: codes.SUCCESS.SUCCESS_USR_EXIST.user_id(results[0].user_id),   
        })
     })
   })
   
}

// sets up user for dynamodb
function createUserForPlaylist(user_id){
   const config= {
      headers: {
          user_id: user_id  
      }
}
   const data = {
   s: null
   }
 axios.post(`${LAMBDA_URL}/playlist/create`, data, config)
   
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
            const generatedId = id()

            // create user for dynamodb
            createUserForPlaylist(generatedId)

            mysqlCon.query(`INSERT INTO alktunes_users(user_id, username, password, email) VALUES(?, ?, ?, ?)`, [generatedId, username, password, email])
            resolve({
               SUCCESS: codes.SUCCESS.SUCCESS_USR_CREATED.SUCCESS,
               message: codes.SUCCESS.SUCCESS_USR_CREATED.message,
               statusCode: codes.SUCCESS.SUCCESS_USR_CREATED.statusCode,
               user_id : generatedId
            })
         }
      })
   })
}


async function getId(username){
const mysqlCon = await connection
   return new Promise((resolve, reject) => {
      mysqlCon.query(`SELECT user_id from alktunes_users where username=?`, [username], (err, results, _ ) => {
         if(results.length == 0) {
            reject(codes.ERRORS.ERR_NO_ID)
         } else {
         
            resolve({
               SUCCESS: codes.SUCCESS.SUCCESS_ID_FOUND.SUCCESS,
               statusCode: codes.SUCCESS.SUCCESS_ID_FOUND.statusCode,
               message: codes.SUCCESS.SUCCESS_ID_FOUND.message,
               user_id: codes.SUCCESS.SUCCESS_ID_FOUND.user_id(results[0].user_id)
            })
         }
      })
   })
}

module.exports = {
   loginUser,
   registerUser,
   getId
}