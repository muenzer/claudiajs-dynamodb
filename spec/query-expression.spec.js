var query_expression = require('../lib/query-expression.js');

describe("A function for creating the dyanmodb query call", function() {
  it("creates the call", function() {
  	var body = {"PaymentStatus":"Registered","Number":1};
  	var expression = query_expression.parse(body);
    expect(expression.KeyConditionExpression).toBe("#PaymentStatus = :PaymentStatus and #Number = :Number");
    expect(expression.ExpressionAttributeValues[":PaymentStatus"]).toBe("Registered");
    expect(expression.ExpressionAttributeNames["#Number"]).toBe("Number");
  });
    it("creates the call", function() {
  	var body = {"PaymentStatus":"Registered"};
  	var expression = query_expression.parse(body);
    expect(expression.KeyConditionExpression).toBe("#PaymentStatus = :PaymentStatus");
    expect(expression.ExpressionAttributeValues[":PaymentStatus"]).toBe("Registered");
    expect(expression.ExpressionAttributeNames["#PaymentStatus"]).toBe("PaymentStatus");
  });
    it("creates the call with an array", function() {
    var body = [{attribute: "PaymentStatus", value: "Registered", operator: "="}];
    var expression = query_expression.parse(body);
    expect(expression.KeyConditionExpression).toBe("#PaymentStatus = :PaymentStatus");
    expect(expression.ExpressionAttributeValues[":PaymentStatus"]).toBe("Registered");
    expect(expression.ExpressionAttributeNames["#PaymentStatus"]).toBe("PaymentStatus");
  });
    it("creates the call with begins_with", function() {
    var body = [{attribute: "PaymentStatus", value: "R", operator: "begins_with"}];
    var expression = query_expression.parse(body);
    expect(expression.KeyConditionExpression).toBe("begins_with(#PaymentStatus,:PaymentStatus)");
    expect(expression.ExpressionAttributeValues[":PaymentStatus"]).toBe("R");
    expect(expression.ExpressionAttributeNames["#PaymentStatus"]).toBe("PaymentStatus");
  });
});
