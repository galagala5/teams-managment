const {Types} = require('mongoose')
const {Payments} = require('../../models')
const {formatMongoData,removeEmpty} = require('../../mongodb')

class PaymentsPersistence{


    constructor(){
        this.Schema = Payments;
    }

    /**
     * Returns an array of object with|without populated fields
     * @param {Boolean} _populate If true populates all references fields
     * @returns { Array[Object] }
     */
    async getAll(_populate=false){
        let result = []
        if(!_populate){
            result = await this.Schema.find({})
        }else{
            result = await this.Schema.find({})
            .populate('person')
            // .exec()
        }
        return formatMongoData(result)
    }

    async add(data){
        data = removeEmpty(data)
        let doc = new this.Schema({...data});
        doc= await doc.save()
        return formatMongoData(doc);
    }

    async deleteById(Id){
        let doc = await this.Schema.findByIdAndDelete(Id)
        return formatMongoData(doc)
    }
}



module.exports = PaymentsPersistence