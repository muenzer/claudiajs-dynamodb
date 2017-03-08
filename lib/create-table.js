module.exports.respond = function(params, dynamo) {
  return dynamo.raw.createTable(params).promise().then(function (response) {
		return response;
	});
};
