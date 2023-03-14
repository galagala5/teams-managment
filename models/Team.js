const mongoose = require ('mongoose');
const options = require('./options')
const moment = require('moment')
const Schema = mongoose.Schema;


const TeamSchema = new Schema({
    name:{ type:String,required:true,trim:true,uppercase: true },
    year:{type:Number,require:true,default:moment().year()},
    players:[{type:Schema.Types.ObjectId,ref:'player'}],
    coach:[{type:Schema.Types.ObjectId,ref:'coach'}],
    category:{type:Schema.Types.ObjectId,ref:'categories',required:true},
    description:{type:String}
},options.first)

TeamSchema.virtual("url").get(function(){ return '/teams/' + this._id })

const CoachSchema = new Schema({
    name:{first:{type:String,required:true,uppercase:true},last:{type:String,require:true,uppercase:true}},
    contact:{type:Schema.Types.ObjectId,ref:'contact',required:true},
    teams:[{type:Schema.Types.ObjectId,ref:'team'}],
    deleted:{type:Boolean,default:false},
    description:{type:String}
},options.first)

CoachSchema.virtual("url").get(function(){ return '/coaches/' + this._id })
CoachSchema.virtual("fullname").get(function(){ return this.name.first + " " + this.name.last })

CoachSchema.pre('deleteOne', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Contacts.deleteOne({person: this._id}).exec();
    next();
});


const CategoriesSchema = new Schema({
    name:{type:String,required:true,trim:true,uppercase: true},
    alias:{type:String,required:true,trim:true,uppercase: true},
    description:{type:String}
},options.first)

CategoriesSchema.virtual("url").get(function(){ return '/teams/category/' + this._id })

const PlayerSchema = new Schema({
    name:{first:{type:String,required:true},last:{type:String,require:true}},
    birthday:{type:Date,reuired:true},
    contact:{type:Schema.Types.ObjectId,ref:'contact',required:true},
    payments:[{type:Schema.Types.ObjectId,ref:'payments',required:true}],
    deleted:{type:Boolean,required:true,default:false},
    description:{type:String}
},options.first)

PlayerSchema.virtual("url").get(function(){ return '/players/' + this._id })
PlayerSchema.virtual("fullname").get(function(){ return this.name.first + " " + this.name.last })


const PresencesSchema = new Schema({
    teams:{type:Schema.Types.ObjectId,ref:'team',required:true},
    coach:{type:Schema.Types.ObjectId,ref:'coach',required:true},
    players:[[{type:Schema.Types.ObjectId, ref:'players',required:true}]],
    rate:{type:Number,require:true,min:1,max:100},
    description:{type:String}
},options.first)
PresencesSchema.virtual("url").get(function(){ return '/presences/' + this._id })



const Teams = mongoose.model('team',TeamSchema);
const Coach = mongoose.model('coach',CoachSchema);
const Categories = mongoose.model('categories',CategoriesSchema);
const Player = mongoose.model('player',PlayerSchema);
const Presences = mongoose.model('presences',PresencesSchema);

module.exports = {
    Teams, Coach, Categories, Player, Presences
}