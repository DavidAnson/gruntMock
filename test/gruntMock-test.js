'use strict';

// Requires
var gruntMock = require('../gruntMock.js');
var testBench = require('./testBench-task.js');

// Helper to test mock output against expectations
function testLogs(test, mock, ok, error) {
  var i;
  test.equal(mock.logOk.length, ok.length);
  for (i = 0; i < ok.length; i++) {
    test.equal(mock.logOk[i], ok[i]);
  }
  test.equal(mock.logError.length, error.length);
  for (i = 0; i < error.length; i++) {
    test.equal(mock.logError[i], error[i]);
  }
}

exports.gruntMockTest = {

  register: function(test) {
    test.expect(3);
    var mock = gruntMock.create(
      { target: 'register' },
      function() {
        testLogs(test, mock, ['testBench registered with target register'], []);
        test.done();
      });
    testBench(mock);
  },

  log: function(test) {
    test.expect(10);
    var mock = gruntMock.create(
      { target: 'log' },
      function() {
        testLogs(test, mock,
          ['log.write', 'log.writeln', 'OK', 'log.ok', 'log.oklns'],
          ['ERROR', 'log.error', 'log.errorlns']);
        test.done();
      });
    testBench(mock);
  }
};
