var AWS = require('aws-sdk');
// var dynamoconfig = {
//   endpoint: "http://localhost:8000",
//   region: "someregion",
//   accessKeyId: "test",
//   secretAccessKey: "test"
// };

var dynamoconfig = {region: 'eu-central-1'};
var dynamodb = new AWS.DynamoDB(dynamoconfig);
module.exports.raw = dynamodb;
module.exports.doc = new AWS.DynamoDB.DocumentClient({service:dynamodb});
