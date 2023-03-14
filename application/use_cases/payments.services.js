class PaymentsServices {
    /**
     * @name PaymentsServices
     * Teams Use case service 
     * Dependencies  {TeamsPersistence, CategoriesPersistence}
     * Inside use case we can perform data validations and manipulations
     */
    constructor({
        PlayersPersistence,
        CoachesPersistence,
        PaymentsPersistence })
        {
            this.Players = PlayersPersistence;
            this.Coach = CoachesPersistence
            this.Payments = PaymentsPersistence 
        }

        addToPlayer(){}
        addToCoach(){}
        updateById(){}
        

    }

    module.exports = PaymentsServices