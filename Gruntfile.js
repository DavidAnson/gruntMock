'use strict';

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({

    // Linting
    jshint: {
      src: [
        '*.js',
        'test/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Unit tests
    nodeunit: {
      src: ['test/*-test.js']
    },

    testBench: {
      grunt: {},
      register: {},
      log: {},
      // failWarn: {},
      // failFatal: {},
      optionsEmpty: {},
      optionsSimple: {
        options: {
          string: 'options',
          number: 1,
        }
      },
      optionsDefault: {},
      optionsMerged: {
        options: {
          string: 'options',
          number: 1,
        }
      },
      filesCompact: {
        src: ['*.js', 'test/*.js']
      },
      filesObject: {
        files: {
          'root.js': ['*.js'],
          'test.js': ['test/*.js']
        }
      },
      filesArray: {
        files: [
          { src: ['*.js'], dest: 'root.js', extra: 0 },
          { src: ['test/*.js'], dest: 'test.js', extra: 1 }
        ]
      },
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
