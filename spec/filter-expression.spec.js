var filter_expression = require('../lib/filter-expression.js');

describe("A function for creating the dyanmodb query call", function() {
  it("creates the call", function() {
  	var body = {"PaymentStatus":"Registered","Number":1};
  	var expression = filter_expression.parse(body);
    expect(expression.FilterExpression).toBe("#PaymentStatus = :PaymentStatus and #Number = :Number");
    expect(expression.ExpressionAttributeValues[":PaymentStatus"]).toBe("Registered");
    expect(expression.ExpressionAttributeNames["#Number"]).toBe("Number");
  });
    it("creates the call", function() {
  	var body = {"PaymentStatus":"Registered"};
  	var expression = filter_expression.parse(body);
    expect(expression.FilterExpression).toBe("#PaymentStatus = :PaymentStatus");
    expect(expression.ExpressionAttributeValues[":PaymentStatus"]).toBe("Registered");
    expect(expression.ExpressionAttributeNames["#PaymentStatus"]).toBe("PaymentStatus");
  });
});
