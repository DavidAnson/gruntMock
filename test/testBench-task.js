// A task to exercise the Grunt API and validate gruntMock

'use strict';

// Requires
var util = require('util');

// Task definition
module.exports = function(grunt) {
  var self = {};

  // Register the task with Grunt
  grunt.registerMultiTask('testBench', 'Provides an environment for testing gruntMock.', function() {
    var method = self['_' + this.target];
    if (!method) {
      throw new Error('Unsupported target: ' + this.target);
    }
    method.call(this);
  });

  /* Methods to exercise the Grunt API */

  self._grunt = function() {
    grunt.log.ok('grunt version=' + grunt.version + ', package.name=' + grunt.package.name);
  };

  self._register = function() {
    grunt.log.ok(this.name + ' registered, ' + util.inspect({
      args: this.args,
      flags: this.flags,
      name: this.name,
      nameArgs: this.nameArgs,
      target: this.target,
      optionFlags: grunt.option.flags(),
    }).replace(/\n/g, ''));
  };

  self._log = function() {
    grunt.log.write('log.write');
    grunt.log.writeln('log.writeln');
    grunt.log.ok();
    grunt.log.ok(0);
    grunt.log.ok('log.ok');
    grunt.log.oklns('log.oklns');
    grunt.log.error();
    grunt.log.error(false);
    grunt.log.error('log.error');
    grunt.log.errorlns('log.errorlns');
    grunt.log.debug('log.debug');
    grunt.log.subhead('log.subhead');
    grunt.log.writeflags({ string: 'string', number: 10 }, 'log.writeflags');
    grunt.log.verbose.ok('log.verbose.ok');
    grunt.log.notverbose.ok('log.notverbose.ok');
    grunt.verbose.ok('verbose.ok');
    grunt.verbose.or.ok('verbose.or.ok');
    grunt.log.ok(grunt.log.uncolor(grunt.log.wordlist(['grunt', 'log', 'wordlist'])));
    grunt.log.ok(grunt.log.wraptext(10, 'grunt log wraptext'));
    grunt.log.ok(grunt.log.table([1, 2, 3, 4, 5], ['1', '2', '3', '4', '5']));
    grunt.log.fail('log.fail');
    grunt.log.header('log.header');
    grunt.log.success('log.success');
    grunt.log.warn();
    grunt.log.warn('log.warn');
    grunt.log.writelns('log.writelns');
    grunt.log.writetableln([1, 2, 3, 4], ['1', '2', '3', '4']);
    grunt.log.ok(this.errorCount);
  };

  self._failWarn = function() {
    grunt.warn('fail.warn');
    throw new Error('unreachable');
  };

  self._failFatal = function() {
    grunt.fatal('fail.fatal');
    throw new Error('unreachable');
  };

  self._optionsEmpty = function() {
    grunt.log.writeflags(this.options());
  };

  self._optionsSimple = function() {
    grunt.log.writeflags(this.options());
  };

  self._optionsDefault = function() {
    grunt.log.writeflags(this.options({ string: 'default', boolean: true }));
  };

  self._optionsMerged = function() {
    grunt.log.writeflags(this.options({ string: 'default', boolean: true }));
  };

  var filesHandler = function() {
    this.files.forEach(function(item) {
      grunt.log.writeflags(item, 'Item');
    });
    grunt.log.ok(this.filesSrc);
  };
  self._filesCompact = filesHandler;
  self._filesObject = filesHandler;
  self._filesArray = filesHandler;

  self._async = function() {
    var done = this.async();
    setTimeout(function() {
      done();
    }, 1);
  };

  self._asyncImmediate = function() {
    var done = this.async();
    setImmediate(function() {
      done();
    });
  };

  self._asyncTrue = function() {
    var done = this.async();
    setTimeout(function() {
      done(true);
    }, 1);
  };

  self._asyncFalse = function() {
    var done = this.async();
    setTimeout(function() {
      done(false);
    }, 1);
  };

  self._asyncError = function() {
    var done = this.async();
    setTimeout(function() {
      done(new Error('asyncError'));
    }, 1);
  };

  self._asyncFatal = function() {
    this.async();
    setTimeout(function() {
      grunt.fatal('asyncFatal');
      throw new Error('unreachable');
    }, 1);
  };

  self._event = function() {
    grunt.event.once('test.event', function() {
      grunt.log.ok('test.event');
    });
    grunt.event.emit('test.event');
  };

  self._file = function() {
    var name = 'package.json';
    var exists = grunt.file.exists(name);
    var json = grunt.file.readJSON(name);
    grunt.log.ok(name + ': exists=' + exists + ', name=' + json.name);
  };

  self._template = function() {
    grunt.log.ok(grunt.template.process('template <%= msg %>', { data: { msg: 'processed' } }));
  };

  self._util = function() {
    grunt.log.ok('util, kindOf=' + grunt.util.kindOf(true) + ', repeat=' + grunt.util.repeat(2, 'rep'));
  };
};
