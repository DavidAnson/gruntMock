/*
 * gruntMock
 * https://github.com/DavidAnson/gruntMock
 *
 * Copyright (c) 2014 David Anson
 * Licensed under the MIT license.
 */

'use strict';

var domain = require('domain');
var util = require('util');

// Mock implementation
var GruntMock = function(target, files, options) {
  var self = this;

  // Parameters
  self._target = target || '*';
  self._files = files || [];
  self._options = options || {};

  // Public variables
  self.logError = [];
  self.logOk = [];

  // Grunt methods

  self.task = {
    registerMultiTask: function(name, info, fn) {
      var asyncCalled = false;
      // The initial call to registerMultiTask happens during the parse of a task function's body;
      // defer calling back into the task so the rest of the function will be processed
      process.nextTick(function() {
        fn.call({
          name: name,
          target: self._target,
          files: self._files,
          options: function() {
            return self._options;
          },
          async: function() {
            asyncCalled = true;
            return function(result) {
              var failed = (false === result) || (result instanceof Error);
              throw failed ? result : self;
            };
          }
        });
        if (!asyncCalled) {
          // Throw (a sentinel value) for unified handling of task completion (below in invoke)
          throw self;
        }
      });
    }
  };

  self.log = {
    debug: function(msg) {
      self.logOk.push(msg);
    },
    error: function(msg) {
      self.logError.push(msg || 'ERROR');
    },
    errorlns: function(msg) {
      self.logError.push(msg);
    },
    ok: function(msg) {
      self.logOk.push(msg || 'OK');
    },
    oklns: function(msg) {
      self.logOk.push(msg);
    },
    subhead: function(msg) {
      self.logOk.push(msg);
    },
    write: function(msg) {
      self.logOk.push(msg);
    },
    writeln: function(msg) {
      self.logOk.push(msg);
    },
    writeflags: function(obj, prefix) {
      // Use util.inspect as a simple, external implementation of writeflags
      self.logOk.push(prefix + ': ' + util.inspect(obj));
    }
  };
  // Map log to some of its aliases
  self.log.verbose = self.log;
  self.log.notverbose = self.log;
  self.verbose = self.log;
  self.verbose.or = self.log;

  self.fail = {
    warn: function(error) {
      self.logError.push(error);
      throw new Error(error);
    },
    fatal: function(error) {
      self.logError.push(error);
      throw new Error(error);
    }
  };

  // Grunt shortcuts

  self.registerMultiTask  = self.task.registerMultiTask;
  self.fatal = self.fail.fatal;
  self.warn = self.fail.warn;

  // Grunt pass-throughs

  var grunt = require('grunt');
  ['event', 'file', 'template', 'util'].forEach(function(name) {
    self[name] = grunt[name];
  });
  ['table', 'wordlist', 'wraptext', 'uncolor'].forEach(function(name) {
    self.log[name] = grunt.log[name];
  });

  // Entry point

  self.invoke = function(task, callback) {
    if (!task || (typeof(task) !== 'function')) {
      throw new Error('Must provide task parameter of type function');
    }
    if (!callback || (typeof(callback) !== 'function')) {
      throw new Error('Must provide callback parameter of type function');
    }

    var d = domain.create();
    d.on('error', function(err) {
      d.dispose();
      if (err !== self) {
        callback(err);
      } else {
        callback();
      }
    });
    d.run(function() {
      // Want to include synchronous exceptions in the domain, so use nextTick
      process.nextTick(function() {
        task(self);
      });
    });
  };
};

// Factory function
module.exports.create = function(config) {
  return new GruntMock(
    config.target,
    config.files,
    config.options);
};
