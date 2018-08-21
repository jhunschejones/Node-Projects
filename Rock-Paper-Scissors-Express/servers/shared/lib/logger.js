const winston = require('winston');

// note, recieving errors using winston 3.0.0, reverted to 2.4.2

const logger = new (winston.Logger)({
    transports: [new (winston.transports.Console)({
        timestamp: new Date().toISOString(),
        colorize: true,
    })],
});

module.exports = logger;