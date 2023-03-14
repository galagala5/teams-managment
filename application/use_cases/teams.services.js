var mongoose = require('mongoose');

class TeamsServices {
    /**
     * @name TeamsServices
     * Teams Use case service 
     * Dependencies  {TeamsPersistence, CategoriesPersistence}
     * Inside use case we can perform data validations and manipulations
     */
    constructor({
        TeamsPersistence,
        PlayersPersistence,
        CategoriesPersistence }) {
        this.Teams = TeamsPersistence
        this.Categories = CategoriesPersistence;
        this.Players = PlayersPersistence
    }

    /**
     * @name getTeams
     * @description Finding all entries in a collection and returning Array of objects
     * @param {mongoose.Types.ObjectId} id Team id 
     * @returns {Array[ Object ]}
     */
    async getTeams({ id }) {
        try {
            if (id) {
                let results = await this.Teams.getById(id, true)
                results[0].playersId = results[0].players.map(p => p.id)
                return results;
            }
            let results = await this.Teams.getAll(true)
            return results
        } catch (error) {
            throw Error(error);
        }
    }


    /**
     * @name getTeamPlayers
     * @description Finding all entries in a collection and returning Array of objects
     * @param {mongoose.Types.ObjectId} id Team id 
     * @returns {Array[ Object ]}
     */
        async getTeamPlayers({ id }) {
            try {
                let results = await this.Teams.getById(id, true)
                return { players:results[0].players };
            } catch (error) {
                throw Error(error);
            }
        }


    /**
     * @name getCategories
     * @description Finding all entries in a collection and returning Array of objects
     * @param {mongoose.Types.ObjectId} id Category id 
     * @returns {Array[ Object ]}
     */
    async getCategories({ id }) {
        try {
            if (id) {
                return await this.Categories.getById(id)
            }
            return await this.Categories.getAll({})

        } catch (error) {
            throw Error(error);
        }
    }

    /**
     * @name addCategories
     * @description Creating new category base on moongoose schema model 
     * @param {Object} data 
     * @returns {Array[ Object ]}
     */
    async addCategories(data) {
        try {

            // check if category allready exist
            return await this.Categories.add(data)

        } catch (error) {
            throw Error(error);
        }
    }

    /**
     * @name addTeam
     * @description Finding all entries in a collection and returning Array of objects
     * @param {Object} data 
     * @returns {Array[ Object ]}
     */
    async addTeam(data) {
        try {
            return await this.Teams.add(data)

        } catch (error) {
            throw Error(error);
        }
    }


    /**
     * @name addPlayersToTean
     * @description Finding all entries in a collection and returning Array of objects
     * @param {Object} data 
     * @returns {Array[ Object ]}
     */
    async addPlayersToTean({ id }, data) {
        try {

            return await this.Teams.addPlayersListById(id, data)
        } catch (error) {
            throw Error(error);
        }
    }

        /**
     * @name addPlayersToTean
     * @description Finding all entries in a collection and returning Array of objects
     * @param {Object} data 
     * @returns {Array[ Object ]}
     */
    async addCoachToTeams({ id }, data) {
        try {

            return await this.Teams.addPlayersListById(id, data)
        } catch (error) {
            throw Error(error);
        }
    }




}


module.exports = TeamsServices
