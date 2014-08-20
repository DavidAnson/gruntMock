/*
 * gruntMock
 * https://github.com/DavidAnson/gruntMock
 *
 * Copyright (c) 2014 David Anson
 * Licensed under the MIT license.
 */

'use strict';

// Mock implementation
var GruntMock = function(target, files, options, callback) {
  var self = this;

  // Parameters
  self._target = target || '*';
  self._files = files || [];
  self._options = options || {};
  if (!callback || (typeof callback !== 'function')) {
    throw new Error('gruntMock is async; must provide a function callback');
  }

  // Public variables
  self.logError = [];
  self.logOk = [];

  // Grunt methods

  self.task = {
    registerMultiTask: function(name, info, fn) {
      process.nextTick(function() {
        fn.apply({
          name: name,
          target: self._target,
          files: self._files,
          options: function() {
            return self._options;
          }
        });
        callback();
      });
    }
  };

  self.log = {
    error: function(s) {
      self.logError.push(s || 'ERROR');
    },
    errorlns: function(s) {
      self.logError.push(s);
    },
    ok: function(s) {
      self.logOk.push(s || 'OK');
    },
    oklns: function(s) {
      self.logOk.push(s);
    },
    write: function(s) {
      self.logOk.push(s);
    },
    writeln: function(s) {
      self.logOk.push(s);
    },
  };

  // Grunt shortcuts

  self.registerMultiTask  = self.task.registerMultiTask;
};

// Factory function
module.exports.create = function(config, callback) {
  return new GruntMock(
    config.target,
    config.files,
    config.options,
    callback);
};
