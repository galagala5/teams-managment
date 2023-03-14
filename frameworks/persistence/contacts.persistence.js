const {Types} = require('mongoose')
const {Contacts} = require('../../models')
const {formatMongoData,removeEmpty} = require('../../mongodb')
const {BasicRepository} =require('../../application/contracts/')

class ContactsPersistence extends BasicRepository{

    constructor(){
        super();
        this.Schema = Contacts;
    }

        /**
         * @description Returns an array of object with|without populated fields
         * @param {Boolean} _populate If true populates all references fields
         * @returns { Array[Object] }
         */
         async getAll(_populate=false){
            let result = []
            if(!_populate){
                result = await this.Schema.find({})
            }else{
                result = await this.Schema.find({})
                .populate('teams')
                .exec()
            }
            if(!result) throw new Error('No entry!')
            return formatMongoData(result)
        }

        /**
         * 
         * @param {Types.ObjectId} Id 
         * @param {Boolean} _populate 
         * @returns 
         */    
        async getById(Id,_populate=false){
            let result = []
            if(!_populate){
                result = await this.Schema.findById(Id)
            }else{
                result = await Teams.findById(Id)
                .populate('category')
                .populate('players')
                .exec()
            }
            if(!result) throw new Error('No entry!')
            return formatMongoData(result)
        }
    
        /**
         * Team information base on schema to create new entry
         * @param {Object} data 
         * @returns {Array<Object>}
         */
        async add(data){
            // we can validate if coach name is exists
            data = removeEmpty(data)

            let doc = new this.Schema({...data})
            let results = await doc.save()
            return formatMongoData(results);
        }

        async updateById(Id,data){
            data = removeEmpty(data)
            delete data?.id
            if(data.phones && typeof data.phones === 'object' ){
                data.phones = this.getPhones(data.phones)
            }
            let doc = await this.Schema.findByIdAndUpdate(Id,{...data},{new:true})
            if(!doc) throw new Error('No entry!')
            return formatMongoData(doc);
        }


        getPhones(phones){
            let _p = []
            for(let value of Object.values(phones)){
                _p.push(value)
            }
            return _p
        }

}



module.exports = ContactsPersistence