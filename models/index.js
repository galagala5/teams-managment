const {Teams,Player,Coach,Presences,Categories} = require('./Team')
const Payments = require('./Payments')
const Contacts = require('./Contacts')
const {User,DEFAULT_USER} = require('./Users')
const SchemaOptions = require('./options')

module.exports = {
    Teams,
    Player, 
    Coach, 
    Presences,
    Categories,
    User,
    DEFAULT_USER,
    SchemaOptions,
    Payments,
    Contacts
}