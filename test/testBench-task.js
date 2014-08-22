'use strict';

module.exports = function(grunt) {
  var self = {};

  // Register the task with Grunt
  grunt.registerMultiTask('testBench', 'Provides an environment for testing gruntMock.', function() {
    self.name = this.name;
    self.target = this.target;
    self['_' + self.target].call(this);
  });

  /* Methods to exercise the Grunt API */

  self._register = function() {
    grunt.log.ok(self.name + ' registered, target=' + self.target);
  };

  self._log = function() {
    grunt.log.write('log.write');
    grunt.log.writeln('log.writeln');
    grunt.log.ok();
    grunt.log.ok('log.ok');
    grunt.log.oklns('log.oklns');
    grunt.log.error();
    grunt.log.error('log.error');
    grunt.log.errorlns('log.errorlns');
  };

  self._failWarn = function() {
    grunt.warn('fail.warn');
    grunt.log.ok('unreachable');
  };

  self._failFatal = function() {
    grunt.fatal('fail.fatal');
    grunt.log.ok('unreachable');
  };

  self._async = function() {
    var done = this.async();
    setTimeout(function() {
      grunt.log.ok('async');
      done();
    }, 1);
  };

  self._asyncFatal = function() {
    this.async();
    setTimeout(function() {
      grunt.fatal('async/fatal');
      grunt.log.ok('unreachable');
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
