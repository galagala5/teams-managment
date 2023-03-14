// httpStatusCodes.js

const HttpStatusCode = {
    OK : 200,
    BAD_REQUEST : 400,
    NOT_FOUND : 404,
    INTERNAL_SERVER : 500,
}

const Messages = {

    en:{
        USER_NOT_FOUND:"User Not Found!",
        USER_AUTHORIZATION_ERROR:"You are not authorized!",
        SESSION_HAS_EXPIRED:`Your login session has expired! <a href="/login">[Login Page]</a>`,
        PAGE_NOT_FOUND:""
    },
    gr:{
        USER_NOT_FOUND:"",
        USER_VALIDATION_ERROR:"",
        PAGE_NOT_FOUND:""
    }
}

module.exports = {HttpStatusCode, Messages}