const mysql = require('mysql2')

const path = require('path')
const { Client } = require('ssh2')

// new instance SSH Client
const sshClient = new Client()
// for testing purposed only, uses private pem file key that was generated 
// during the creation of the ec2 instance hosted on AWS

// ssh tunnel
const dbSSH = {
    srcHost: 'localhost',
    srcPort: 3306,
    dstHost: process.env.DB_HOST,
    dstPort: process.env.DB_PORT
}

const dbServer = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_P0RT,
    database: process.env.DB_NAME
}

const ec2Config = {
    host: process.env.EC2_HOST,
    port: process.env.EC2_PORT,
    username: process.env.EC2_USERNAME,
    privateKey: require('fs').readFileSync(path.join(__dirname, '../alktunes.pem')).toString()
}

const SSHConnect = new Promise((resolve , reject) => {
    sshClient.on('ready', () => {
        sshClient.forwardOut(dbSSH.srcHost, dbSSH.srcPort, dbSSH.dstHost, dbSSH.dstPort, (err, stream) => {
            if(err) {reject(err)}
             var connection = mysql.createConnection({
                host: dbServer.host,
                port: dbServer.port,
                user: dbServer.user,
                password: dbServer.password,
                database: dbServer.database,
                stream: stream
            })    
            resolve(connection)
        })
    }).connect(ec2Config)
})


function normalConnection () {
    return new Promise((resolve, reject) => {
        const mysqlConnection = mysql.createConnection(dbServer)
        mysqlConnection.connect((err, connection) => {
            err ? reject(err) : resolve(connection)
        })
    })
}

module.exports = (APP_ENV) => {
    return APP_ENV == 'dev' ? SSHConnect : normalConnection
}

