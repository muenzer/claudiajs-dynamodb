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
  it('creates the call with a condition', function() {
    var body = {'PaymentStatus':'Registered','Number':1};
    var condition = {'Size': 2};
    var expression = update_expression.parse(body, condition);
    expect(expression.UpdateExpression).toBe('SET #PaymentStatus = :PaymentStatus, #Number = :Number');
    expect(expression.ExpressionAttributeValues[':con_Size']).toBe(2);
    expect(expression.ExpressionAttributeNames['#con_Size']).toBe('Size');
    expect(expression.ConditionExpression).toBe('#con_Size = :con_Size');
  });
  it('creates the call with a complex condition', function() {
    var body = {'PaymentStatus':'Registered','Number':1};
    var condition = {'Size': 'L', 'Cost': {value: 100, operator: '<'}};
    var expression = update_expression.parse(body, condition);
    expect(expression.UpdateExpression).toBe('SET #PaymentStatus = :PaymentStatus, #Number = :Number');
    expect(expression.ExpressionAttributeValues[':con_Size']).toBe('L');
    expect(expression.ExpressionAttributeNames['#con_Size']).toBe('Size');
    expect(expression.ExpressionAttributeValues[':con_Cost']).toBe(100);
    expect(expression.ExpressionAttributeNames['#con_Cost']).toBe('Cost');
    expect(expression.ConditionExpression).toBe('#con_Size = :con_Size and #con_Cost < :con_Cost');
  });
  it('creates the call with an operator', function () {
    var body = {'PaymentStatus':'Registered','Number': {atomic: 'Number', value: 100, operator: '+'}};
    var expression = update_expression.parse(body);
    expect(expression.UpdateExpression).toBe('SET #PaymentStatus = :PaymentStatus, #Number = #Number + :atomicNumber');
    expect(expression.ExpressionAttributeValues[':PaymentStatus']).toBe('Registered');
    expect(expression.ExpressionAttributeValues[':atomicNumber']).toBe(100);
    expect(expression.ExpressionAttributeNames['#PaymentStatus']).toBe('PaymentStatus');
    expect(expression.ExpressionAttributeNames['#Number']).toBe('Number');
  })
  it('creates the call with an operator and two attributes', function () {
    var body = {'PaymentStatus':'Registered','Number': {atomic: 'Length', value: 10, operator: '+'}};
    var expression = update_expression.parse(body);
    expect(expression.UpdateExpression).toBe('SET #PaymentStatus = :PaymentStatus, #Number = #Length + :atomicLength');
    expect(expression.ExpressionAttributeValues[':PaymentStatus']).toBe('Registered');
    expect(expression.ExpressionAttributeValues[':atomicLength']).toBe(10);
    expect(expression.ExpressionAttributeNames['#PaymentStatus']).toBe('PaymentStatus');
    expect(expression.ExpressionAttributeNames['#Number']).toBe('Number');
    expect(expression.ExpressionAttributeNames['#Length']).toBe('Length');
  })

});
