var AWS = require('aws-sdk');

module.exports = function dynamo(dynamoconfig) {
  var dynamodb = new AWS.DynamoDB(dynamoconfig);
  this.raw = dynamodb;
  this.doc = new AWS.DynamoDB.DocumentClient({service:dynamodb});
};
