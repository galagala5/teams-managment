const moment = require('moment')
module.exports = {

    first:{
        timestamps:true,
        virtuals:true,
        toObject:{
            virtuals:true,
            transform: function(doc, ret, option) {
                ret.birthday = moment(ret.birthday).utcOffset('+02:00').locale('el').format("dd DD-MM-YYYY HH:mm")
                ret.createdAt = moment(ret.createdAt).utcOffset('+02:00').locale('el').format("dd DD-MM-YYYY HH:mm")
                ret.updatedAt= moment(ret.updatedAt).utcOffset('+02:00').locale('el').format("dd DD-MM-YYYY HH:mm")
                ret.id=ret._id
                delete ret._id
                delete ret.__v
                return ret
            }
        }
    
    },
    second:{
        timestamps:true,
        virtuals:true,
        toObject:{
            virtuals:true,
            transform: function(doc, ret, option) {
                ret.createdAt = moment(ret.createdAt).utcOffset('+02:00').locale('el').format("dd DD-MM-YYYY HH:mm")
                ret.updatedAt= moment(ret.updatedAt).utcOffset('+02:00').locale('el').format("dd DD-MM-YYYY HH:mm")
                ret.id=ret._id
                delete ret._id
                delete ret.password
                delete ret.__v
                return ret
            }
        }
    
    },
    noPassword:{
        timestamps:true,
        virtuals:true,
        toObject:{
            virtuals:true,
            transform: function(doc, ret, option) {
                ret.createdAt = moment(ret.createdAt).utcOffset('+02:00').locale('el').format("dd DD-MM-YYYY HH:mm")
                ret.updatedAt= moment(ret.updatedAt).utcOffset('+02:00').locale('el').format("dd DD-MM-YYYY HH:mm")
                ret.id=ret._id
                delete ret._id
                delete ret.password
                delete ret.repassword
                delete ret.__v
                return ret
            }
        }
    
    }

}