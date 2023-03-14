const ejs = require('ejs')
const path = require('path')

/**
 * @description Rendering some data with ejs template 
 * @param {String} _path EJS template path relative on views folder 
 * @param {Object} data Data to be rendered with template
 * @returns {HTML}
 */
const renderEjsTemplate = async (_path, data) => {
    return new Promise((resolve, reject) => {
        let pathFile = path.resolve(__dirname, '../../views', _path)
        ejs.renderFile(pathFile, data, function (err, renderFile) {
            if (err) { 
                console.log('EJS renderer error:',err)
                reject(err); }
            resolve(renderFile);
        })
    })
}


module.exports = renderEjsTemplate;