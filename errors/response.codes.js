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
        ERR_EMAIL_EXIST : {
            ERR: "EMAIL_EXIST",
            statusCode: 500,
            message: "Email already exists"
        },
        ERR_USER_EXIST: {
            ERR: "USER_EXIST",
            statusCode: 500,
            message: "Username already exists"
        },
        ERR_EMAIL_USER_EXIST: {
            ERR: "EMAIL_USER_EXIST",
            statusCode: 500,
            message: "Username and Email address already exist"
        },
        ERR_NO_ID : {
            ERR: "NO_ID",
            statusCode: 404,
            message: "No corresponding ID found"
        }
    },

    SUCCESS:{
        SUCCESS_USR_CREATED: {
            SUCCESS: "USR_CREATED",
            statusCode: 201,
            message: "User has successfuly been created",
        },
        SUCCESS_USR_EXIST: {
            SUCCESS: "USR_EXIST",
            statusCode: 200,
            message: "User exists",
            user_id: (id) => id
        },
     }
    
}