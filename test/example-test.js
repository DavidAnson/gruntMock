// Example unit tests

'use strict';

var gruntMock = require('../gruntMock.js');
var example = require('./example-task.js');

exports.exampleTest = {

  pass: function(test) {
    test.expect(4);
    var mock = gruntMock.create({
      target: 'pass',
      files: [
        { src: ['unused.txt'] }
      ],
      options: { str: 'string', num: 1 }
    });
    mock.invoke(example, function(err) {
      test.ok(!err);
      test.equal(mock.logOk.length, 1);
      test.equal(mock.logOk[0], 'pass');
      test.equal(mock.logError.length, 0);
      test.done();
    });
  },

  fail: function(test) {
    test.expect(2);
    var mock = gruntMock.create({ target: 'fail' });
    mock.invoke(example, function(err) {
      test.ok(err);
      test.equal(err.message, 'fail');
      test.done();
    });
  }
};
