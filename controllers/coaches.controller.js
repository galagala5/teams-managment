'use-strict'
const DefaultResponse = require('../utils/defaultResponse')
const Error = require('../Errors')

let Responses = new DefaultResponse('Teams');
const renderTemplate = require('../frameworks/common/renderEjsTemplate')
// Use Cases import
const {
    TeamsServices,
    ContactsServices,
    CoachesServices } = require('../application/use_cases')
// Repos import
const {
    TeamsPersistence,
    CategoriesPersistence,
    CoachesPersistence,
    ContactsPersistence } = require('../frameworks/persistence');

// Use Cases Init
const Teams = new TeamsServices({
    TeamsPersistence: new TeamsPersistence(),
    CategoriesPersistence: new CategoriesPersistence()
})
const Coaches = new CoachesServices({
    CoachesPersistence: new CoachesPersistence(),
    ContactPersistence: new ContactsPersistence()
})

const Contacts = new ContactsServices({
    ContactPersistence: new ContactsPersistence()
})


/**
 * Renders html for Teams path
 * @name getCoaches
 * @module teamsController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return {Object}
 */
const getCoaches = async (req, res, next) => {
    let defaultRender = Responses.defaultView(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.coaches = await Coaches.getCoaches('')
        return res.status(defaultRender.status).render('coaches', { ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 500, 'GET'))
    }
}

/**
* Renders html for Teams path
* @name getCoachesById
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {Object}
*/
const getCoachesById = async (req, res, next) => {
    let defaultRender = Responses.defaultView(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.coach = await Coaches.getCoaches(req.params)
        defaultRender.body.teams = await Teams.getTeams("")
        // create array of teams id
        defaultRender.body.teamsId = defaultRender.body.coach[0].teams.map(t => t.id.toString())
        return res.status(defaultRender.status).render('coach-info', { ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'GET'))
    }
}

/**
* @name createCoach
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {Object}
*/
const createCoach = async (req, res, next) => {
    let defaultRender = Responses.defaultView(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.coach = await Coaches.addCoach(req.body)
        defaultRender.html = await renderTemplate('partials/coaches/table-row.ejs', { coach: defaultRender.body.coach[0] })
        defaultRender.flash_message = Responses
        .createFlasMessage(
            "Success Created",
            "New player added",
            'success', 'check')
        
        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'POST'))
    }
}

/**
 * @name updateCoach
 * @module teamsController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return {Object}
 */
const updateCoach = async (req, res, next) => {
    let defaultRender = Responses.defaultJSON(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.coach = await Coaches.updateCoach(req.params, req.body)
        defaultRender.flash_message = Responses
        .createFlasMessage(
            "Success Updated!", 
            `Coach ${defaultRender.body.coach[0].fullname}!`, 
            'success', 'check')

        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'POST'))
    }
}

/**
* @name removeCoachById
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {Object}
*/
const removeCoachById = async (req, res, next) => {
    let defaultRender = Responses.defaultJSON(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.coach = await Coaches.deleteByid(req.params)
        defaultRender.flash_message = Responses
        .createFlasMessage(
            "Success Removed!", 
            `Coach ${defaultRender.body.coach[0].fullname} has been removed!`, 
            'success', 'check')
        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'POST'))
    }
}

module.exports = {
    // get
    getCoaches,
    getCoachesById,
    // post
    createCoach,
    // update
    updateCoach,
    //delete 
    removeCoachById
}