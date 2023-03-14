const {version} = require('./../package.json')
module.exports = {
      version,
      APP_TITLE:process.env.APP_TITLE || 'My App',
      PORT:process.env.SERVER_PORT || 5000,
      JWT_SECRETE:process.env.SECRET_KEY || '',
      JWT_EXPIRES:process.env.TOKEN_EXIP || "24H",
      DEFAULT_USER_PASSWORD : process.env.DEFAULT_USER_PASSWORD || 'Welcome2022',
      NODE_ENV:process.env.NODE_ENV || "DEV",
      DB_URI:process.env.DB_URI || ""

}




module.exports.middlewares = 'middlewares'