// Example task

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('example', 'Example task', function() {
    if ('pass' === this.target) {
      grunt.log.ok('pass');
    } else {
      grunt.fail.fatal('fail');
    }
  });
};
