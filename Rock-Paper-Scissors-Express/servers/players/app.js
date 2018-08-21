const express = require('express');
const requestLogger = require('../shared/lib/requestLogger');
// 'remember to invoke it' is what we are doing with the '()' syntax after the require statement
const expressRequestId = require('express-request-id')();

const app = express();

app.set('x-powered-by', false);

app.use(express.json());

app.use(expressRequestId);
app.use(requestLogger);

app.use(require('./router'));

module.exports = app;
