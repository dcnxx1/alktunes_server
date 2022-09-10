const mysql = require('mysql2')

const dbServer = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit : 0
}




// module.exports = new Promise((resolve, reject) => {
//     const mysqlConnection = mysql.createConnection(dbServer)
//         mysqlConnection.connect((err, connection) => {
//             if(err){
//                 reject(err)
//             }
//             resolve(mysqlConnection)
//         })
//     })  
    
    
    module.exports = mysql.createPool(dbServer)