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
    grunt.log.ok(self.name + ' registered with target ' + self.target);
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
};
