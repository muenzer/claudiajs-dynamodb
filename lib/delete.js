module.exports = function(key, dynamo) {

  var params = {
    TableName : dynamo.tableName,
    Key: key,
    ReturnValues: 'ALL_OLD'
  };

  return dynamo.doc.delete(params).promise().then(function (response) {
    if(Object.keys(response).length > 0) {
      return response.Attributes;
    } else {
      return 'nothing deleted';
    }
  })
  .catch(function (err) {
    throw err;
  });
};
