const mongoose = require ('mongoose');
const options = require('./options')
const Schema = mongoose.Schema;



const ContactSchema = new Schema({
    person:{type:Schema.Types.ObjectId,refPath:'onModel'},
    onModel:{type:String,required:true},
    town : {type:String,required:true},
    address:{type:String,required:true},
    zipcode:{type:Number},
    email:{type:String},
    phones:{
        type: [{ type: String }],
        validate: [arrayLimit, 'Phone number validation error!']
    }
},options.first)



function arrayLimit(val) {
    return val.length >=1 && val.length <=3;
}

/**
 * manipulate phone numbers from serializeJSON
 */
function getPhones(phones){
    let _p = []
    for(let value of Object.values(phones)){
        _p.push(value)
    }
    return _p
}

const Contacts = mongoose.model('contact',ContactSchema)

module.exports =  Contacts