const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('../frameworks/common/jsonwebtokens')
const config = require('../config/config')
const Error = require('../Errors')

const renderTemplate = require('../frameworks/common/renderEjsTemplate')


const DefaultResponse = require('../utils/defaultResponse')
let Responses = new DefaultResponse('Users');


const eMailer = require('../frameworks/emails')
// repositories 
const { ContactsPersistence, UsersPersistence } = require('../frameworks/persistence')
const { AuthServices } = require('../application/use_cases')

const Auth = new AuthServices({
    UserPersistence: new UsersPersistence(),
    ContactsPersistence: new ContactsPersistence(),
    jsonwebtoken,
    Bcrypt: bcryptjs,
    config
})





class UsersController {

    /**
     * Renders html for Teams path
     * @name getUsers
     * @module usersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return {HTML}
     */
    async getUsers(req, res, next) {
        let defaultRender = Responses.defaultView(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.users = await Auth.getUsers(req.query)
            return res.status(defaultRender.status).render('users', { ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'GET'))
        }
    }


    /**
     * Renders html for Teams path
     * @name getUserById
     * @module usersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return {HTML}
     */
    async getUserById(req, res, next) {
        let defaultRender = Responses.defaultView(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.users = await Auth.getUserById(req.params)
            return res.status(defaultRender.status).render('users', { ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'GET'))
        }
    }
    /**
     * Renders html for Teams path
     * @name getUserById
     * @module usersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return {HTML}
     */
    async getUserModal(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.users = await Auth.getUserById(req.params)
            defaultRender.html = await renderTemplate(
                'partials/users/user-update-modal.ejs',
                { user: defaultRender.body.users[0] })
            return res.status(defaultRender.status).json({ ...defaultRender }) 
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'GET'))
        }
    }

    /**
     * Renders html for Teams path
     * @name getUserById
     * @module usersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return {HTML}
     */
    async getUserProfile(req, res, next) {
        let defaultRender = Responses.defaultView(req)
        defaultRender.path = "Settings";
        try {
            defaultRender.status = 200;
            defaultRender.body.user = await Auth.getUserById({id:req.user.id})
            return res.status(defaultRender.status).render('settings', { ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'GET'))
        }
    }
    /**
     * Renders html for Teams path
     * @name getUserById
     * @module usersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return {HTML}
     */
    async updateUserProfile(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        defaultRender.path = "Settings";
        try {
            defaultRender.status = 200;
            defaultRender.body.user = await Auth.updateUserById({
                id:req.body.id,
                data:req.body,
                password:true})

            defaultRender.flash_message = Responses
                .createFlasMessage(
                    'User updated successfully',
                    `User ${defaultRender.body?.user[0]?.username} has been update`,
                    'success', 'tick')

            await eMailer.testMail({
                to:'k.gala1@hotmail.com'
                ,subject:'Test info',
                template:'templates/email.ejs',
                data:defaultRender.body.user
            })
            return res.status(defaultRender.status).json({ ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'GET'))
        }
    }
    /**
    * 
    * @name registerUser
    * @module usersController
    * @function
    * @param req {Object} The request.
    * @param res {Object} The response.
    * @return { Object }
    */
    async addUser(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.users = await Auth.registerUser(req.body)
            defaultRender.html = renderTemplate('partials/users/user-table-row.ejs', { user: defaultRender.body.users })
            defaultRender.flash_message = Responses.createFlasMessage('User created successfuly', ``, 'success', 'tick')
            return res.status(defaultRender.status).json({ ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'POST'))
        }
    }
    /**
     * Update user by id
     * @name updateUserById
     * @module usersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return { Object }
     */
    async updateUserById(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.user = await Auth.updateUserById({
                id:req.params.id, 
                data:req.body,
                password:false })
            defaultRender.flash_message = Responses
                .createFlasMessage(
                    'User updated successfully',
                    `User ${defaultRender.body.user[0]?.username} has been update`,
                    'success', 'tick')
            return res.status(defaultRender.status).json({ ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'GET'))
        }
    }
    /**
     * Activate user by id
     * @name updateUserById
     * @module usersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return { Object }
     */
    async activateById(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.user = await Auth.activateUser(req.params)
            defaultRender.flash_message = Responses
                .createFlasMessage(
                    'User activated successfully',
                    `User ${defaultRender.body.user[0]?.username} has been activated`,
                    'success', 'tick')
            return res.status(defaultRender.status).json({ ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'GET'))
        }
    }

    /**
     * Delete user by id
     * @name deleteUser
     * @module usersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return { Object }
     */
    async resetUserPasswordById(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.user = await Auth.resetPasswordById(req.params)
            // we can send email to user here
            defaultRender.flash_message = Responses
                .createFlasMessage(
                    'User password reseted',
                    `User ${defaultRender.body.user[0]?.username} has been reset`,
                    'success', 'tick')
            return res.status(defaultRender.status).json({ ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'GET'))
        }
    }

    /**
 * Delete user by id
 * @name deleteUser
 * @module usersController
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @return { Object }
 */
    async deleteUser(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.user = await Auth.deleteUserById(req.params)
            defaultRender.flash_message = Responses
                .createFlasMessage(
                    'User deleted successfuly',
                    `User ${defaultRender.body.user?.username} has been deleted`,
                    'success', 'tick')
            return res.status(defaultRender.status).json({ ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'DELETE'))
        }
    }

    /**
     * Delete user by id
     * @name deleteUser
     * @module usersController
     * @function
     * @param req {Object} The request.
     * @param res {Object} The response.
     * @return { Object }
     */
    async deleteUser(req, res, next) {
        let defaultRender = Responses.defaultJSON(req)
        try {
            defaultRender.status = 200;
            defaultRender.body.user = await Auth.deleteUserById(req.params)
            defaultRender.flash_message = Responses
                .createFlasMessage(
                    'User deleted successfuly',
                    `User ${defaultRender.body.user?.username} has been deleted`,
                    'success', 'tick')
            return res.status(defaultRender.status).json({ ...defaultRender })
        } catch (error) {
            return next(new Error.APIError(error.message, 400, 'DELETE'))
        }
    }


}


module.exports = new UsersController()



