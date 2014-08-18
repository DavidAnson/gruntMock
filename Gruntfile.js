'use strict';

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({

    // Linting
    jshint: {
      all: [
        '*.js',
        'test/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Unit tests
    nodeunit: {
      tests: ['test/*-test.js']
    },

    testBench: {
      register: {},
      log: {},
    }
  });

  // Load required plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Load test bench task
  grunt.loadTasks('test');

  // Default: Run, test, and lint
  grunt.registerTask('default', ['testBench', 'nodeunit', 'jshint']);
};
