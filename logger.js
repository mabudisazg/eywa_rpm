const {createLogger, format, transports, config, transport, info} = require('winston');

const logger = createLogger({
    
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.Console(),
        new transports.File({filename:'application.log'})
    ]
});

module.exports = logger;
