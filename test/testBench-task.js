'use strict';

module.exports = function(grunt) {
  var self = {};

  // Register the task with Grunt
  grunt.registerMultiTask('testBench', 'Provides an environment for testing gruntMock.', function() {
    self.name = this.name;
    self.target = this.target;
    self[self.target]();
  });

  /* Methods to exercise the Grunt API */

  self.register = function() {
    grunt.log.ok(self.name + ' registered with target ' + self.target);
  };

  self.log = function() {
    grunt.log.ok('log.ok');
  };
};
