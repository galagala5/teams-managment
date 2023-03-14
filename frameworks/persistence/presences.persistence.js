const {Types} = require('mongoose')
const {Presences} = require('../../models')
const {formatMongoData,removeEmpty} = require('../../mongodb')
const {BasicRepository} = require('../../application/contracts')


class PresencesPersistence extends BasicRepository{

    constructor(){
        super();
        this.Schema = Presences;
    }

    async add(data){
        data = removeEmpty(data)

        let doc = new this.Schema({...data})

        let results = await doc.save()
        return formatMongoData(results);

    }

    async findByTeam(teamsId,_populate){
        let result = []
        if(!_populate){
            result = await this.Schema.find({teams:teamsId})
        }else{
            result = await this.Schema.find({teams:teamsId})
            .populate('teams')
            .populate('coache')
            .populate('players')
            .exec()
        }
        if(!result) throw new Error('No entry!')
        return formatMongoData(result)
    }

    async findByDate(start,end,_populate){
        let result = []
        if(!_populate){
            result = await this.Schema.find({
                createdAt:{
                    $gte:new Date(start),
                    $lte:new Date(end)}
                })
        }else{
            result = await this.Schema.find({
                createdAt:{
                    $gte:new Date(start),
                    $lte:new Date(end)}
                })
            .populate('teams')
            .populate('coache')
            .populate('players')
            .exec()
        }
        if(!result) throw new Error('No entry!')
        return formatMongoData(result)
    }

    async deleteById(Id){
        let doc = await this.Schema.findByIdAndDelete(Id)
        return formatMongoData(doc)
    }

    async softDeleteById(Id){
        let doc = await this.Schema.findByIdAndUpdate(Id,{deleted:true},{new:true})
        return formatMongoData(doc)
    }
}

module.exports = PresencesPersistence