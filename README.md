# gruntMock

> A simple mock for testing Grunt multi-tasks.

## Overview

Some [Grunt](http://gruntjs.com/) tasks are thin wrappers over functionality that's already well tested (ex: [grunt-contrib-jshint](https://www.npmjs.org/package/grunt-contrib-jshint)). Other Grunt tasks offer custom functionality, specialized behavior, or need their output to be verified. gruntMock is targeted at the second set and offers a way to validate the complete, end-to-end lifecycle of a Grunt multi-task.

gruntMock is simple [mock object](http://en.wikipedia.org/wiki/Mock_object) that simulates the Grunt task runner for multi-tasks and can easily be integrated into a unit testing environment (such as [Nodeunit](https://www.npmjs.org/package/nodeunit)). gruntMock calls into tasks the same way Grunt does and exposes (almost) the same set of APIs. After providing input to the task, gruntMock runs and captures its output so tests can verify expected behavior. Task success and failure are unified, so it's easy to write positive and negative tests.

## Example

```
var gruntMock = require('gruntMock');
var example = require('./example-task.js');

exports.exampleTest = {

  pass: function(test) {
    test.expect(4);
    var mock = gruntMock.create({
      target: 'pass',
      files: [
        { src: ['unused.txt'] }
      ],
      options: { str: 'string', num: 1 }
    });
    mock.invoke(example, function(err) {
      test.ok(!err);
      test.equal(mock.logOk.length, 1);
      test.equal(mock.logOk[0], 'pass');
      test.equal(mock.logError.length, 0);
      test.done();
    });
  },

  fail: function(test) {
    test.expect(2);
    var mock = gruntMock.create({ target: 'fail' });
    mock.invoke(example, function(err) {
      test.ok(err);
      test.equal(err.message, 'fail');
      test.done();
    });
  }
};
```

## Mocking

Some of Grunt's APIs are self-contained and don't need special handling (ex: `grunt.file`), so gruntMock exposes the original implementation via a pass-through. Other APIs need to be captured or redirected for test purposes (ex: `grunt.log`), so gruntMock returns a custom implementation. Other APIs are complicated or uncommon enough that gruntMock doesn't try to support them at all (ex: `grunt.task`).

## Interface

```
/**
 * Creates an instance of GruntMock.
 *
 * @param {Object} config Configuration object (target, files, options).
 * @return {GruntMock} A new instance of GruntMock.
 */
var gruntMock = GruntMock.create(config)

/**
 * Mocks Grunt and invokes a multi-task.
 *
 * @param {Function} task A Grunt multi-task.
 * @param {Function} callback A callback(err, mock) function.
 */
gruntMock.invoke(task, callback)

/**
 * Array of all error messages a task logs.
 */
gruntMock.logError

/**
 * Array of all non-error messages a task logs.
 */
gruntMock.logOk
```

## Supported APIs

### [grunt](http://gruntjs.com/api/grunt)
* `registerMultiTask`
* `warn`
* `fatal`
* `option`
* `package`
* `version`

### [grunt.event](http://gruntjs.com/api/grunt.event)

* All methods (via pass-through)

### [grunt.fail](http://gruntjs.com/api/grunt.fail)

* All methods

### [grunt.file](http://gruntjs.com/api/grunt.file)

* All methods (via pass-through)

### [grunt.log](http://gruntjs.com/api/grunt.log)

* All methods (with helpers via pass-through)

### [grunt.option](http://gruntjs.com/api/grunt.option)

* All methods (via pass-through)

### [grunt.task](http://gruntjs.com/api/grunt.task)

* registerMultiTask

### [grunt.template](http://gruntjs.com/api/grunt.template)

* All methods (via pass-through)

### [grunt.util](http://gruntjs.com/api/grunt.util)

* All methods (via pass-through)

### [Inside Tasks](http://gruntjs.com/api/inside-tasks)

* `args` (see note below)
* `async`
* `errorCount`
* `files` (see note below)
* `filesSrc`
* `flags` (see note below)
* `name`
* `nameArgs`
* `options`
* `target`

## Notes

* gruntMock supports both synchronous and asynchronous task execution. gruntMock's invoke method always calls its callback asynchronously.
* The `files` input uses Grunt's [array format](http://gruntjs.com/configuring-tasks#files-array-format). [Globbing](http://gruntjs.com/configuring-tasks#globbing-patterns) is not handled by gruntMock because it's outside the scope of testing a Grunt task. Test input can be provided un-globbed for the same effect.
* Although `grunt.log.warn` behaves like `grunt.log.error`, it does not increment `this.errorCount`, so its output is logged to `gruntMock.logOk`.
* gruntMock unconditionally captures and reports verbose/debug output along with normal log output. Differentiating among normal/verbose/debug output is not currently supported.
* Grunt's `--force` option is not supported; a call to `grunt.warn.fatal` or an unhandled exception always ends the task.
* `this.args` and `this.flags` are unused and always empty.

## License

[MIT](LICENSE)

## Releases

* 0.1.0 - Initial release.
