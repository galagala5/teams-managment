var mongoose = require('mongoose');

class PresencesServices {
    /**
     * @name PresencesServices
     * Teams Use case service 
     * Dependencies  {TeamsPersistence, CategoriesPersistence}
     * Inside use case we can perform data validations and manipulations
     */
    constructor({
        PresencesPersistence })
        {
            this.Schema = PresencesPersistence
        }

    async addPresence(data){
        try {
            console.log(data)
            // validate schema
            // manipulate player array
            let results = await this.Schema.add({...data})
            return results;
        } catch (error) {
            
            throw Error(error.message);
        }

    }

}

module.exports = PresencesServices