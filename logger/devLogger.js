const {createLogger,format,transports, transport} = require('winston');
const { combine, timestamp,printf, level } = format;

const myFormata = printf( ({level, message, timestamp}) => {
    return `[${level}] ${timestamp} ${message} }`
});
const timezoned = () => {
    return new Date().toLocaleTimeString('en-US', {
        timeZone: 'Europe/Athens'
    });
}

const devLogger = ()=>{
    return createLogger({
        level:'debug',
        format: combine(
            format.colorize(),
            timestamp({format:timezoned}),
            myFormata
        ),
        transports:[
            new transports.Console()
        ]
    })
}


module.exports = devLogger;