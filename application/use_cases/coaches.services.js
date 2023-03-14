var mongoose = require('mongoose');

class CoachesServices {
    constructor({
        CoachesPersistence,
        ContactPersistence }) {
        this.Coaches = CoachesPersistence
        this.Contacts = ContactPersistence;
    }

    /**
     * @name getCoaches
     * @description Finding all entries in a collection and returning Array of objects
     * @param {mongoose.Types.ObjectId} id Coach id 
     * @returns {Array[ Object ]}
     */
    getCoaches = async function ({ id }) {
        try {
            if (id) {
                return await this.Coaches.getById(id, true);
            }
            return await this.Coaches.getAll(true);

        } catch (error) {
            throw Error(error);
        }
    }


    /**
* @name updateCoach
* @description Finding all entries in a collection and returning Array of objects
* @param {mongoose.Types.ObjectId} id Coach id 
* @returns {Array[ Object ]}
*/
    async updateCoach({ id }, data) {

        try {

            let { name, contact, description, teams } = data
            let _teams = teams.split(',')

            let teamsArray = _teams.map(
                t => mongoose.Types.ObjectId.createFromHexString(t)
            )

            let _contact = await this.Contacts.updateById(contact.id, { ...contact }, { new: true })
            let results = await this.Coaches.updateById(id, {
                name,
                description,
                teams: teamsArray
            },
                { new: true })
            console.log(results)
            return results;
        } catch (error) {
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
    async addCoach(data) {
        try {

            let { name, contact, description } = data

            contact.onModel = 'coach'
            contact.phones = this.Contacts.getPhones(contact.phones)

            let _contact = await this.Contacts.add({ ...contact })
            let coach = await this.Coaches.add({
                name,
                description,
                contact: _contact[0].id
            })
            coach[0].contact = _contact[0]
            return coach;

        } catch (error) {
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
                let results = await this.Coaches.delete(id)
                return results;
            }catch(error){
                throw Error(error);
            }
        }

}

module.exports = CoachesServices