var mongoose = require('mongoose');

class ContactsServices{
    constructor({
        ContactsPersistence
    }){
        this.Schema = ContactsPersistence;
    }
    /**
     * @name addContact
     * @description Adding a contact to Player|Coach|User
     * @param {Object} data Contact data by model
     * @returns {Array[ Object ]}
     */
    async addContact(data){

        try{
            // some validation
            return await this.Schema.add(data)
            
        }catch(error){
            throw Error(error);
        }

    }
    /**
     * @name getContactByPerson
     * @description Adding a contact to Player|Coach|User
     * @param {mongoose.Types.ObjectId} id Contact data by model
     * @returns {Array[ Object ]}
     */
    async getContacts(){
        try{
            let results = await this.Schema.getAll(true)
            return results
        }catch(error){
            throw Error(error);
        }
    }
    /**
     * @name getContactByPerson
     * @description Adding a contact to Player|Coach|User
     * @param {mongoose.Types.ObjectId} id Contact data by model
     * @returns {Array[ Object ]}
     */
    async getContactByPerson(Id){
        try{
            if(Id){
                let results = await this.Schema.getById(Id,true)
                return results;
            }
            let results = await this.Schema.getAll(true)
            return results
        }catch(error){
            throw Error(error);
        }
    }
    
    async deleteContact(){

    }

}


module.exports = ContactsServices