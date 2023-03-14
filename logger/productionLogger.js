const {createLogger,format,transports, transport} = require('winston');
const { combine, timestamp,printf} = format;

const myFormata = printf( ({level, message, timestamp}) => {
    return `{ level:${level}, timestamp:${timestamp}, message:${message} }`
});

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Athens'
    });
}
const productionLogger = ()=>{
    return createLogger({
        level:'info',
        format: combine(
            timestamp({format:timezoned}),
            myFormata
        ),
        transports:[
            new transports.File({filename:'error.log',level:'error',format:format.combine(format.json())}),
            new transports.File({filename:'app.log',format:format.combine(format.json())})
            
        ]
    })
}


module.exports = productionLogger;