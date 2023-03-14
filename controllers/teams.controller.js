const playerServices = require('./players/services')

const DefaultResponse = require('../utils/defaultResponse')
const Error = require('../Errors')

let Responses = new DefaultResponse('Teams');

// Bussines Logic
const {
    TeamsServices,
    ContactsServices,
    PlayersServices,
    CoachesServices } = require('../application/use_cases')
// Repos
const {
    TeamsPersistence,
    CategoriesPersistence,
    PlayersPersistence,
    CoachesPersistence,
    ContactsPersistence } = require('../frameworks/persistence');

const { Coach, Categories } = require('../models');
const renderEjsTemplate = require('../utils/renderEjsTemplate');

// Use Cases
const Teams = new TeamsServices({
    TeamsPersistence: new TeamsPersistence(),
    CategoriesPersistence: new CategoriesPersistence()
})
const Coaches = new CoachesServices({
    CoachesPersistence: new CoachesPersistence(),
    ContactPersistence: new ContactsPersistence()
})

const Players = new PlayersServices({
    PlayersPersistence: new PlayersPersistence(),
})

const Contacts = new ContactsServices({
    ContactPersistence: new ContactsPersistence()
})




/**
 * Renders html for Teams path
 * @name getTeamsView
 * @module teamsController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return {Object}
 */
const getTeamsView = async (req, res, next) => {
    let defaultRender = Responses.defaultView(req)
    try {
        defaultRender.status = 200;
        defaultRender.body.teams = await Teams.getTeams(req.params)
        defaultRender.body.categories = await Teams.getCategories('')
        return res.status(defaultRender.status).render('teams', { ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 500, 'GET'))
    }
}

/**
* Renders html for Teams path
* @name getTeamsById
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {HTML}
*/
const getTeamsById = async (req, res, next) => {
    let defaultRender = Responses.defaultView(req)
    try {
        defaultRender.status = 200;
        defaultRender.body.teams = await Teams.getTeams(req.params, true)
        defaultRender.body.players = await Players.getPlayers('')
        defaultRender.body.coaches = await Coaches.getCoaches("")
        return res.status(defaultRender.status).render('team-info', { ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 500, 'GET'))
    }
}

/**
* Renders html for Teams path
* @name getCoaches
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {HTML}
*/
const getCoaches = async (req, res, next) => {
    let defaultRender = Responses.defaultView(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.coaches = await Coaches.getCoaches('')
        return res.status(defaultRender.status).render('coaches', { ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(message, 500, 'GET'))
    }
}

/**
* Renders html for Teams path
* @name getCoachesById
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {HTML}
*/
const getCoachesById = async (req, res, next) => {
    let defaultRender = Responses.defaultView(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.coach = await Coaches.getCoaches(req.params)
        defaultRender.body.teams = await Teams.getTeams("")
        return res.status(defaultRender.status).render('coach-info', { ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'GET'))
    }
}
/**
* Renders html to append in modals
* @name getCategoryByIdToModal
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {Object}
*/
const getCategoryByIdToModal = async (req, res, next) => {
    let defaultRender = Responses.defaultJSON(req)
    try {
        defaultRender.status = 200;
        defaultRender.body.category = await Ca.getCategories(req.params)
        defaultRender.html = await renderEjsTemplate('partials/categories/info-form.ejs', { category: defaultRender.body.category[0] })
        return res.status(defaultRender.status).json(defaultRender)

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'GET'))
    }
}

/**
* Renders html to append in modals
* @name getModalPlayers
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {JSON}
*/
const getModalPlayers = async (req, res, next) => {
    let defaultRender = Responses.defaultJSON(req)
    try {
        defaultRender.status = 200;
        defaultRender.body.players = await Players.getPlayers("")
        defaultRender.body.team = await Teams.getTeams(req.params)
        defaultRender.html = await require('../utils/renderEjsTemplate')('partials/players/add-players-to-team.ejs', { team: defaultRender.body.team[0], players: defaultRender.body.players })
        defaultRender.flash_message = Responses
                .createFlasMessage(
                    "Success Created",
                    "New player added",
                    'success', 'check')
        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'GET'))
    }
}

/**
* Renders html to append in modals
* @name getPresences
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {HTML}
*/
const getPresences = async (req, res, next) => {
    let defaultRender = Responses.defaultView(req)
    defaultRender.path = "Presences"
    try {
        defaultRender.status = 200;
        defaultRender.body.coaches = await Coaches.getCoaches('')
        defaultRender.body.teams = await Teams.getTeams('')
        return res.status(defaultRender.status).render('presences', { ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'GET'))
    }
}
/**
* Renders html to append in modals
* @name getPresences
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {HTML}
*/
const getPresencesStep2 = async (req, res, next) => {
    let defaultRender = Responses.defaultView(req)
    defaultRender.path = "Presences"
    try {
        defaultRender.status = 200;
        defaultRender.body.players = await playerServices.getPlayersByTeamId(req.query.team)
        let html = await require('../utils/renderEjsTemplate')('partials/players/presences-form.ejs', { players: defaultRender.body.players })
        return res.status(defaultRender.status).send(html)

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'GET'))
    }
}

/**
* @name createCategory
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {Object}
*/
const createCategory = async (req, res, next) => {
    let defaultRender = Responses.defaultJSON(req)
    try {
        defaultRender.status = 200;
        defaultRender.body.category = await Categories.addCategories(req.body)
        defaultRender.flash_message = Responses.createFlasMessage("Success Created", "New category added", 'success', 'check')
        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(message, 400, 'POST'))
    }
}
/**
* @name createTeam
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {Object}
*/
const createTeam = async (req, res, next) => {
    let defaultRender = Responses.defaultJSON(req)
    try {
        defaultRender.status = 200;
        defaultRender.body.team = await Teams.addTeam(req.body)
        defaultRender.flash_message = Responses.createFlasMessage("Success Created", "New team added", 'success', 'check')
        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'POST'))
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
    let defaultRender = Responses.defaultJSON(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.team = await Coaches.addCoach(req.body)
        defaultRender.flash_message = Responses.createFlasMessage("Success Created", "New coach added", 'success', 'check')
        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'POST'))
    }
}
/**
* @name addPlayerToTeam
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {Object}
*/
const addPlayerToTeam = async (req, res, next) => {
    let defaultRender = Responses.defaultJSON(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.team = await Teams.addPlayersToTean(req.params, req.body)
        
        defaultRender.flash_message = Responses
            .createFlasMessage(
                "Success Updated", 
                "New Player list added", 
                'success', 'check')

        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'POST'))
    }
}
/**
* @name addPresents
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {Object}
*/
const addPresents = async (req, res, next) => {
    let defaultRender = Responses.defaultJSON(req)
    defaultRender.path = 'Presents'
    try {
        defaultRender.status = 200;
        defaultRender.body.team = await Teams.addPlayer(req.params.id, req.body)
        defaultRender.flash_message = Responses.createFlasMessage("Success Added", "New Presents table added", 'success', 'check')
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
        defaultRender.flash_message = Responses.createFlasMessage("Success Updated!", `Coach ${defaultRender.body.coach.fullname}!`, 'success', 'check')
        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(error.message, 400, 'POST'))
    }
}

/**
* @name updateCategoriesById
* @module teamsController
* @function
* @param req {Object} The request.
* @param res {Object} The response.
* @return {Object}
*/
const updateCategoriesById = async (req, res, next) => {
    let defaultRender = Responses.defaultJSON(req)
    defaultRender.path = 'Coaches'
    try {
        defaultRender.status = 200;
        defaultRender.body.coach = await Teams.updateCoach(req.params, req.body)
        defaultRender.flash_message = Responses.createFlasMessage("Success Updated!", `Coach ${defaultRender.body.coach.fullname}!`, 'success', 'check')
        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(message, 400, 'POST'))
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
        defaultRender.body.coach = await services.removeCoach(req.params)
        defaultRender.flash_message = Responses.createFlasMessage("Success Removed", `Coach Coach ${defaultRender.body.coach.fullname} has been removed!`, 'success', 'check')
        return res.status(defaultRender.status).json({ ...defaultRender })

    } catch (error) {
        return next(new Error.APIError(message, 400, 'POST'))
    }
}

module.exports = {
    // get
    getTeamsView,
    getTeamsById,
    getCoaches,
    getCoachesById,
    getCategoryByIdToModal,
    getModalPlayers,
    getPresences,
    getPresencesStep2,
    // post
    createCategory,
    createTeam,
    createCoach,
    addPlayerToTeam,
    addPresents,
    // update
    updateCoach,
    updateCategoriesById,

    //delete 
    removeCoachById
}