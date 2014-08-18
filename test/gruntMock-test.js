'use strict';

// Requires
var gruntMock = require('../gruntMock.js');
var testBench = require('./testBench-task.js');

// Helper to test mock output against expectations
function testLogs(test, mock, ok) {
  test.equal(mock.logOk.length, ok.length);
  for (var i = 0; i < ok.length; i++) {
    test.equal(mock.logOk[i], ok[i]);
  }
}

exports.gruntMockTest = {

  register: function(test) {
    test.expect(2);
    var mock = gruntMock.create(
      { target: 'register' },
      function() {
        testLogs(test, mock, ['testBench registered with target register']);
        test.done();
      });
    testBench(mock);
  },

  log: function(test) {
    test.expect(2);
    var mock = gruntMock.create(
      { target: 'log' },
      function() {
        testLogs(test, mock, ['log.ok']);
        test.done();
      });
    testBench(mock);
  }
};
