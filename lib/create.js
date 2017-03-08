var shortid = require('shortid');

module.exports.respond = function(data, dynamo, options) {

  // data.id = shortid.generate();
  if(!(data.hasOwnProperty('id'))) {
    data.id = shortid.generate();
  }
  data.CreatedAt = new Date().getTime();
  data.UpdatedAt  = data.CreatedAt;

  var params = {
    TableName : dynamo.tableName,
    Item : data
  };

  if(options) {
    if(options.conditional) {
      params.ConditionExpression = options.conditional;
    }

    if(options.attributes) {
      params.ExpressionAttributeNames = options.attributes;
    }

    if(options.prefix) {
      data.id = options.prefix + data.id;
    }
  }

  //return dynamo.doc.put(params).promise();

  return dynamo.doc.put(params).promise().then(function () {
    return data;
  })
  .catch(function (err) {
    throw err;
  });
};
