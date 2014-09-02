# gruntMock

> A simple mock for testing Grunt multi-tasks.

## Overview

Some [Grunt](http://gruntjs.com/) tasks are thin wrappers over functionality that's already well tested (ex: [grunt-contrib-jshint](https://www.npmjs.org/package/grunt-contrib-jshint)) and don't need much testing themselves. For tasks like that, gruntMock isn't super relevant. But for tasks that offer custom functionality, deserve to be exercised as by Grunt, or need their output verified, gruntMock may be useful.

gruntMock is simple [mock object](http://en.wikipedia.org/wiki/Mock_object) that simulates the Grunt task runner for multi-tasks and can easily be integrated into a unit testing environment like [Nodeunit](https://www.npmjs.org/package/nodeunit). gruntMock calls into tasks the same way Grunt does and exposes (almost) the same set of APIs. After providing the input to the task, gruntMock runs it and captures the output so you can assert correctness. Task success and failure scenarios are unified, so it is easy to write positive and negative tests.

## Example

```
...
```

## Mocking

Some of Grunt's APIs are self-contained and don't need special handling (ex: `grunt.file`), so gruntMock exposes the original implementation as-is. Other APIs need to be captured or redirected for test purposes (ex: `grunt.log`), so gruntMock returns a custom implementation. Other APIs are complicated or uncommon enough that gruntMock doesn't try to support them at all (ex: `grunt.task`).

## Interface

```
var gruntMock = require('gruntMock');
var mock = gruntMock.create({...});
mock.invoke(callback);
mock.okLogs, ...
```

## Supported APIs

...

## Notes

* gruntMock supports both synchronous and asynchronous task execution for testing. gruntMock's invoke method always calls the provided callback asynchronously.
* The format of the files input is [Grunt's array format](http://gruntjs.com/configuring-tasks#files-array-format). [Globbing](http://gruntjs.com/configuring-tasks#globbing-patterns) is not handled by gruntMock because it is outside the scope of testing a Grunt task. Any test input can be provided un-globbed for the same effect.
* gruntMock unconditionally captures and reports verbose/debug output alongside normal log output. Differentiating among normal/verbose/debug output is not currently supported.
* Grunt's `--force` option is not supported; a call to `grunt.warn.fatal` or an unhandled exception always ends the task.

## License

[MIT](LICENSE)
