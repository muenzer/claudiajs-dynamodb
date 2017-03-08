module.exports = function(key, dynamo, options) {

  var params = {
    TableName : dynamo.tableName,
    Key: key
  };

  if(options) {
    if(options.index) {
      params.IndexName = options.index;
    }
  }

  return dynamo.doc.get(params).promise().then(function (response) {
    return response.Item;
  });
};
