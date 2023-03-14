'use strict';
const {HttpStatusCode,Messages} = require('./prefix')

class BaseError extends Error {
    static MESSAGES = {...Messages}

    constructor(description) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.message = this.message
        this.name = this.constructor.name;
        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);
    }


}
   
//free to extend the BaseError
class APIError extends BaseError {
    /**
     * 
     * @param {String} description error description
     * @param {Number} httpCode Valid http code
     * @param {String} method Valid http code http method
     */
    constructor(description ,httpCode, method){
        super(description);
        
        this.name = this.constructor.name;
        this.httpCode = httpCode || HttpStatusCode.INTERNAL_SERVER
        this.isOperational = true
        this.method = method || ''
        this.description = description ||'internal server error'
    }

}

class PageNotFound extends APIError{
    constructor(){
        super("Page not found","404",'GET')
        this.httpCode = 404
        this.message = BaseError.MESSAGES.en.PageNotFound
    }
}

class AuthorizationError extends BaseError{
    constructor(message, httpCode, method, title, description ){
        super("Authorization Error")
        this.httpCode = httpCode || HttpStatusCode.INTERNAL_SERVER
        this.method = method || ''
        this.title = title || 'Authorization Error!'
        this.message = message || AuthorizationError.MESSAGES.en.USER_AUTHORIZATION_ERROR
        this.description = description ||'internal server error'
    }


}



module.exports = {BaseError,APIError,PageNotFound,AuthorizationError}