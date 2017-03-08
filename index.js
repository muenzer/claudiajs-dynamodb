var exports = module.exports = {};

//configuration
exports.dynamo = require('./lib/dynamo');

//operations
exports.createTable = require('./lib/create-table');
exports.create = require('./lib/create');
exports.delete = require('./lib/delete');
exports.get = require('./lib/get');
exports.query = require('./lib/query');
exports.scan = require('./lib/scan');
exports.update = require('./lib/update');

//help functions
exports.querystring = require('./lib/querystring');
