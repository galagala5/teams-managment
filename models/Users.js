const mongoose = require ('mongoose');
const Bcrypt = require('bcryptjs');
const options = require('./options')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{first:{type:String,required:true},last:{type:String,require:true}},
    username:{type:String,required:true,trim:true,unique:true},
    password:{type:String,required:true},
    email:{type:String,required:true,trim:true,unique:true},
    contact:{type:Schema.Types.ObjectId,ref:'contact'},
    role:{type:Number,default:1,required:true, min:0, max:3}, //is the access level 1=basic 2=admin,
    active:{type:Boolean,required:true,default:false},
    deleted:{type:Boolean,required:true,default:false}

},options.noPassword)

UserSchema.virtual("url").get(function(){ return '/users/' + this._id })
UserSchema.virtual("fullname").get(function(){ return this.name.first + " " + this.name.last })
// Schema method to compare the password
/**
 * @name comparePassword
 * @description Validate the plain password against the Hashed in db.
 * @param {String} _plainPassword 
 * @param {Function} cb 
 * @returns {Function} (error, <Bollean>)
 */
 UserSchema.methods._comparePassword = function (_plainPassword,cb){
    
    return cb( null , Bcrypt.compareSync( _plainPassword , this.password))
}

// Pre save event to hashing the password
UserSchema.pre('save',function(next){
    // if(this.isModified("password")){
    //     hashPassword(this);
    // }
    // this.password = Bcrypt.hashSync(this.password,10)
    next();
})


const User = mongoose.model('User',UserSchema);

module.exports = { User }

module.exports.DEFAULT_USER = {
    username:'admin', 
    email:'admin@admin.com' ,
    password:'admin',
    active:true,
    role:2 
}