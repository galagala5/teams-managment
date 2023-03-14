const DefaultResponse = require('../utils/defaultResponse')
const Error = require('../Errors')

let Responses = new DefaultResponse('Players');
const renderTemplate = require('../frameworks/common/renderEjsTemplate')
// use cases
const {
    PlayersServices
} = require('../application/use_cases')

//repositories 
const {
    PlayersPersistence,
    ContactsPersistence,
    PaymentsPersistence,
    TeamsPersistence,
    PresencesPersistence
} = require('../frameworks/persistence')

// Dependecie Injection to service
const Players = new PlayersServices({
    PlayersPersistence: new PlayersPersistence(),
    TeamsPersistence: new TeamsPersistence(),
    ContactsPersistence: new ContactsPersistence(),
    PaymentsPersistence: new PaymentsPersistence(),
    PresencesPersistence: new PresencesPersistence(),
})


class PlayersController {

    /**
     * Renders html for Teams path
     * @name getPlayers
     * @module playersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return {HTML}
     */
    async getPlayers(req, res, next) {
        let defaultRender = Responses.defaultView(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.players = await Players.getPlayers(req.query)

            if (req.isJSON) {
                return res.status(defaultRender.status).json({ ...defaultRender })
            }
            return res.status(defaultRender.status).render('players', { ...defaultRender })

        } catch (error) {
            return next(new Error.APIError(error.message, 400, req.method))
        }
    }

    /**
   * 
   * @name getPlayerProfile
   * @module playersController
   * @function
   * @param req {Object} The request.
   * @param res {Object} The response.
   * @return {HTML}
   */
    async getPlayerProfile(req, res, next) {
        let defaultRender = Responses.defaultView(req)
        try {
            defaultRender.path = "Player Profile"
            defaultRender.status = 200;
            defaultRender.body.player = await Players.getPlayerById(req.params)
            defaultRender.body.player[0].teams = await Players.getPlayerTeams(req.params)
            // create array of teams id
            defaultRender.body.player[0].teamsId = defaultRender.body.player[0].teams.map(t => t._id)
            return res.status(defaultRender.status).render('player-info', { ...defaultRender })

        } catch (error) {
            return next(new Error.APIError(error.message, 400, req.method))
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
    async createPlayer(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.players = await Players.createPlayer(req.body)
            defaultRender.html = await renderTemplate('partials/players/table-row.ejs', { player: defaultRender.body.players[0] })
            defaultRender.flash_message = Responses
                .createFlasMessage(
                    "Success Created",
                    "New player added",
                    'success', 'check')
            return res.status(defaultRender.status).json({ ...defaultRender })

        } catch (error) {
            return next(new Error.APIError(error.message, 400, req.method))
        }
    }

    /**
     * Renders html for Teams path
     * @name updatePlayer
     * @module playersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return {Object}
     */
    async updatePlayer(req, res, next) {
        let defaultRender = Responses.defaultView(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.players = await Players.updatePlayerById(req.params, req.body)
            defaultRender.flash_message = Responses
                .createFlasMessage(
                    "Success Updated",
                    "Player has been updated",
                    'success', 'check')
            return res.status(defaultRender.status).json({ ...defaultRender })

        } catch (error) {
            return next(new Error.APIError(error.message, 400, req.method))
        }
    }

    /**
     * Renders html for Teams path
     * @name updatePlayer
     * @module playersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return {Object}
     */
    async deletePlayer(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.players = await Players.deleteByid(req.params)
            defaultRender.flash_message = Responses
                .createFlasMessage(
                    "Success Deleted",
                    "Player has been deleted",
                    'success', 'check')
            return res.status(defaultRender.status).json({ ...defaultRender })

        } catch (error) {
            return next(new Error.APIError(error.message, 400, req.method))
        }
    }


}

module.exports = new PlayersController()