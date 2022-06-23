module.exports = {
    
    ERRORS: {
        ERR_JWT_MALFORMED: {
            ERR: "JWT_MALFORMED",
            statusCode: 403,
            message: "JWT Malformed"
        },
        ERR_USR_NOT_EXIST : {
            ERR: "USR_NOT_EXIST",
            statusCode: 500,
            message: "No such user exists"
        },
        ERR_EMAIL_EXISTS : {
            ERR: "EMAIL_EXISTS",
            statusCode: 500,
            message: "Email already exists"
        },
    },

    SUCCESS:{
        SUCCESS_USR_CREATED: {
            SUCCESS: "USR_CREATED",
            statusCode: 201,
            message: "User has successfuly been created"
        },
     }
    
}