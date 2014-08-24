'use strict';

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({

    // Linting
    jshint: {
      files: [
        '*.js',
        'test/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Unit tests
    nodeunit: {
      files: ['test/*-test.js']
    },

    testBench: {
      grunt: {},
      register: {},
      log: {},
      // failWarn: {},
      // failFatal: {},
      async: {},
      asyncTrue: {},
      // asyncFalse: {},
      // asyncError: {},
      // asyncFatal: {},
      event: {},
      file: {},
      template: {},
      util: {},
    },

    // Watcher
    watch: {
      files: ['**/*.js'],
      tasks: ['default']
    }
  });

  // Load required plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Load test bench task
  grunt.loadTasks('test');

  // Default: Run, test, and lint
  grunt.registerTask('default', ['testBench', 'nodeunit', 'jshint']);
};
