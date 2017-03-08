module.exports = function(key, dynamo) {

  var params = {
    TableName : dynamo.tableName,
    Key: key
  };

  return dynamo.doc.get(params).promise().then(function (response) {
    return response.Item;
  });
};
