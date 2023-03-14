const productionLogger = require('./productionLogger')
const devLogger = require('./devLogger')
const CONFIG = require('../config/config')

let logger = null;

if (CONFIG.NODE_ENV === 'PROD') {
    logger = productionLogger()
}

if (CONFIG.NODE_ENV === 'DEV') {
    logger = devLogger();
}

module.exports = logger;