// TestData unit tests

'use strict';

var gruntMock = require('../gruntMock.js');
var testData = require('./testData-task.js');

exports.testDataTest = {

  pass: function(test) {
    test.expect(4);
    var mock = gruntMock.create({
      target: 'pass',
      files: [
        {src: ['unused.txt']}
      ],
      options: {str: 'string', num: 1},
      data: {who: 'me'}
    });
    mock.invoke(testData, function(err) {
      test.ok(!err);
      test.equal(mock.logOk.length, 1);
      test.equal(mock.logOk[0], 'me');
      test.equal(mock.logError.length, 0);
      test.done();
    });
  },

  fail: function(test) {
    test.expect(2);
    var mock = gruntMock.create({
      target: 'fail',
      files: [
        {src: ['unused.txt']}
      ],
      options: {str: 'string', num: 1},
      data: {who: 'someone else'}
    });
    mock.invoke(testData, function(err) {
      test.ok(err);
      test.equal(err.message, 'Failed because [someone else] is not [me]');
      test.done();
    });
  },

  noData: function(test) {
    test.expect(2);
    var mock = gruntMock.create({
      target: 'fail',
      files: [
        {src: ['unused.txt']}
      ],
      options: {str: 'string', num: 1}
    });
    mock.invoke(testData, function(err) {
      test.ok(err);
      test.equal(err.message, 'Failed because [undefined] is not [me]');
      test.done();
    });
  }
};
