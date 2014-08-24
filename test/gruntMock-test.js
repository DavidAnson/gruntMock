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
      testLogs(test, mock, ['testBench registered, target=register'], []);
      test.done();
    });
  },

  log: function(test) {
    test.expect(21);
    var mock = gruntMock.create({ target: 'log' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['log.write', 'log.writeln', 'OK', 'log.ok', 'log.oklns', 'log.debug', 'log.subhead',
         'log.writeflags: { string: \'string\', number: 10 }', 'log.verbose.ok', 'log.notverbose.ok',
         'verbose.ok', 'verbose.or.ok', 'grunt, log, wordlist', 'grunt log\nwraptext', '12 3  4   5    '],
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

  event: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'event' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['test.event'],
        []);
      test.done();
    });
  },

  file: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'file' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['package.json: exists=true, name=gruntMock'],
        []);
      test.done();
    });
  },

  template: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'template' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['template processed'],
        []);
      test.done();
    });
  },

  util: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'util' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['util, kindOf=boolean, repeat=reprep'],
        []);
      test.done();
    });
  },
};
