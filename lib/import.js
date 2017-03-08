var dynamo = require('./dynamo');
var shortid = require('shortid');

module.exports.respond = function(event, cb) {

  var batchData = [];

  event.Items.forEach(function(data) {
    if (typeof data.id === 'undefined') {
      data.id = shortid.generate();
    }
    
    data.CreatedAt = new Date().getTime();
    data.UpdatedAt  = data.CreatedAt;

    var request = {
      "PutRequest": {
        "Item": data
      }
    };

    batchData.push(request);
  });

  var params = {
    RequestItems: {
    }
  };

  var n = batchData.length;

  for (var i = 0; i <= n; i +=25) {
    params.RequestItems[dynamo.tableName] = batchData.slice(i, i+25);

    console.log(params);

    dynamo.doc.batchWrite(params, cb);
  }
};

response = function(err,data) {
      if (err){
        cb(err);
      }else{
        var newData = {"classes": data};
        cb(err,newData);
      }
    };