'use strict'
const defaultResponse = require('../utils/defaultResponse')
const responses = new defaultResponse('Error')

const jwt = require('jsonwebtoken')
const { JWT_SECRETE } = require('../config/config')
const {AuthorizationError} = require('../Errors')

const logger = require('../logger')
const {usersPersistence} = require('../frameworks/persistence')


/**
 * Middlewares Class
 * @module Middlewares
 */

class Middlewares{
    constructor({
        logger,
        jwt,
        usersPersistence
    }){
        this.logger = logger || {}
        this.JWT = jwt || {}

        this.Users = usersPersistence;
        this._JWT_SECRETE = JWT_SECRETE
    }   

    validateToken(){
        return (req,res,next)=>{
            try {
                
                if(!req.cookies?.token){
                    return res.status(401).redirect('/login')
                }
                const token = req.cookies.token.split(',')
                const decoded = jwt.verify(token[0],this._JWT_SECRETE )
                req.user = {...decoded}

                return next();

            } catch (error) {
                next(new AuthorizationError( AuthorizationError.MESSAGES.en.SESSION_HAS_EXPIRED , 401, req.method ))
            }
        }
    }

    validateAuthorizationHeader(){
        return (req,res,next)=>{
            try {
                let bearerHeader = req.header['authorization'].split(' ')
                if(bearerHeader[0]!='Bearer'){ 
                    return res.status(401).redirect('/login')
                }
                const token = bearerHeader[1]

                console.log('Token',token)
                const decoded = jwt.verify(token[0],this._JWT_SECRETE )
                req.user = {...decoded}

                return next();

            } catch (error) {
                next(error.message)
            }
        }
    }
    
    isAuthedicated(){
        return (req,res,next)=>{
            try {
                if(!req.user){throw new AuthorizationError('Request User not found!',401,req.method)}
                return next();
            } catch (error) {
                return next(error)
            }
        }
    }

    isActive(){
        return (req,res,next)=>{
            try {
                if(!req.user){ throw new AuthorizationError('Request User not found!',401,req.method)}
                if(!req.user.active){ throw new AuthorizationError('Your Account has been suspended',401,req.method)}
                return next();
            } catch (error) {
                return next(error)
            }
        }
    }

    isAuthorized(role) {
        return (req, res, next) => {
            if (role > +req.user.role ) { 
                return next( new AuthorizationError( AuthorizationError.MESSAGES.en.AuthorizationError , 401, req.method ) ) 
            }
            return next();
        }
    }

    permisions(){
        return (req,res,next)=>{}
    }

    myProfile(){
        return(req,res,next)=>{
            if(req.params.id === req.user.id) return res.redirect('/settings')
            return next();
        }
    }

    getCookieToken(){ return req.cookies.token.split(',')[0]}
    
    getAuthorization(){}

    logHTTP(){
        return(req,res,next)=>{
        
        if(['GET','POST','PUT','DELETE'].includes(req.method)){
            let log = this.generateLog(req)
            this.logger.info( JSON.stringify( log.message) )
        }

        return next();
        }
    }

    logHTTPVerbose(){
        return(req,res,next)=>{
            let log = this.generateLog(req,true)
            this.logger.info( JSON.stringify( log ) )
            return next();
        }
    }

    /**
     * Checks if content-type is application/json
     * and append to req isJSON property
     * @returns 
     */
    cTypes(){
        return (req,res,next)=>{
            let cType = req.get('Content-Type')
            req.isJSON = /(application\/json)/.test(cType);
            return next();
        }
    }



    /**
     * Generate log from express request
     * @private
     */
    generateLog(req, verbose=false ){
        let method = req.method || '';
        let path = req.originalUrl || ""
        let remote = req.headers['x-real-ip'] || req.connection.remoteAddress.split(':');
        // const token = req.cookies.token.split(',')[0]
        // if(token){ req.user = jwt.verify(token, process.env.SECRET_KEY) }

        
        let log = {
            remote:remote,
            method:this.switchMethodNames(method),
            path,
            ip:req.connection.remoteAddress.split(':'),
            isJSON:req.isJSON,
            headers: {
                "Content-Type": req.get("Content-Type"),
                Referer: req.get("referer"),
                "User-Agent": req.get("User-Agent"),
                Cookie: req.get("Authorization"),
                "Access-Control-Allow-Origin": "*",
            },
            user:req.user || '--',
            data:req.body || '',
            message:''
        }
        if(verbose){ return log; }

        log.message = `User: ${log.user.username} from ${log.remote} ${log.method} from path ${log.path} data changed ${JSON.stringify(log.data)}`
        return log;
    }

    /**
     * Manipulate original methods name
     * @private
     */
    switchMethodNames(name){
        const methods = {GET:"REQUESTE DATA[GET]",POST:"ADD DATA[POST]",PUT:"UPDATE DATA[PUT]",PATCH:"PARTIAL UPDATE[PATCH]",DELETE:"DELETE DATA[DELETE]"}
        // let arr = ['GET','POST','PUT','PATCH','DELETE']
        // let arr2 = ['REQUEST DATA','ADDED NEW DATA','UPDATED','SOMETHING','DELETE DATA']
        // return arr2[ arr.indexOf(name)]
        return methods[name];
    }


}



const catchErrors = async (error,req,res,next)=>{
    
    if(!error){ return next(); }
    defaultRes = responses.default(req)
    const method = req.method || '';   
    
    if(process.env.NODE_ENV==='DEV' && error.stack){
        console.log("Error handler:",method,error)
        defaultRes.status = 500
        defaultRes.flash_message = responses.createFlasMessage('Stack Trace Error!',error.message,'error',"exclamation")
        defaultRes.message = responses.createMessage('Stack Trace Error!',error.message,true,'error')
        // return res.status(defaultRes.status).render('errorMessage',{...defaultRes})
    }
    
    if(error.httpCode===404){
        defaultRes.status = 404
        defaultRes.flash_message = responses.pageNotFoundFlashMessage()
        defaultRes.message = responses.pageNotFoundMessage()
    }else{
        defaultRes.status = error.httpCode
        
        defaultRes.flash_message = responses.createFlasMessage(
            'Server response error:',
            error.message,
            'error','exclamation') //error.description || error.message//
        
            defaultRes.message = responses.createMessage(
            'Server response error:',
            error.message,
            true,'error','exclamation') //error.description
    }  
    if(['POST','PUT','PATCH','DELETE'].includes(method) || req.isJSON ){
        return res.status( defaultRes.status || 500).json({...defaultRes})
    }
    
    return res.status(defaultRes.status || 500).render('errorMessage',{...defaultRes})
}






/** Middlewares Singleton Class Export */
module.exports = new Middlewares( { logger,usersPersistence,jwt})


