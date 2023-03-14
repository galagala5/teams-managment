const mongoose = require ('mongoose');
const options = require('./options')
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    person:{type:Schema.Types.ObjectId,refPath:'onModel'},
    onModel:{type:String,required:true},
    amount:{type:Number,required:true},
    issueDate:{type:Date,required:true},
    description:{type:String}
},options.first)

PaymentSchema.virtual("url").get(function(){ return '/payments/' + this._id })




const Payments = mongoose.model('payments',PaymentSchema);

module.exports = Payments