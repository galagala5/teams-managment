const { Types } = require('mongoose')
const { Coach } = require('../../models')
const { formatMongoData, removeEmpty } = require('../../mongodb')
const { BasicRepository } = require('../../application/contracts')

class CoachPersistence extends BasicRepository {

    constructor() {
        super();
        this.Schema = Coach;
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
                .populate('teams')
                .populate('contact')
                .exec()
        }
        if (!result) throw new Error('No entry!')
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
                .populate('teams')
                .populate('contact')
                .exec()
        } else {
            result = await this.Schema.findOne({ _id: Id, deleted: { $ne: true } })
                .populate('teams')
                .populate('contact')
                .exec()
        }
        if (!result) throw new Error('No entry for this id!')
        return formatMongoData(result)
    }

    /**
     * Team information base on schema to create new entry
     * @param {Object} data 
     * @returns 
     */
    async add(data) {
        // we can validate if coach name is exists
        data = removeEmpty(data)
        let doc = new this.Schema({ ...data })
        let results = await doc.save()
        return formatMongoData(results);
    }

    async updateById(Id, data) {
        data = removeEmpty(data)
        console.log(data)
        let results = await this.Schema.findByIdAndUpdate(Id, data, { new: true })
        if (!results) throw new Error('No entry!')
        return formatMongoData(results);
    }

    /**
     * Soft delete player
     * @param {string} id 
     * @returns {Array<Object>} 
     */
    async delete(Id) {
        let doc = await this.Schema
            .findByIdAndUpdate(Id, { deleted: true }, { new: true })
        if (!doc) { throw new Error('Coach could not be deleted') }
        return formatMongoData(doc)
    }



}



module.exports = CoachPersistence