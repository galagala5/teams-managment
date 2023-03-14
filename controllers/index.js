const dashboardController = require('./dashboard.controller')
const teamsController = require('./teams.controller')
const coachesController = require('./coaches.controller')
const playersController = require('./players.controller')
const authController = require('./auth.controller')
const userController = require('./users.controller')

module.exports = {
    dashboardController,
    teamsController,
    authController,
    // categoriesController:require('./'),
    coachesController,
    playersController,
    userController,
    // presencesController:require('./'),
    // paymentsController:require('./')
}