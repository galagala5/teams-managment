const mongoose =require('mongoose')
const moment = require('moment')


const dbConnection = async (dbUri) =>{
        // Initializing DB connection
        return new Promise((resolve,reject)=>{
          mongoose.connect(
            dbUri,
            { useNewUrlParser:true ,
              useUnifiedTopology:true,
              serverSelectionTimeoutMS:5000}
            )

          const db = mongoose.connection

          db.on('error',(error)=>{
            reject('Database connection timeout',error)
          })

          db.once('open',async ()=>{
              resolve( db );
          })
        })
        
}




/**
 * 
 * @param {Object} data Mongoose Schema Object
 * @returns {Object} Mongoose.Schema.toObject()
 */
const formatMongoData = (data) => {
  let newDataList = [];
  if (Array.isArray(data)) {
    if(data.length==1){ 
      return [ data[0].toObject() ]
    }
    for (value of data) {
      newDataList.push(value.toObject());
    }
    return newDataList;
  }else{
    return [ data.toObject() ]
  }

}


/**
 * @private
 * @name manipulateUsersArray
 * @description Manipulates plain object Aggregation returns plain obj
 * @param {Array} users
 * @returns {Array}
 */
 function manipulateUsersArray(users){

  users.forEach(u=>{
      u.createdAt = moment(u.createdAt).utc('+02:00').locale('el').format("dd DD-MM-YYYY HH:mm")
      u.updatedAt= moment(u.updatedAt).utc('+02:00').locale('el').format("dd DD-MM-YYYY HH:mm")
      delete u.__v
      delete u.password
      u.id=u._id
      delete u._id
  })

  return users
}

// Removing empty filelds from an Object
/**
 * Remove keys if value is empty or undefiend
 * Also deletes obj['id'] key
 * @param {Object} obj 
 * @returns 
 */
const removeEmpty =  (obj) => {
  delete obj?.id
  Object.keys(obj).forEach((key) => (!obj[key] && obj[key] !== undefined || obj[key] ==='' ) && delete obj[key]);
  return obj;
};

// module.exports.checkObjectId = (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     logger.error('Mongo id is invalid')
//     return false;
//     throw new Error(constants.databaseMessage.INVALID_ID);
//   }
//   return true;
// }

module.exports.paginatedResults= (model)=> {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results.results = await model.find()
      .limit(limit)
      .skip(startIndex)
      .exec()

      res.paginatedResults = results
      next();
    } catch (e) {
      throw new Error({ message: e.message })
    }
  }
}

/**
 * @name createPagination
 * @description By passing the arguments creates an object to use it for all paginnated results
 * @param {Number} _page 
 * @param {Number} _limit 
 * @param {Number} _docCount 
 * @returns { Object }
 */
const createPagination = (_page=1, _limit=10, _docCount) => {
      const page = parseInt(_page)
      const limit = parseInt(_limit)

      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const docCount = (_docCount);
      const total = Math.round( docCount/limit )
      let results = {  }
      results.startIndex = startIndex
      results.total = total || 1
      results.current = page
      results.limit = limit;
      results.doc = docCount

      if ( endIndex < docCount ) {
        results.next = {
          page: page + 1,
          
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
        }
      }

      return results;
}




// Install momentjs-timezone for time zones
const momentDif = (_then)=>{
  var now  = moment();
  var then = _then || "2022-02-15T09:04:05.872+00:00";

  let diff = now.diff( moment(then), true );

  return {
    month: +moment(diff).format("MM")-1,
    days: +moment(diff).format("DD"),
    hours: +moment(diff).format("HH"),
    minutes: +moment(diff).format("mm"),
    diff : moment(diff).format("MM DD HH:mm"),
    timestamp: moment().format('DD-MM-YYYY HH:mm')
  }

}


module.exports = {
  dbConnection, 
  formatMongoData,
  createPagination,
  removeEmpty,
  momentDif,
  manipulateUsersArray
}