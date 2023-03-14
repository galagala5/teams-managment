const DefaultResponse = require('../utils/defaultResponse')
const Error = require('../Errors')

let Responses= new DefaultResponse('Dashboard');


const getDashboardView = async (req,res,next)=>{
    let defaultRender = Responses.defaultView(req)
    try {
        defaultRender.status = 200;
        return res.status(defaultRender.status).render('dashboard',{...defaultRender})
        
    } catch (error) {
        return next( new Error.APIError(error.message,400,'GET'))
    }
}

module.exports = { 

    getDashboardView,

}
