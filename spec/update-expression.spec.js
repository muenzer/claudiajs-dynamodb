var update_expression = require('../lib/update-expression.js');

describe("A function for creating the dyanmodb update call", function() {
  it("creates the call", function() {
  	var body = {"PaymentStatus":"Registered","Number":1};
  	var expression = update_expression.parse(body);
    expect(expression.UpdateExpression).toBe("set #PaymentStatus = :PaymentStatus, #Number = :Number");
    expect(expression.ExpressionAttributeValues[":PaymentStatus"]).toBe("Registered");
    expect(expression.ExpressionAttributeNames["#Number"]).toBe("Number");
  });
    it("creates the call", function() {
  	var body = {"PaymentStatus":"Registered"};
  	var expression = update_expression.parse(body);
    expect(expression.UpdateExpression).toBe("set #PaymentStatus = :PaymentStatus");
    expect(expression.ExpressionAttributeValues[":PaymentStatus"]).toBe("Registered");
    expect(expression.ExpressionAttributeNames["#PaymentStatus"]).toBe("PaymentStatus");
  });
});
