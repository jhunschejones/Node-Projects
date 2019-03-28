'use strict'

module.exports = {
    name: "Restify-To-Do",
    version: "1.0",
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    db: {
        uri: /*MongoDB connect string*/
    }
}