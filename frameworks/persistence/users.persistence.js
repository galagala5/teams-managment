const { BasicRepository } = require('../../application/contracts')
const {User,DEFAULT_USER,SchemaOptions} = require('../../models')
const {formatMongoData,removeEmpty} = require('../../mongodb')

class UsersPersistence extends BasicRepository{
    constructor(){
        super(); 
        this.Schema = User
        this.mongooseSchema = this.Schema.schema
        this.DEFAULT_USER = DEFAULT_USER

        this.defaultUser()
    }

    async getAll(){
        
        let doc =  await this.Schema.find({})
        
        if(!doc){ throw new Error('No users found') }
        return formatMongoData(doc)
    }
    async getActive(){
        
        let doc =  await this.Schema.find({deleted:{$ne:true}})
        
        if(!doc){ throw new Error('No users found') }
        return formatMongoData(doc)
    }

    async getById(Id){
        let doc =  await this.Schema.findOne({
            _id:Id,
            // deleted:{$ne:true}
        })
        if(doc && doc.deleted) throw new Error('User has been deleted')
        if(!doc){throw new Error('User not found')}
        return formatMongoData(doc)
    }

    async getByEmail(email){
        let doc =  await this.Schema.findOne({email})
        if(!doc){throw new Error('User not found')}
        return formatMongoData(doc)
    }
    /**
     * We can pass flag password to return password from schema
     * @param {String} username 
     * @param {Boolean} password 
     * @returns {Array<Object>}
     */
    async getByUsername (username,password=false){
        if(password){ this.schemaOptionsWithPassword()}
        let doc =  await this.Schema.findOne({username})
        if(!doc){throw new Error('User not found')}
        return formatMongoData(doc)
    }

    async add(data){
        // we can validate if team name is exists
        data = removeEmpty(data)
        let user = this.Schema.findOne({email:data.email})
        if(user){ throw new Error('Email allready exist use something else!')}
        let doc = new this.Schema({...data})
        let results = await doc.save()
        return formatMongoData(results);
    }
    /**
     * If not deleted user
     * @param {*} Id 
     * @param {Objetc} data 
     * @returns {Object}
     */
    async updateById(Id,_data){
        let data = removeEmpty(_data);
        let doc =  await this.Schema
            .findOneAndUpdate({_id:Id,deleted:{$ne:true}},{...data},{new : true})
        if(!doc){throw new Error('User not found')}
        return formatMongoData(doc)
    }

      /**
     * If not deleted user
     * @param {*} Id 
     * @param {Objetc} data 
     * @returns {Object}
     */
       async activate(Id){
        let doc =  await this.Schema
            .findByIdAndUpdate(
                {_id:Id},
                {deleted:false,active:true},
                {new : true}
            )
        if(!doc){throw new Error('User not found')}
        return formatMongoData(doc)
    }

    async delete(Id){
        let doc =  await this.Schema
            .findByIdAndUpdate(Id,{deleted:true,active:false},{new:true})
        if(!doc){throw new Error('User couldnot be deleted')}
        return formatMongoData(doc)
    }

    async passwordUpdateById(Id,hashedPassword){
        let doc =  await this.Schema
            .findByIdAndUpdate(Id,{password:hashedPassword},{new:true})
        if(!doc){throw new Error('User password not updated')}
        return formatMongoData(doc)
    }


    /**
     * @private
     * Change mongoose schema options on the fly 
     * @name mongooseSchemaOptions
     * @returns 
     */
    schemaOptionsWithPassword(){
        // we change on the fly mongoose schema options
        this.mongooseSchema.options = SchemaOptions.first
        return;
    }

    // comparePassword(password){
    //     let Schema = this.Schema;
    //     return new Promise((resolve,reject)=>{
    //         Schema._comparePassword(password,(err,isValid)=>{
    //             if(!isValid){ reject( new Error('Invalid password') ) }
    //             resolve(true)
    //             setTimeout(()=>{reject(new Error('Compare password timeout'))},500)
    //         })
    //     })
    // }

    // Create a default user
    async defaultUser(){
        try {
            let user = await this.Schema.findOne(
                {$or:[
                {username:this.DEFAULT_USER.username},
                {email:this.DEFAULT_USER.email},
                {role:{$gte:2}},
                ]}
                ).exec()
            if(user){ return }
            const newUser = new this.Schema({...this.DEFAULT_USER})
            await newUser.save();
        } catch (error) {
            throw Error(error.message)
        }   
    }
}


module.exports = UsersPersistence