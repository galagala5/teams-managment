const jwt = require('jsonwebtoken')
const {JWT_EXPIRES,JWT_SECRETE} = require('../../config/config')
const sign = (obj)=>{
    console.log(obj)
    if(typeof obj!=='object'){throw new Error('Parsing error typeof Object expected')}
    return jwt.sign({...obj},JWT_SECRETE,{expiresIn:JWT_EXPIRES})
}


module.exports = { sign }