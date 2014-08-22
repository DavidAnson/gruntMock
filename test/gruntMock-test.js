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
    test.expect(4);
    var mock = gruntMock.create({ target: 'register' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock, ['testBench registered with target register'], []);
      test.done();
    });
  },

  log: function(test) {
    test.expect(11);
    var mock = gruntMock.create({ target: 'log' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['log.write', 'log.writeln', 'OK', 'log.ok', 'log.oklns'],
        ['ERROR', 'log.error', 'log.errorlns']);
      test.done();
    });
  },

  failWarn: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'failWarn' });
    mock.invoke(testBench, function(err) {
      test.equal(err.message, 'fail.warn');
      testLogs(test, mock,
        [],
        ['fail.warn']);
      test.done();
    });
  },

  failFatal: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'failFatal' });
    mock.invoke(testBench, function(err) {
      test.equal(err.message, 'fail.fatal');
      testLogs(test, mock,
        [],
        ['fail.fatal']);
      test.done();
    });
  },

  async: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'async' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['async'],
        []);
      test.done();
    });
  },

  asyncFatal: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'asyncFatal' });
    mock.invoke(testBench, function(err) {
      test.equal(err.message, 'async/fatal');
      testLogs(test, mock,
        [],
        ['async/fatal']);
      test.done();
    });
  },
};
