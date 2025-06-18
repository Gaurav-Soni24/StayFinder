const serverless = require('serverless-http');
const app = require('../server'); // path to your modified server.js

module.exports.handler = serverless(app);
