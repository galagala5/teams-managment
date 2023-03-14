const services = require('./services')
const DefaultResponse = require('../../utils/defaultResponse')
const Error = require('../../Errors');
const { Player } = require('../../models');


let Responses= new DefaultResponse('Players');



/**
 * Renders html for Teams path
 * @name getPlayers
 * @module playersController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return {Object}
 */
 const getPlayers = async (req,res,next)=>{
    let defaultRender = Responses.defaultView(req)
    try {
        defaultRender.status = 200;
        defaultRender.body.players =  await services.getPlayers('') 
        return res.status(defaultRender.status).render('players',{...defaultRender})
        
    } catch (error) {
        console.log(error)
        let message = Responses.createMessage("Server response error!",error.message,true,'error')
        return next( new Error.APIError(message,400,'GET'))
    }
 }

 /**
 * Renders html for Teams path
 * @name getPlayers
 * @module playersController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return {Object}
 */
  const getPlayerProfile = async (req,res,next)=>{
    let defaultRender = Responses.defaultView(req)
    try {
        defaultRender.status = 200;
        defaultRender.body.player =  await this.Player.getById(req.params) 
        return res.status(defaultRender.status).render('players',{...defaultRender})
        
    } catch (error) {
        console.log(error)
        let message = Responses.createMessage("Server response error!",error.message,true,'error')
        return next( new Error.APIError(message,400,'GET'))
    }
 }
 /**
 * Renders html for Teams path
 * @name createPlayer
 * @module playersController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return {Object}
 */
  const createPlayer = async (req,res,next)=>{
    let defaultRender = Responses.defaultView(req)
    try {
        defaultRender.status = 200;
        defaultRender.body.players =  await services.createPlayer(req.body) 
        return res.status(defaultRender.status).json({...defaultRender})
        
    } catch (error) {
        console.log(error)
        let message = Responses.createMessage("Server response error!",error.message,true,'error')
        return next( new Error.APIError(message,400,'GET'))
    }
 }



 module.exports = {
    getPlayers,

    createPlayer,
 }