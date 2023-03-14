const defaultResponse = require('../../utils/defaultResponse')

const responses = new defaultResponse('Error')


const catchErrors = async (error,req,res,next)=>{
    
    if(!error){ return next(); }
    defaultRes = responses.default(req)
    const method = req.method || '';   
    
    if(process.env.NODE_ENV==='DEV' && error.stack){
        console.log("Error handler:",method,error)
        defaultRes.status = 500
        defaultRes.flash_message = responses.createFlasMessage('Stack Trace Error!',error.message,'error',"exclamation")
        defaultRes.message = responses.createMessage('Stack Trace Error!',error.message,true,'error')
        // return res.status(defaultRes.status).render('errorMessage',{...defaultRes})
    }
    
    if(error.httpCode===404){
        defaultRes.status = 404
        defaultRes.flash_message = responses.pageNotFoundFlashMessage()
        defaultRes.message = responses.pageNotFoundMessage()
    }else{
        defaultRes.status = error.httpCode
        
        defaultRes.flash_message = responses.createFlasMessage(
            'Server response error:',
            error.message,
            'error','exclamation') //error.description || error.message//
        
            defaultRes.message = responses.createMessage(
            'Server response error:',
            error.message,
            true,'error','exclamation') //error.description
    }  
    if(['POST','PUT','PATCH','DELETE'].includes(method) || req.isJSON ){
        return res.status( defaultRes.status || 500).json({...defaultRes})
    }
    
    return res.status(defaultRes.status || 500).render('errorMessage',{...defaultRes})
}




module.exports = catchErrors