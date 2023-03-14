// 'use strict'
// const { User } = require('../models')
// const jwt = require('jsonwebtoken')
// const {createDefaultResponse} = require('../constants/views-default')
// const { createMessage} = require('../constants/message')
// const {logOutUser} = require('../app_modules/authedication/controller/services')
// const logger = require('../logger')
// // const moment = require('moment')


// /**
//  * @name validateToken
//  * @description Validating a JWT token to grand user access
//  * @returns 
//  */
// const validateToken = () => {
//     return async (req,res,next) => {
//         let remote = req.headers['x-real-ip'] || req.connection.remoteAddress;
//         try {
//             if(!req.cookies.token){
//                 logger.error(`Validation log request Error: http: ${remote} Missing Token?`)
//                 return res.status(401).redirect('/login')
//             }
//             const token = req.cookies.token.split(',')
//             const decoded = jwt.verify(token[0],process.env.SECRET_KEY )
//             req.user = {...decoded}

//             // let activeUser = await ActiveUser.findOne({user:req.user.id})

//             // Checking for access rights before proceed to execute
//             if(!req.user.active){
//                 logger.error(`Validation log request: http: ${remote} Your account is deactivated`)
//                 throw new Error ("Your account is deactivated")
//             }
//             // Request is valid can passthrough
//             // console.log(`Validation log request: user: ${JSON.stringify( req.user )}, http: ${req.connection.remoteAddress}${req.originalUrl}`)

//             return next();

//         } catch (error) {
//             let defaultRender = createDefaultResponse({user:{username:'Error',role:'0'}},'Authorization Error')
//             defaultRender.message = createMessage('Session has been expired',`Please login again with your credentials <a href="/login">Login</a><br> ${error.message}`,true,'error');
//             logOutUser(req,res,'token')
//             next({...defaultRender.message})
//         }

//     }
// }

// /**
//  * @name authorization
//  * @description Checknig if req.user have access to specific routes
//  * @param {Number} accessLevel Number from 1-3 | basic-admin
//  * @returns 
//  */
// const authorization = (accessLevel=1)=>{
//     return (req,res,next) => {
//         try {
//             if(req.user.profile){ return next(); }
//             if( req.user.role < accessLevel) {
//                 response.status=401
//                 throw new Error('Not Authorized: Access denied')
//             }
//             return next();

//         } catch (error) {
//             let method = req.method || '';
//             let path = req.originalUrl || ""
//             let defaultRender = createDefaultResponse(req,'Not Authorized')


//             if(['POST','PUT','PATCH','DELETE'].includes(method)){
//                 defaultRender.message = createMessage('You Are Not Authorized',
//                 `Please contact your administrator`,true,'error');
//                 return res.status(401).json({...defaultRender})
//             }else{

//                 defaultRender.message = createMessage('You Are Not Authorized',
//                 `Please contact your administrator <a href="#" onclick="history.go(-1);return false;"><i class="left arrow icon"></i>[Go Back]</a>`,true,'error');
//                 return next(defaultRender.message)
//             }

//         }

//     }
// }
// /**
//  * @description Check if req.user is changing data for his profile
//  * @param {String} params Param name to be checked
//  */
// const itsMe = (_params)=>{
//     return (req,res,next)=>{
//         // 
//         if(req.user.role>=2){ return next(); }

//         if(req.params[_params] && req.params[_params]==req.user.id){
//             req.user.profile = true;
//             return next();
//         }else{
//             let message = createMessage('You Are Not Authorized to change others data',
//                 `Please contact your administrator`,true,'error');
//             return next(message);
//         }
//     }
// }



const jwt = require('jsonwebtoken')
const { JWT_SECRETE } = require('../../config/config')
const { AuthorizationError } = require('../../Errors')

module.exports = class ValidationMiddlewares {

    constructor({
        usersPersistence
    }) {
        this.Users = usersPersistence;
        this._JWT_SECRETE = JWT_SECRETE
    }

    validateToken() {
        return (req, res, next) => {
            try {

                if (!req.cookies?.token) {
                    return res.status(401).redirect('/login')
                }
                const token = req.cookies.token.split(',')
                const decoded = jwt.verify(token[0], this._JWT_SECRETE)
                req.user = { ...decoded }

                return next();

            } catch (error) {
                next(error.message)
            }
        }
    }

    validateAuthorizationHeader() {
        return (req, res, next) => {
            try {
                let bearerHeader = req.header['authorization'].split(' ')
                if (bearerHeader[0] != 'Bearer') {
                    return res.status(401).redirect('/login')
                }
                const token = bearerHeader[1]

                console.log('Token', token)
                const decoded = jwt.verify(token[0], this._JWT_SECRETE)
                req.user = { ...decoded }

                return next();

            } catch (error) {
                next(error.message)
            }
        }
    }

    isAuthedicated() {
        return (req, res, next) => {
            try {
                if (!req.user) { throw new AuthorizationError('Request User not found!', 401, req.method) }
                return next();
            } catch (error) {
                return next(error)
            }
        }
    }
    isActive() {
        return (req, res, next) => {
            try {
                if (!req.user) { throw new AuthorizationError('Request User not found!', 401, req.method) }
                if (!req.user.active) { throw new AuthorizationError('Your Account has been suspended', 401, req.method) }
                return next();
            } catch (error) {
                return next(error)
            }
        }
    }


    permisions() {
        return (req, res, next) => { }
    }
}