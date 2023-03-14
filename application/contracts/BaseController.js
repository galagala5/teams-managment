const DefaultResponse = require('../../utils/defaultResponse')

module.exports = class BaseController {

    constructor(pathname) {
        this.pathname = pathname || 'Base Controller'
        this.DefaultResponse = new DefaultResponse(this.pathname);
    }

    executeView(){
        try {
            return (req,res,next)=>{
                
            }
            
        } catch (error) {
            
        }
    }



    static jsonResponse(res, code, message) {
        return res.status(code).json({ message })
    }

    ok(res, dto) {
        if (!!dto) {
            res.type('application/json');
            return res.status(200).json(dto);
        } else {
            return res.sendStatus(200);
        }
    }

    created(res) {
        return res.sendStatus(201);
    }

    clientError(res, message) {
        return BaseController.jsonResponse(res, 400, message ? message : 'Unauthorized');
    }

    unauthorized(res, message) {
        return BaseController.jsonResponse(res, 401, message ? message : 'Unauthorized');
    }

    paymentRequired(res, message) {
        return BaseController.jsonResponse(res, 402, message ? message : 'Payment required');
    }

    forbidden(res, message) {
        return BaseController.jsonResponse(res, 403, message ? message : 'Forbidden');
    }

    notFound(res, message) {
        return BaseController.jsonResponse(res, 404, message ? message : 'Not found');
    }

    conflict(res, message) {
        return BaseController.jsonResponse(res, 409, message ? message : 'Conflict');
    }

    tooMany(res, message) {
        return BaseController.jsonResponse(res, 429, message ? message : 'Too many requests');
    }

    todo(res) {
        return BaseController.jsonResponse(res, 400, 'TODO');
    }

    fail(res, error) {
        console.log(error);
        return res.status(500).json({
            message: error.toString()
        })
    }
}