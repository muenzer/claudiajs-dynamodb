var update_expression = require('../lib/update-expression.js');

describe('A function for creating the dyanmodb update call', function() {
  it('creates the call with multiple values', function() {
    var body = {'PaymentStatus':'Registered','Number':1};
    var expression = update_expression.parse(body);
    expect(expression.UpdateExpression).toBe('SET #PaymentStatus = :PaymentStatus, #Number = :Number');
    expect(expression.ExpressionAttributeValues[':PaymentStatus']).toBe('Registered');
    expect(expression.ExpressionAttributeNames['#Number']).toBe('Number');
  });
  it('creates the call with one value', function() {
    var body = {'PaymentStatus':'Registered'};
    var expression = update_expression.parse(body);
    expect(expression.UpdateExpression).toBe('SET #PaymentStatus = :PaymentStatus');
    expect(expression.ExpressionAttributeValues[':PaymentStatus']).toBe('Registered');
    expect(expression.ExpressionAttributeNames['#PaymentStatus']).toBe('PaymentStatus');
  });
  it('creates the call with null values', function() {
    var body = {'PaymentStatus':null};
    var expression = update_expression.parse(body);
    expect(expression.UpdateExpression).toBe(' REMOVE #PaymentStatus');
    expect(expression.ExpressionAttributeNames['#PaymentStatus']).toBe('PaymentStatus');
  });
  it('creates the call with regular and null values', function() {
    var body = {'PaymentStatus':null, 'Number':1};
    var expression = update_expression.parse(body);
    expect(expression.UpdateExpression).toBe('SET #Number = :Number REMOVE #PaymentStatus');
    expect(expression.ExpressionAttributeNames['#PaymentStatus']).toBe('PaymentStatus');
  });

});
