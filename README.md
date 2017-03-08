# claudiajs-dynamodb

Wrapper code for calling the dynamodb api from within a lambda function.  Intended for use with an api built using Claudia.js (http://claudiajs.com).  Based on the dynamodb example (https://github.com/claudiajs/example-projects/blob/master/dynamodb-example/index.js)

Note: Testing using jasmine requires having a local version of dynamodb running on port 8000

## Example usage
### Configuration
```
var lib = require('claudiajs-dynamodb');

var dynamoconfig = {
  region: "us-east-1"
};

dynamo = new lib.dynamo(dynamoconfig);
dynamo.tableName = "test";
```
### Create Item
```
var data = {
  name: "foo",
  number: "5",
  sort: "A"
};

//returns a promise from the AWS API
var response = lib.create(data, dynamo);

response.then(function (response) {
  console.log(response);
});
```
