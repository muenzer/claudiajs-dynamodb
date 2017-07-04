module.exports = function(params, dynamo) {
  return dynamo.raw.deleteTable(params).promise().then(function (response) {
		return response;
	});
};
