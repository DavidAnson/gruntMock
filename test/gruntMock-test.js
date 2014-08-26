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

  grunt: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'grunt' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock, ['grunt version=0.1.0, package.name=gruntMock'], []);
      test.done();
    });
  },

  register: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'register' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['testBench registered, { args: [],  flags: {},  name: \'testBench\',  nameArgs: \'testBench:register\',  target: \'register\',  optionFlags: [] }'],
        []);
      test.done();
    });
  },

  log: function(test) {
    test.expect(24);
    var mock = gruntMock.create({ target: 'log' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['log.write', 'log.writeln', 'OK', '0', 'log.ok', 'log.oklns', 'log.debug', 'log.subhead',
         'log.writeflags: { string: \'string\', number: 10 }', 'log.verbose.ok', 'log.notverbose.ok',
         'verbose.ok', 'verbose.or.ok', 'grunt, log, wordlist', 'grunt log\nwraptext', '12 3  4   5    ', '4'],
        ['ERROR', 'false', 'log.error', 'log.errorlns']);
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

  optionsEmpty: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'optionsEmpty' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['Flags: (none)'],
        []);
      test.done();
    });
  },

  optionsSimple: function(test) {
    test.expect(4);
    var mock = gruntMock.create({
      target: 'optionsSimple',
      options: {
        string: 'options',
        number: 1,
      }
    });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['Flags: { string: \'options\', number: 1 }'],
        []);
      test.done();
    });
  },

  optionsDefault: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'optionsDefault'});
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['Flags: { string: \'default\', boolean: true }'],
        []);
      test.done();
    });
  },

  optionMerged: function(test) {
    test.expect(4);
    var mock = gruntMock.create({
      target: 'optionsMerged',
      options: {
        string: 'options',
        number: 1,
      }
    });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['Flags: { string: \'options\', boolean: true, number: 1 }'],
        []);
      test.done();
    });
  },

  filesCompact: function(test) {
    // Unused; see filesArray
    test.done();
  },

  filesObject: function(test) {
    // Unused; see filesArray
    test.done();
  },

  filesArray: function(test) {
    test.expect(6);
    var mock = gruntMock.create({
      target: 'filesArray',
      files: [
        { src: ['a.txt', 'b.txt'] },
        { src: ['c.txt'], dest: 'd.txt', extra: 1 },
      ]
    });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock,
        ['Item: { src: [ \'a.txt\', \'b.txt\' ] }',
         'Item: { src: [ \'c.txt\' ], dest: \'d.txt\', extra: 1 }',
         'a.txt,b.txt,c.txt'],
        []);
      test.done();
    });
  },

  async: function(test) {
    test.expect(3);
    var mock = gruntMock.create({ target: 'async' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock, [], []);
      test.done();
    });
  },

  asyncTrue: function(test) {
    test.expect(3);
    var mock = gruntMock.create({ target: 'asyncTrue' });
    mock.invoke(testBench, function(err) {
      test.ok(!err);
      testLogs(test, mock, [], []);
      test.done();
    });
  },

  asyncFalse: function(test) {
    test.expect(3);
    var mock = gruntMock.create({ target: 'asyncFalse' });
    mock.invoke(testBench, function(err) {
      test.ok(false === err);
      testLogs(test, mock, [], []);
      test.done();
    });
  },

  asyncError: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'asyncError' });
    mock.invoke(testBench, function(err) {
      test.ok(err instanceof Error);
      test.equal('asyncError', err.message);
      testLogs(test, mock, [], []);
      test.done();
    });
  },

  asyncFatal: function(test) {
    test.expect(4);
    var mock = gruntMock.create({ target: 'asyncFatal' });
    mock.invoke(testBench, function(err) {
      test.equal(err.message, 'asyncFatal');
      testLogs(test, mock,
        [],
        ['asyncFatal']);
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
