const DefaultResponse = require('../utils/defaultResponse')
const Error = require('../Errors')
const jsonwebtoken = require('../frameworks/common/jsonwebtokens')
const bcryptjs = require('bcryptjs') 


let Responses= new DefaultResponse('Login');

// repositories 
const {ContactsPersistence,UsersPersistence} = require('../frameworks/persistence')

const {AuthServices} = require('../application/use_cases')

const Auth = new AuthServices({
    UserPersistence:new UsersPersistence(),
    ContactsPersistence: new ContactsPersistence(),
    jsonwebtoken,
    Bcrypt:bcryptjs
})


/**
 * Renders html for Teams path
 * @name getLoginPage
 * @module authController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return {Object}
 */
 const getLoginPage = async (req,res,next)=>{
    let defaultRender = Responses.defaultView(req)
    try {
        defaultRender.status = 200;
        
        return res.status(defaultRender.status).render('login',{...defaultRender})
    } catch (error) {
        return next( new Error.APIError(error.message,400,'GET'))
    }
 }

 /**
 * Renders html for Teams path
 * @name getLogout
 * @module authController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return {Object}
 */
  const getLogout = async (req,res,next)=>{
    let defaultRender = Responses.defaultView(req)
    try {
        defaultRender.status = 200;
        defaultRender.flash_message = Responses.createFlasMessage('Success Logout',`Welcome back `,'success')
        Auth.destroyeCookie(res,'token')
        return res.status(defaultRender.status).redirect('/')
    } catch (error) {
        return next( new Error.APIError(error.message,400,'GET'))
    }
 }

 /**
 * @name postLogin
 * @module authController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return {Object}
 */
const postLogin = async (req,res,next)=>{
    let defaultRender = Responses.defaultJSON(req)
    try {
        const {token,username} = await Auth.loginUser(req.body);
        Auth.setCookie(res,'token',token)
        defaultRender.status = 200;  
        defaultRender.path = '/'
        defaultRender.flash_message = Responses
        .createFlasMessage(
            'Success Login',
            `Welcome back ${username}`,
            'success')
        return res.status(defaultRender.status).json({...defaultRender})
        
    } catch (error) {
        return next( new Error.APIError(error.message,400,'POST'))
    }

}



 module.exports = {
    getLoginPage,
    getLogout,
    postLogin
 }