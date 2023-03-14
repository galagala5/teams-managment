/**
 * All functions for mongoose Model peristance
 */
module.exports = {
    TeamsPersistence:require('./teams.persistence'),
    CategoriesPersistence:require('./categories.persistence'),
    CoachesPersistence:require('./coaches.persistence'),
    ContactsPersistence:require('./contacts.persistence'),
    PlayersPersistence:require('./players.persistence'),
    PaymentsPersistence:require('./payments.persistence'),
    PresencesPersistence:require('./presences.persistence'),
    UsersPersistence:require('./users.persistence')
}