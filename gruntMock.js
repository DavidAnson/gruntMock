/*
 * gruntMock
 * https://github.com/DavidAnson/gruntMock
 *
 * Copyright (c) 2014 David Anson
 * Licensed under the MIT license.
 */

'use strict';

// Requires
var domain = require('domain');
var util = require('util');
var grunt = require('grunt');

// Implementation
var GruntMock = function(target, files, options) {
  var self = this;

  // Private variables
  var _context = {};
  var _success = {};

  // Public variables

  /**
   * Array of all error messages a task logs.
   */
  self.logError = [];

  /**
   * Array of all non-error messages a task logs.
   */
  self.logOk = [];

  // Grunt registration method

  self.task = {
    registerMultiTask: function(taskName, description, taskFunction) {
      var asyncCalled = false;

      // Handle optional description
      if (!taskFunction) {
        taskFunction = description;
        description = 'Custom multi-task.';
      }

      // Validate parameters
      if (!taskName || (typeof(taskName) !== 'string')) {
        throw new Error('Must provide taskName parameter of type string');
      }
      if (!description || (typeof(description) !== 'string')) {
        throw new Error('Must provide description parameter of type string');
      }
      if (!taskFunction || (typeof(taskFunction) !== 'function')) {
        throw new Error('Must provide taskFunction parameter of type function');
      }

      // Set up context (the "this" for the task)
      _context = {
        name: taskName,
        target: target,
        nameArgs: taskName + ':' + target,
        args: [],
        errorCount: 0,
        files: files,
        filesSrc: [],
        flags: {},
        options: function(defaults) {
          // Override defaults with options
          var result = {};
          Object.keys(defaults || {}).forEach(function(key) {
            result[key] = defaults[key];
          });
          Object.keys(options).forEach(function(key) {
            result[key] = options[key];
          });
          return result;
        },
        async: function() {
          // Return async callback
          asyncCalled = true;
          return function(result) {
            var failed = (false === result) || (result instanceof Error);
            throw failed ? result : _success;
          };
        }
      };

      // Populate filesSrc from files
      files.forEach(function(item) {
        (item.src || []).forEach(function(file) {
          _context.filesSrc.push(file);
        });
      });

      // Initial call to registerMultiTask happens during the parse of a task function's
      // body; defer calling back into it until the rest of the function has been parsed.
      process.nextTick(function() {
        taskFunction.call(_context);
        if (!asyncCalled) {
          // Throw for unified handling of task completion (below in invoke)
          throw _success;
        }
      });
    }
  };

  // Grunt log methods

  self.log = {
    error: function(msg) {
      self.logError.push((undefined === msg ? 'ERROR' : msg) + '');
      _context.errorCount++;
    },
    errorlns: function(msg) {
      self.logError.push(msg + '');
      _context.errorCount++;
    },
    ok: function(msg) {
      self.logOk.push((undefined === msg ? 'OK' : msg) + '');
    },
    warn: function(msg) {
      // warn behaves like error, but does not increment errorCount
      self.logOk.push((undefined === msg ? 'ERROR' : msg) + '');
    },
    write: function(msg) {
      self.logOk.push(msg + '');
    },
    writeflags: function(obj, prefix) {
      // Use util.inspect as a simple implementation of writeflags
      self.logOk.push((prefix || 'Flags') + ': ' + (0 < Object.keys(obj).length ? util.inspect(obj) : '(none)'));
    },
    writetableln: function(widths, texts) {
      self.logOk.push(grunt.log.table(widths, texts));
    }
  };
  ['debug', 'fail', 'header', 'oklns', 'subhead', 'success', 'writeln', 'writelns'].forEach(function(name) {
      self.log[name] = self.log.write;
  });
  // Map grunt.log to some of its aliases
  self.log.verbose = self.log;
  self.log.notverbose = self.log;
  self.verbose = self.log;
  self.verbose.or = self.log;

  // Grunt fail methods

  self.fail = {
    fatal: function(error) {
      self.logError.push(error);
      throw new Error(error);
    }
  };
  self.fail.warn = self.fail.fatal;

  // Grunt package information

  self.package = require('./package.json');

  // Grunt shortcuts

  self.registerMultiTask  = self.task.registerMultiTask;
  self.fatal = self.fail.fatal;
  self.warn = self.fail.warn;
  self.version = self.package.version;

  // Grunt pass-throughs

  ['event', 'file', 'option', 'template', 'util'].forEach(function(name) {
    self[name] = grunt[name];
  });
  ['table', 'wordlist', 'wraptext', 'uncolor'].forEach(function(name) {
    self.log[name] = grunt.log[name];
  });

  /**
   * Mocks Grunt and invokes a multi-task.
   *
   * @param {Function} task A Grunt multi-task.
   * @param {Function} callback A callback(err, mock) function.
   */
  self.invoke = function(task, callback) {
    // Validate parameters
    if (!task || (typeof(task) !== 'function')) {
      throw new Error('Must provide task parameter of type function');
    }
    if (!callback || (typeof(callback) !== 'function')) {
      throw new Error('Must provide callback parameter of type function');
    }

    // Create a domain for control over exception handling
    var d = domain.create();
    d.on('error', function(err) {
      d.dispose();
      if (err === _success) {
        // Success, pass null for err
        err = null;
      }
      callback(err, self);
    });
    d.run(function() {
      // Use nextTick to include synchronous exceptions in the domain
      process.nextTick(function() {
        task(self);
      });
    });
  };
};

/**
 * Creates an instance of GruntMock.
 *
 * @param {Object} config Configuration object (target, files, options).
 * @return {GruntMock} A new instance of GruntMock.
 */
module.exports.create = function(config) {
  config = config || {};
  return new GruntMock(
    config.target || '*',
    config.files || [],
    config.options || {});
};
