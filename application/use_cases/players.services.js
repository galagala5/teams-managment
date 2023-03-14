 var mongoose = require('mongoose');

class PlayersServices {
    /**
     * @name PlayersServices
     * Teams Use case service 
     * Dependencies  {TeamsPersistence, CategoriesPersistence}
     * Inside use case we can perform data validations and manipulations
     */
    constructor({
        PlayersPersistence,
        TeamsPersistence,
        ContactsPersistence,
        PresencesPersistence,
        PaymentsPersistence })
        {
            this.Teams = TeamsPersistence
            this.Players = PlayersPersistence;
            this.Contact = ContactsPersistence;
            this.Presents = PresencesPersistence
            this.Payments = PaymentsPersistence 
        }
    /**
     * @name getPlayers
     * @description Finding all entries in a collection and returning Array of objects
     * @param {Object} req.query Destructures query for pagination
     * @param {Object} req.params Destructures params to get product id
     * @returns {Array[ Object ]}
     */
    async getPlayers ({deleted}){
    try{
        if(deleted){
            // return also deleted
        }
        let results = await this.Players.getAll(true)
        return results
    }catch(error){
        throw Error(error);
    }
    }

    /**
     * @name getPlayerTeams
     * @description Finding all teams that player participate
     * @param {mongoose.Types.ObjectId} id Player id 
     * @returns {Array[ Object ]}
     */
    async getPlayerTeams({id}){
        try{

            let results = await this.Teams.getTeamsByPlayer(id)
            return results[0]?.teams || [];

        }catch(error){
            throw Error(error);
        }
    }



    /**
     * @name getPlayerById
     * @description Finding all entries in a collection and returning Array of objects
     * @param {mongoose.Types.ObjectId} id Team id 
     * @returns {Array[ Object ]}
     */
    async getPlayerById({id}){
        try{
    
            let results = await this.Players.getById(id,true)
            return results;

        }catch(error){
            throw Error(error);
        }
    }
    /**
     * @name createPlayer
     * @param {*} data 
     * @returns 
     */
     async createPlayer(data){
        try{
            
            let {name,contact,birthday} = data
            
            contact.onModel = 'player'
            contact.phones = this.Contact.getPhones(contact.phones)
    

            let _contact = await this.Contact.add({...contact})
            let player = await this.Players.add({
                name,
                birthday,
                contact:_contact[0].id})
            // add player object.id to contacts
            let NewContact = await this.Contact.updateById(_contact[0].id,{person:player[0].id})
            player[0].contact = NewContact[0]
            return player
        }catch(error){

            throw Error(error);
        }
    }
    /**
     * @name updatePlayerById
     * @description Find and update a player by Id
     * @param {mongoose.Types.ObjectId} id Team id 
     * @returns {Array[ Object ]}
     */
    async updatePlayerById({id},data){
        try{
            let {name,birthday,contact,deleted,description} = data
            let results = await this.Players.updateById(id,{name,birthday,description})
            contact.phones = this.Contact.getPhones(contact.phones)
            results.contact = await this.Contact.updateById(contact.id,contact)
            return results;

        }catch(error){
            throw Error(error);
        }
    }

    /**
     * @name deleteByid
     * @description Find and update a player by Id
     * @param {mongoose.Types.ObjectId} id Team id 
     * @returns {Array[ Object ]}
     */
    async deleteByid({id}){
        try{
            let results = await this.Players.delete(id)
            return results;
        }catch(error){
            throw Error(error);
        }
    }

}

module.exports = PlayersServices;