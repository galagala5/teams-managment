const {Player,Contacts,getPhones, Teams} = require('../../models')
const {formatMongoData,removeEmpty} = require('../../mongodb')
const logger = require('../../logger')
const moment = require('moment')




/**
 * @name getPlayers
 * @description Finding all entries in a collection and returning Array of objects
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const getPlayers = async function({id}){
    try{
        if(id){
            let results = await Player.findById(id)
                .populate('contact')
                // .populate('payments')
                .exec()
            return formatMongoData(results);
        }
        let results = await Player.find({}).populate('contact')
        results = formatMongoData(results);
        return results
    }catch(error){
        logger.error('Something went wrong: Teams Services: Getting teams', JSON.stringify( error.message) )
        throw Error(error);
    }
}
/**
 * @name getPlayers
 * @description Finding all entries in a collection and returning Array of objects
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const getPlayersByTeamId = async function(id){
     try{
         if(id){
             let result = await Teams.findById(id)
             .populate('players')
             .exec()
             
             let { players } =  formatMongoData(result)[0]
            return players;
        }
        let results = await Player.find({}).populate('contact')
        results = formatMongoData(results);
        return results
    }catch(error){
        logger.error('Something went wrong: Teams Services: Getting teams', JSON.stringify( error.message) )
        throw Error(error);
    }
}
/**
 * @name createPlayer
 * @description Finding all entries in a collection and returning Array of objects
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const createPlayer = async function(data){
    try{

        let {name,contact,birthday} = data
        
        contact.onModel = 'player'
        contact.phones = getPhones(contact.phones)

        let _contact = new Contacts({...contact})
        let player = new Player({name,birthday})

        // add player object.id to contacts
        _contact.person = player._id;
        player.contact = _contact._id;

        await _contact.save()
        let results = await player.save()        
        return formatMongoData(results);
    }catch(error){
        logger.error('Something went wrong: Players Services: Adding new player', JSON.stringify( error.message) )
        throw Error(error);
    }
}


module.exports = {
    getPlayers,
    getPlayersByTeamId,

    createPlayer,
}