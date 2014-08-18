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
  self.logOk = [];

  // Grunt methods

  self.registerMultiTask = function(name, info, fn) {
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
  };

  self.log = {
    ok: function(s) {
      self.logOk.push(s);
    }
  };
};

// Factory function
module.exports.create = function(config, callback) {
  return new GruntMock(
    config.target,
    config.files,
    config.options,
    callback);
};
