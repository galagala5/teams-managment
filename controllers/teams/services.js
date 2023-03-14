const {Categories, Teams, Coach,Contacts,getPhones} = require('../../models')
const {formatMongoData,removeEmpty} = require('../../mongodb')
const logger = require('../../logger')
var mongoose = require('mongoose');


/**
 * @name getTeams
 * @description Finding all entries in a collection and returning Array of objects
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const getTeams = async function({id}){
    // try{
    //     if(id){
    //         // let results = await Interfaces.Teams.findById(id,true)
    //             // results[0].playersId = results[0].players.map(p=>p.id)
    //         // return results;
    //     }
    //     // let results = await Interfaces.Teams.findAll(true)
    //     return results
    // }catch(error){
    //     logger.error('Something went wrong: Teams Services: Getting teams', JSON.stringify( error.message) )
    //     throw Error(error);
    // }
}

/**
 * @name getCoaches
 * @description Finding all entries in a collection and returning Array of objects
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
const getCoaches = async function({id}){
    try{
        if(id){
            let results = await Coach.findById(id).populate('contact')
             return formatMongoData(results);
        }
        let results = await Coach.find({}).populate('contact')
        return formatMongoData(results);
        
    }catch(error){
        logger.error('Something went wrong: Teams Services: Getting coaches', JSON.stringify( error.message) )
        throw Error(error);
    }
}

/**
 * @name getCategories
 * @description Finding all entries in a collection and returning Array of objects
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
const getCategories = async function({id}){
    try{
        if(id){
            let results = await Categories.findById(id)
            return formatMongoData(results);    
        }
        let results = await Categories.find({})
        return formatMongoData(results);
        
    }catch(error){
        logger.error('Something went wrong: Teams Services: Getting categories', JSON.stringify( error.message) )
        throw Error(error);
    }
}


/**
 * @name addCategories
 * @description Finding all entries in a collection and returning Array of objects
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const addCategories = async function(data){
    try{
        // check if category allready exist
        let category = new Categories({...data})
        let results = await category.save()
        return formatMongoData(results);
        
    }catch(error){
        logger.error('Something went wrong: Teams Services: Getting categories', JSON.stringify( error.message) )
        throw Error(error);
    }
}


/**
 * @name addTeam
 * @description Finding all entries in a collection and returning Array of objects
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const addTeam = async function(data){
    try{
        
        return await Interfaces.Teams.createNewTeam(data)
       
    }catch(error){
        logger.error('Something went wrong: Teams Services: Creating new team', JSON.stringify( error.message) )
        throw Error(error);
    }
}

/**
 * @name addCoach
 * @description Addind and validating new coach
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const addCoach = async function(data){
    try{
        
        let {name,contact,description} = data
        
        contact.onModel = 'coach'
        contact.phones = getPhones(contact.phones)

        let _contact = new Contacts({...contact})
        let coach = new Coach({name,description})

        // add coach object.id to contacts
        _contact.person = coach._id;
        coach.contact = _contact._id;

        await _contact.save()
        let results = await coach.save()        
        return formatMongoData(results);
        
    }catch(error){
        logger.error('Something went wrong: Teams Services: Creating new coach', JSON.stringify( error.message) )
        throw Error(error);
    }
}

/**
 * @name addPlayer
 * @description Addind and validating new coach
 * @param {Object} req.params Destructures params to get product id
 * @param {Array} req.body.player Array of objectids 
 * @returns {Array[ Object ]}
 */
 const addPlayer = async function(teamId,players){
    try{
        
        let isValid = true //mongoose.Types.ObjectId.isValid(players) && mongoose.Types.ObjectId.isValid(teamId) 
        if(!isValid) { throw new Error('Player Id is not valid')}
        let results = await Teams.findByIdAndUpdate(teamId,{players:players},{new:true})
 
        return formatMongoData(results);
        
    }catch(error){
        logger.error('Something went wrong: Teams Services: Adding new player', JSON.stringify( error.message) )
        throw Error(error);
    }
}
/**
 * @name addPlayer
 * @description Addind and validating new coach
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const addPresences = async function(teamId,playerId){
    try{
        
        let isValid = mongoose.Types.ObjectId.isValid(playerId)
        if(!isValid) { throw new Error('Player Id is not valid')}

        let results = await Teams.findByIdAndUpdate(teamId,{$push:{players:playerId}},{new:true})
 
        return formatMongoData(results);
        
    }catch(error){
        logger.error('Something went wrong: Teams Services: Adding new player', JSON.stringify( error.message) )
        throw Error(error);
    }
}
/**
 * @name updateCoach
 * @description Updating and validating a coach
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const updateCoach = async function({id},data){
    try{
        
        let {name,contact,description,teams} = data
        contact.phones = getPhones(contact.phones)
        
        let _teams = teams.split(',')
        let Newteams=[]
        
        for(let t of _teams){
            t = mongoose.Types.ObjectId.createFromHexString(t)
            Newteams.push( t )
            // Pushing coach id to each team
            // await Teams.findByIdAndUpdate(t,{$push:{ coach:id }})
        }
        
        let _contact = Contacts.findOneAndUpdate({person:id},{...contact},{new:true})
        let results = Coach.findByIdAndUpdate(id,{name,description,teams:Newteams},{new:true})

        return results;
        
    }catch(error){
        logger.error('Something went wrong: Teams Services: Update a coach', JSON.stringify( error.message) )
        throw Error(error);
    }
}


/**
 * @name removeCoach
 * @description Removing a coach by id
 * @param {Object} req.query Destructures query for pagination
 * @param {Object} req.params Destructures params to get product id
 * @returns {Array[ Object ]}
 */
 const removeCoach = async function({id}){
    try{

        let results = await Coach.deleteOne({_id:id})
        return formatMongoData(results);
        
    }catch(error){
        logger.error('Something went wrong: Teams Services: Removing a coach', JSON.stringify( error.message) )
        throw Error(error);
    }
}


module.exports = {
    getTeams,
    getCoaches,
    getCategories,

    addCategories,
    addTeam,
    addCoach,
    addPlayer,
    addPresences,

    updateCoach,

    removeCoach

}