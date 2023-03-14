const {Types} = require('mongoose')
const {Teams} = require('../../models')
const {formatMongoData,removeEmpty} = require('../../mongodb')
const {BasicRepository} = require('../../application/contracts')


class TeamsPersistence extends BasicRepository{

    constructor(){
        super();
        this.Schema = Teams;
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
            .populate('category')
            .populate('players')
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
            result = await this.Schema.findById(Id)
            .populate('category')
            .populate('players')
            .exec()
        }
        if(!result) throw new Error('No entry!')
        return formatMongoData(result)
    }

    /**
     * Adding new team
     * @param {Object} data 
     * @returns {Array<Object}
     */
    async add(data){
        // we can validate if team name is exists
        data = removeEmpty(data)
        let team = new this.Schema({...data})
        let results = await team.save()
        return formatMongoData(results);
    }

    /**
     * Aggregate and groups in which teams participates the player 
     * @param {String} playerId 
     * @returns {Array<Object>}
     */
    async getTeamsByPlayer(playerId){
        let doc =  await this.Schema.aggregate([
            {$unwind:{path:"$players"}},
            {$match: { $expr : { $eq: [ '$players' , { $toObjectId: playerId } ] } } },
            {$group:{_id:"$players",teams:{$push:{_id:{$toString:"$_id"},name:"$name"}},total:{$sum:1}}},
            {$project:{"teams":1,"_id":0}}
        ])
        if(!doc) throw new Error('No entry!')
        return doc;
    }

    async addPlayersListById(Id,playerList){
        let doc = await this.Schema.findByIdAndUpdate(Id,{players:playerList})
        return formatMongoData(doc);
    }

}


module.exports = TeamsPersistence