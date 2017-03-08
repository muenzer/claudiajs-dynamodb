module.exports.respond = function(key, dynamo) {

  var params = {
    TableName : dynamo.tableName,
    Key: key
  };

  return dynamo.doc.delete(params).promise().then(function (response) {
    return response.Item;
  });
};
