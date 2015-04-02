// TestData task

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('testData', 'Example task that uses the data attribute', function() {
    if ('me' === this.data.who) {
      grunt.log.ok('me');
    } else {
      grunt.fail.fatal('Failed because [' + this.data.who + '] is not [me]');
    }
  });
};
