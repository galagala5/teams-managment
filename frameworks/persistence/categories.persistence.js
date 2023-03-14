const {Types} = require('mongoose')
const {Categories} = require('../../models')
const {formatMongoData,removeEmpty} = require('../../mongodb')
class CategoriesPersistence{

    constructor(){
        this.Schema = Categories;
    }

        /**
         * @description Returns an array of object with|without populated fields
         * @returns { Array[Object] }
         */
         async getAll(){
            let result =  await this.Schema.find({})
            if(!result) throw new Error('No entry!')
            return formatMongoData(result)
        }

        /**
         * 
         * @param {Types.ObjectId} Id 
         * @param {Boolean} _populate 
         * @returns 
         */    
        async getById(Id){
            let result = await this.Schema.findById(Id)
            if(!result) throw new Error('No entry!')
            return formatMongoData(result)
        }
    
        /**
         * Team information base on schema to create new entry
         * @param {Object} data 
         * @returns 
         */
        async add(data){
            // we can validate if coach name is exists
            data = removeEmpty(data)
            let doc = new this.Schema({...data})
            let results = await doc.save()
            return formatMongoData(results);
        }

}



module.exports = CategoriesPersistence