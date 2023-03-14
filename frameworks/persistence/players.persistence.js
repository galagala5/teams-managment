const { Types } = require('mongoose');
const { Player } = require('../../models')
const { formatMongoData, removeEmpty } = require('../../mongodb')


class PlayersPersistence {

    constructor() {
        this.Schema = Player;
    }
    /**
     * @description Returns an array of object with|without populated fields
     * @param {Boolean} _populate If true populates all references fields
     * @returns { Array[Object] }
     */
    async getAll(_populate = false) {
        let result = []
        if (!_populate) {
            result = await this.Schema.find({ deleted: { $ne: true } })
        } else {
            result = await this.Schema.find({ deleted: { $ne: true } })
                .populate('payments')
                .populate('contact')
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
    async getById(Id, _populate = false) {
        let result = []
        if (!_populate) {
            result = await this.Schema.findOne({ _id: Id, deleted: { $ne: true } })
        } else {
            result = await this.Schema.findOne({ _id: Id, deleted: { $ne: true } })
                .populate('payments')
                .populate('contact')
                .exec()
        }
        if(!result) throw new Error('No entry!')
        return formatMongoData(result)
    }


    /**
     * Inserting new player
     * @param {Object} data 
     * @returns {Array<Object>} 
     */
    async add(data) {
        data = removeEmpty(data)
        let doc = new this.Schema({ ...data })
        let results = await doc.save()
        return formatMongoData(results);
    }

    async updateById(Id,data){
        data = removeEmpty(data)
        let doc = await this.Schema.findByIdAndUpdate(
            Id,
            {...data},
            {new:true}
        )
        return formatMongoData(doc)
    }

    /**
     * Soft delete player
     * @param {string} id 
     * @returns {Array<Object>} 
     */
     async delete(Id){
        let doc =  await this.Schema
            .findByIdAndUpdate(Id,{deleted:true},{new:true})
        if(!doc){throw new Error('Player could not be deleted')}
        return formatMongoData(doc)
    }


}



module.exports = PlayersPersistence