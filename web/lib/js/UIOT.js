(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["UIOT"] = factory();
	else
		root["UIOT"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 73);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, Promise, global) {var require;/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = __webpack_require__(7);
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));
//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function () {
	function Plugin() {
		_classCallCheck(this, Plugin);

		this.readyFn = [];
	}

	_createClass(Plugin, [{
		key: "needReady",
		value: function needReady() {
			return null;
		}
	}, {
		key: "ready",
		value: function ready(fn) {
			this.readyFn.push(fn);
		}
	}, {
		key: "getReadyFn",
		value: function getReadyFn() {
			return this.readyFn;
		}
	}]);

	return Plugin;
}();

module.exports = Plugin;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckParams = __webpack_require__(5);

var Ready = function (_CheckParams) {
	_inherits(Ready, _CheckParams);

	function Ready() {
		_classCallCheck(this, Ready);

		return _possibleConstructorReturn(this, (Ready.__proto__ || Object.getPrototypeOf(Ready)).apply(this, arguments));
	}

	_createClass(Ready, [{
		key: "register",
		value: function register(hash) {
			this.key = "IOTReady_" + hash + "_" + this.constructor.name;
			return this.key;
		}
	}, {
		key: "dispatch",
		value: function dispatch() {
			var evt = new CustomEvent(this.key);
			window.dispatchEvent(evt);
		}
	}, {
		key: "onReady",
		value: function onReady() {
			return "null";
		}
	}]);

	return Ready;
}(CheckParams);

module.exports = Ready;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheckParams = function CheckParams() {
    _classCallCheck(this, CheckParams);
};

CheckParams.checkKeyExists = function (map) {
    for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        keys[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (!(key in map)) {
                throw new Error(key + ' is undefined');
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

module.exports = CheckParams;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PromiseSequence = __webpack_require__(13);
var CheckParams = __webpack_require__(5);

/**
 * @class
 * Utils
 */

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'getBrowserInfo',
        value: function getBrowserInfo() {
            var userAgent = navigator.userAgent,
                platform = navigator.platform,
                macPlatform = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
                windowsPlatform = ['Win32', 'Win64', 'Windows', 'WinCE'],
                iosPlatform = ['iPhone', 'iPad', 'iPod', 'iPod touch'],
                os = null,
                match = null;

            var result = {
                platform: platform,
                os: os
            };
            if (macPlatform.indexOf(platform) !== -1) {
                match = userAgent.match(/Mac OS X\s+(\d+)\_(\d+)\_?(\d+)?/);
                result.os = 'Mac OS';
            } else if (iosPlatform.indexOf(platform) !== -1) {
                match = userAgent.match(/OS\s+(\d+)\_(\d+)\_?(\d+)?/);
                result.mobile = result.os = 'iOS';
            } else if (windowsPlatform.indexOf(platform) !== -1) {
                result.os = 'Windows';
            } else if (/Android/.test(userAgent)) {
                match = userAgent.match(/Android\s+(\d+)\.(\d+)\.?(\d+)?/);
                result.mobile = result.os = 'Android';
            } else if (/Linux/.test(platform)) {
                result.os = 'Linux';
            }
            if (match) {
                result.version = match[0];
            }
            result.userAgent = userAgent;
            return result;
        }
    }, {
        key: 'toHex',
        value: function toHex(str) {
            var hex = '';
            for (var i = 0; i < str.length; i++) {
                hex += '' + str.charCodeAt(i).toString(16);
            }
            return hex;
        }
    }, {
        key: 'toASCIICode',
        value: function toASCIICode(byteArray) {
            return byteArray.map(function (byte) {
                return String.fromCharCode(byte);
            }).join('');
        }
    }, {
        key: 'sequence',
        value: function sequence() {
            for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
                list[_key] = arguments[_key];
            }

            return PromiseSequence.sequence(list);
        }
    }, {
        key: 'getUrlQuery',
        value: function getUrlQuery(key) {
            var search = window.location.search;
            var parameters = {};
            if (search) {
                var query = search.substring(1).split('&');
                for (var i = 0; i < query.length; i++) {
                    var pair = query[i].split('=');
                    parameters[pair[0]] = pair[1];
                }
                return parameters[key];
            }
        }

        /**
         * 条码扫描
         * @example iot.utils.scanBarcode({
         *     data: {
         *         id: 'bcid'
         *     },
         *     success: (response) => {},
         *     error: (error) => {}
         * });
         * @param {Object} params
         * @param {Object} params.data - 请求参数
         * @param {string} params.data.id - 条码识别控件在Webview窗口的DOM节点的id值
         * @param {Array} [params.data.filters=[0, 1, 2]] - 要识别的条码类型过滤器，为条码类型常量数组，默认情况支持QR、EAN13、EAN8三种类型
         * @param {string} [params.data.styles] - 条码识别控件样式
         * @param {string} [params.data.styles.frameColor] - 扫描框颜色
         * @param {string} [params.data.styles.scanbarColor] - 扫描条颜色
         * @param {string} [params.data.styles.background] - 条码识别控件背景颜色
         * @param {string} [params.data.setFlash] - 是否开启闪光灯，默认为不开启闪光灯
         * @param {function} params.success - 条码扫描成功
         * @param {function} params.error - 条码扫描失败
         */

    }, {
        key: 'scanBarcode',
        value: function scanBarcode(params) {
            var data = params.data;
            CheckParams.checkKeyExists(data, 'id');
            var scan = new plus.barcode.Barcode(data.id, data.filters, data.styles);
            var end = function end() {
                scan.cancel();
                scan.close();
            };
            scan.onmarked = function (type, result) {
                end();
                params.success({
                    code: 0,
                    data: {
                        type: type,
                        result: result
                    }
                });
            };
            scan.onerror = function (error) {
                end();
                params.error(error);
            };
            scan.setFlash(data.setFlash === true);
            scan.start();
            return scan;
        }
    }, {
        key: 'closeScanBarcode',
        value: function closeScanBarcode(barcode) {
            barcode.cancel();
            barcode.close();
        }
    }]);

    return Utils;
}();

module.exports = Utils;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global define */

;(function ($) {
  'use strict'

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn (q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff (a, b, c, d, x, s, t) {
    return md5cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }
  function md5gg (a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }
  function md5hh (a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii (a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | (~d)), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[(((len + 64) >>> 9) << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    var length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    var length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5 (s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5C5C5C5C
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hexTab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0F) +
      hexTab.charAt(x & 0x0F)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5 (s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  function hexMD5 (s) {
    return rstr2hex(rawMD5(s))
  }
  function rawHMACMD5 (k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  function hexHMACMD5 (k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return md5
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
}(this))


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    logConfig: {
        type: ['uploadOperationLog', 'uploadSystemLog', 'uploadDebugLog']
    },
    keys: {
        "uToken": "utoken",
        "USER_INFO": "userinfo",
        "signPerfix": "ugen_iot",
        "groupCache": "IOT_GROUP_CACHE"
    },
    thirdParty: {
        appId: 'wxcc1ee78ae256be1f'
    }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = __webpack_require__(15).EventEmitter;

var BaseEvent = function (_EventEmitter) {
	_inherits(BaseEvent, _EventEmitter);

	function BaseEvent() {
		_classCallCheck(this, BaseEvent);

		return _possibleConstructorReturn(this, (BaseEvent.__proto__ || Object.getPrototypeOf(BaseEvent)).apply(this, arguments));
	}

	_createClass(BaseEvent, [{
		key: 'getEventName',
		value: function getEventName() {
			return this.constructor.name.toUpperCase();
		}
	}, {
		key: 'onEvent',
		value: function onEvent() {}
	}]);

	return BaseEvent;
}(EventEmitter);

module.exports = BaseEvent;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Ugen on 16/12/12.
 */
__webpack_require__(16);
var IOTEvents = __webpack_require__(14);

var NetWork = function NetWork() {
    _classCallCheck(this, NetWork);
};

/**
 *   url 请求url
 *   params:
 *
 */


NetWork.send = function (url, params) {
    var opts = {
        method: 'POST'
    };
    if (params.data) {
        opts.body = params.data;
    }
    if (params.type) {
        opts.method = params.type;
    }
    if (params.headers) {
        opts.headers = params.headers;
        if (opts.headers.Accept == 'application/json') {
            opts.body = JSON.stringify(opts.body);
        }
    }
    if (params.timeout) {
        opts.timeout = params.timeout;
    }
    IOTEvents.getSendMsgObj(IOTEvents.type.NETWORK).beforeSend();
    var fetchPromise = _uFetch(url, opts).then(function (res) {
        IOTEvents.getSendMsgObj(IOTEvents.type.NETWORK).complete();
        if (params.dataType == 'text') return res.text();
        return res.json();
    }).catch(function (err) {
        IOTEvents.getSendMsgObj(IOTEvents.type.NETWORK).complete();
        throw err;
    });
    if (params.success) {
        fetchPromise.then(function (res) {
            params.success(res);
            if (params.complete) params.complete();
        }).catch(function (err) {
            IOTEvents.getSendMsgObj(IOTEvents.type.NETWORK).complete();
            if (params.error) params.error(err);
            if (params.complete) params.complete();
        });
    } else {
        return fetchPromise;
    }
};
//超时
var _uFetch = function _uFetch(url, params) {
    var abort_fn = null;

    var abortPromise = new Promise(function (resolve, reject) {
        abort_fn = function abort_fn() {
            reject({ code: 'timeout' });
        };
    });

    var fetchPromise = new Promise(function (resolve, reject) {
        fetch(url, params).then(checkStatus).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        });
    });

    var abortable_promise = Promise.race([fetchPromise, abortPromise]);
    setTimeout(function () {
        abort_fn();
    }, (params.timeout || 30) * 1000);
    return abortable_promise;
};
//检查请求返回的状态
var checkStatus = function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
};

module.exports = NetWork;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ready = __webpack_require__(3);
var Plugin = __webpack_require__(2);
var md5 = __webpack_require__(8);

var IOTBase = function () {
    function IOTBase() {
        _classCallCheck(this, IOTBase);

        this.readyFn = [];
        this.readyList = [];
        this.pluginList = [];
        this.timeout = setTimeout(function () {
            //window.location.reload();
        }, 4000);
    }

    _createClass(IOTBase, [{
        key: 'loadReady',
        value: function loadReady(items) {
            // console.log('loadReady 2', items);
            if (items instanceof Array) {
                for (var i in items) {
                    this.doLoad(items[i]);
                }
            } else {
                this.doLoad(items);
            }
        }
    }, {
        key: 'loadPlugin',
        value: function loadPlugin(plugin) {
            // console.log('loadPlugin 1', plugin);
            if (plugin instanceof Plugin) {
                this.pluginList.push(plugin);
                // console.log('loadPlugin 1', plugin.needReady());
                this.loadReady(plugin.needReady());
            } else if (plugin instanceof Ready) {
                this.loadReady(plugin);
            } else {
                console.error(plugin.constructor.name + ' is not extend Class Plugin');
            }
        }
    }, {
        key: 'doLoad',
        value: function doLoad(obj) {
            var _this = this;

            // console.log('doLoad 3', obj);
            if (obj instanceof Ready) {
                var key = obj.register(md5(Date.now() + Math.random()).slice(-8));
                // console.log('doLoad 3', key);
                var map = {
                    key: key,
                    isReady: false
                };
                this.readyList.push(map);
                window.addEventListener(key, function () {
                    var readyObj = obj.onReady();
                    // console.log('doLoad 3', readyObj);
                    if (readyObj != null) {
                        obj.obj = readyObj;
                        // console.log('doLoad 3', obj.obj);
                    }
                    _this.updateAndCheck(key);
                }, false);
            } else {
                console.error(obj.constructor.name + ' is not extend Class Ready');
            }
        }
    }, {
        key: 'updateAndCheck',
        value: function updateAndCheck(key) {
            var isReady = true;
            for (var i in this.readyList) {
                var item = this.readyList[i];
                if (item.key == key) {
                    item.isReady = true;
                }
                isReady = isReady && item.isReady;
            }
            if (isReady) {
                clearTimeout(this.timeout);
                for (var _i in this.pluginList) {
                    this.addReadyArray(this.pluginList[_i].getReadyFn());
                }
                for (var _i2 = 0; _i2 < this.readyFn.length; _i2++) {
                    this.readyFn[_i2]();
                }
            }
        }
    }, {
        key: 'ready',
        value: function ready(fn) {
            this.readyFn.push(fn);
        }
    }, {
        key: 'addReadyArray',
        value: function addReadyArray(list) {
            this.readyFn = this.readyFn.concat(list);
        }
    }]);

    return IOTBase;
}();

module.exports = IOTBase;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PromiseSequence = function () {
	function PromiseSequence() {
		_classCallCheck(this, PromiseSequence);
	}

	_createClass(PromiseSequence, null, [{
		key: "sequence",
		value: function sequence() {
			var p = Promise.resolve();

			for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
				list[_key] = arguments[_key];
			}

			for (var i in list[0]) {
				p = PromiseSequence._do(p, list[0][i]);
			}
			return p;
		}
	}, {
		key: "_do",
		value: function _do(p, fn) {
			return p.then(fn).catch(function (err) {
				throw err;
			});
		}
	}]);

	return PromiseSequence;
}();

module.exports = PromiseSequence;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseEvent = __webpack_require__(10);
var EventNetWork = __webpack_require__(17);

var EventManager = function () {
	function EventManager() {
		_classCallCheck(this, EventManager);

		this.type = {};
		this.events = {};
	}

	_createClass(EventManager, [{
		key: 'on',
		value: function on(event, fn) {
			if (event in this.type) {
				this.events[event].onEvent(fn);
			}
		}
	}, {
		key: 'getSendMsgObj',
		value: function getSendMsgObj(event) {
			if (event in this.type) {
				return this.events[event];
			}
			return null;
		}
	}, {
		key: 'loadEvent',
		value: function loadEvent(eventObj) {
			if (eventObj instanceof BaseEvent) {
				var eventName = eventObj.getEventName();
				this.type[eventName] = eventName;
				this.events[eventName] = eventObj;
			} else {
				throw Error(eventObj.constructor.name + ' is not extend Class BaseEvent');
			}
		}
	}]);

	return EventManager;
}();

var event = new EventManager();
event.loadEvent(EventNetWork);

module.exports = event;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseEvent = __webpack_require__(10);

var NetWork = function (_BaseEvent) {
	_inherits(NetWork, _BaseEvent);

	function NetWork() {
		_classCallCheck(this, NetWork);

		return _possibleConstructorReturn(this, (NetWork.__proto__ || Object.getPrototypeOf(NetWork)).apply(this, arguments));
	}

	_createClass(NetWork, [{
		key: 'beforeSend',
		value: function beforeSend(data) {
			this.emit('beforeSend', data);
		}
	}, {
		key: 'complete',
		value: function complete(data) {
			this.emit('complete', data);
		}
	}, {
		key: 'onEvent',
		value: function onEvent(fn) {
			this.on('beforeSend', function (data) {
				fn('beforeSend', data);
			});
			this.on('complete', function (data) {
				fn('complete', data);
			});
		}
	}]);

	return NetWork;
}(BaseEvent);

module.exports = new NetWork();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(41);


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Log.js
 * Version: 0.1
 * User: shz
 * Date: 2017-07-21
 * Copyright(c)  2017. U-GEN Tech.Co,Ltd. All Rights Reserved.
 * Log
 */
var config = __webpack_require__(9);
var NetWork = __webpack_require__(11);

// const Utils = require('../../utils/Utils');

var Log = function () {
    function Log(params) {
        _classCallCheck(this, Log);

        var log = params.plugin.log;
        this.checkKeyExists(params, 'appId');
        this.checkKeyExists(log, 'url');
        this.appId = params.appId;
        this.baseUrl = log.url;
    }

    _createClass(Log, [{
        key: 'upload',
        value: function upload(params) {
            var data = params.data;
            data.cloud_app_id = this.appId;
            // 系统log 调试log 运行环境信息 日志上报类型（1：Android 2：iOS 3：Javascript）
            if (data.environment && data.code_type) {
                this.checkKeyExists(params.data, 'log_type', 'code_type', 'environment', 'title', 'log_data');
                params.interface = config.logConfig.type[data.log_type];
                // 业务log 自定义动作
            } else if (data.action) {
                this.checkKeyExists(params.data, 'log_type', 'action', 'log_data');
                params.interface = config.logConfig.type[0];
            }
            console.log(params);
            this.send(params);
        }
    }, {
        key: 'send',
        value: function send(opts) {
            var params = {};
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            };
            params.headers = headers;
            params.success = function (ret) {
                if (ret.code && ret.code != 0) {
                    opts.error(ret);
                } else {
                    opts.success(ret);
                }
            };
            params.interface = opts.interface;
            params.data = opts.data;
            params.timeout = opts.timeout;
            params.error = opts.error;
            params.complete = opts.complete;
            NetWork.send(this.baseUrl + '/' + params.interface, params);
        }
    }, {
        key: 'checkKeyExists',
        value: function checkKeyExists(map) {
            for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                keys[_key - 1] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    if (!(key in map)) {
                        throw new Error(key + ' is undefined');
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return Log;
}();

module.exports = Log;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = __webpack_require__(2);
var Ready = __webpack_require__(3);
var Utils = __webpack_require__(6);

var Main = function (_Plugin) {
    _inherits(Main, _Plugin);

    function Main(langs, vue, i18n) {
        var isApp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        _classCallCheck(this, Main);

        var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this));

        _this.i18n = new I18NInit(langs, vue, i18n, isApp);
        return _this;
    }

    _createClass(Main, [{
        key: "needReady",
        value: function needReady() {
            var reayd = new Array();
            reayd.push(this.i18n);
            return reayd;
        }
    }]);

    return Main;
}(Plugin);

var I18NInit = function (_Ready) {
    _inherits(I18NInit, _Ready);

    function I18NInit(langs, vue, i18n, isApp) {
        _classCallCheck(this, I18NInit);

        var _this2 = _possibleConstructorReturn(this, (I18NInit.__proto__ || Object.getPrototypeOf(I18NInit)).call(this));

        vue.use(i18n);
        _this2.langs = langs;
        _this2.vue = vue;
        _this2.i18n = i18n;
        // console.log(Utils.getBrowserInfo().mobile);
        // console.log(Utils.getBrowserInfo().mobile != null && isApp);
        if (Utils.getBrowserInfo().mobile != null && isApp) {
            document.addEventListener("plusready", function () {
                // console.log('in plus ready');
                // console.log(plus);
                _this2.getLang();
            }, false);
        } else {
            _this2.getLang();
        }
        return _this2;
    }

    _createClass(I18NInit, [{
        key: "getLang",
        value: function getLang() {
            var _this3 = this;

            var language = navigator.language.toLowerCase();
            language = language.split('-')[0];
            if (this.langs.indexOf(language) == -1) {
                language = this.langs[0];
            }
            this.vue.config.lang = language;
            var path = "resources/lang/" + language + ".json";
            if (window.location.protocol.indexOf("http") > -1) {
                fetch(this.getProjecPath() + path).then(function (res) {
                    return res.json();
                }).then(function (json) {
                    _this3.init(language, json);
                });
            } else {
                plus.io.resolveLocalFileSystemURL("_www/" + path, function (entry) {
                    // 可通过entry对象操作test.html文件
                    entry.file(function (file) {
                        var fileReader = new plus.io.FileReader();
                        fileReader.readAsText(file, 'utf-8');
                        fileReader.onloadend = function (evt) {
                            var json = JSON.parse(evt.target.result);
                            _this3.init(language, json);
                        };
                    });
                }, function (e) {
                    console.error("load file error");
                });
            }
        }
    }, {
        key: "init",
        value: function init(language, json) {
            var _this4 = this;

            this.vue.locale(language, json, function () {
                _this4.vue.config.lang = language;
                _this4.dispatch();
            });
        }
    }, {
        key: "getProjecPath",
        value: function getProjecPath() {
            //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
            var curWwwPath = window.document.location.href;
            //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf("view");
            //获取主机地址，如： http://localhost:8083
            var localhostPaht = curWwwPath.substring(0, pos);
            //获取带"/"的项目名，如：/uimcardprj
            return localhostPaht;
        }
    }]);

    return I18NInit;
}(Ready);

module.exports = Main;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!__webpack_require__(47)()) {
	Object.defineProperty(__webpack_require__(28), 'Symbol',
		{ value: __webpack_require__(49), configurable: true, enumerable: false,
			writable: true });
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PublicStore = function () {
    function PublicStore(tableName) {
        _classCallCheck(this, PublicStore);

        try {
            var WebSqlStore = __webpack_require__(54);
            this.store = new WebSqlStore(tableName);
        } catch (error) {
            var LocalStorageStore = __webpack_require__(52);
            this.store = new LocalStorageStore(tableName);
        }
    }

    _createClass(PublicStore, [{
        key: 'init',
        value: function init() {
            var _this = this;

            return new Promise(function (r, j) {
                r(_this.store.init());
            });
        }
    }]);

    return PublicStore;
}();

module.exports = PublicStore;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var qs = __webpack_require__(45);

var Base = function () {
    function Base() {
        _classCallCheck(this, Base);
    }

    _createClass(Base, [{
        key: "openWindow",
        value: function openWindow(params) {
            var result = qs.stringify(params.extras);
            var p = result != "" ? "?" + result : "";
            window.location.href = "" + params.url + p;
        }
    }, {
        key: "getExtras",
        value: function getExtras() {
            var href = decodeURIComponent(location.search.substr(1, location.search.length - 1));
            var params = href.split("&");
            var map = {};
            for (var item in params) {
                var key = params[item].split("=")[0] || "";
                var value = params[item].split("=")[1] || "";
                map[key] = value;
            }
            return map;
        }
    }, {
        key: "back",
        value: function back() {
            window.history.back();
        }
    }, {
        key: "close",
        value: function close() {
            console.log('iot.navigator.close');
        }
    }, {
        key: "closeOthers",
        value: function closeOthers() {
            console.log('iot.navigator.closeOthers');
        }
    }, {
        key: "backToHomePage",
        value: function backToHomePage() {
            console.log('iot.navigator.backToHomePage');
        }
    }, {
        key: "fire",
        value: function fire() {
            console.log('iot.navigator.fire');
        }
    }]);

    return Base;
}();

module.exports = Base;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

__webpack_require__(21);
var IOTMain = __webpack_require__(51);
var Business = __webpack_require__(66);
var vueI18N = __webpack_require__(20);
var Navigator = __webpack_require__(59);

var IOT = function (_IOTMain) {
    _inherits(IOT, _IOTMain);

    function IOT(params) {
        _classCallCheck(this, IOT);

        var _this = _possibleConstructorReturn(this, (IOT.__proto__ || Object.getPrototypeOf(IOT)).call(this, params));

        var businessPlugin = new Business(params);
        _this.loadPlugin(businessPlugin);
        _this.business = businessPlugin.business;

        var i18n = new vueI18N(params.lang || ["zh"], params.vue, params.i18n, false);
        _this.loadPlugin(i18n);

        // 无ready组件
        _this.navigator = new Navigator(Navigator.type.WEB);
        return _this;
    }

    return IOT;
}(IOTMain);

module.exports = IOT;

/***/ }),
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = new Function("return this")();


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(30)()
	? Object.assign
	: __webpack_require__(31);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys  = __webpack_require__(33)
  , value = __webpack_require__(37)

  , max = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, l = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try { dest[key] = src[key]; } catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < l; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Deprecated



module.exports = function (obj) { return typeof obj === 'function'; };


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(34)()
	? Object.keys
	: __webpack_require__(35);


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) { return false; }
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

module.exports = function (options/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (options == null) return;
		process(Object(options), result);
	});
	return result;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(39)()
	? String.prototype.contains
	: __webpack_require__(40);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return ((str.contains('dwa') === true) && (str.contains('foo') === false));
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(42);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, Promise) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(0)))

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(43);
exports.encode = exports.stringify = __webpack_require__(44);


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign        = __webpack_require__(29)
  , normalizeOpts = __webpack_require__(36)
  , isCallable    = __webpack_require__(32)
  , contains      = __webpack_require__(38)

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ES2015 Symbol polyfill for environments that do not (or partially) support it



var d              = __webpack_require__(46)
  , validateSymbol = __webpack_require__(50)

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isSymbol = __webpack_require__(48);

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(18);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * IOTMain.js
 * Version: 0.1
 * User: shz
 * Date: 2017-07-26
 * Copyright(c)  2017. U-GEN Tech.Co,Ltd. All Rights Reserved.
 * IOTSuper
 */
__webpack_require__(21);
// const error = require('../lib/Error');
var IOTBase = __webpack_require__(12);
var IOTEvents = __webpack_require__(14);
var Log = __webpack_require__(19);
var network = __webpack_require__(11);
var PublicStore = __webpack_require__(22);
var Utils = __webpack_require__(6);
var config = __webpack_require__(9);
var keys = config.keys;

var IOTMain = function (_IOTBase) {
    _inherits(IOTMain, _IOTBase);

    function IOTMain(params) {
        _classCallCheck(this, IOTMain);

        // Log
        var _this = _possibleConstructorReturn(this, (IOTMain.__proto__ || Object.getPrototypeOf(IOTMain)).call(this));

        var log = new Log(params);
        _this.log = log;
        // this.errorHandler(params);
        // 核心功能加载
        _this.utils = Utils;
        var publicStore = new PublicStore("public_storage");
        publicStore.init().then(function (websql) {
            _this.storage = websql;
        });
        _this.network = network;
        _this.event = IOTEvents;
        return _this;
    }

    _createClass(IOTMain, [{
        key: 'errorHandler',
        value: function errorHandler(params) {
            var _this2 = this;

            Error.stackTraceLimit = 1;
            Error.prepareStackTrace = function (error, structuredStackTrace) {
                var trace = structuredStackTrace.map(function (callSite) {
                    return 'source: ' + callSite.getFileName() + '\nlineNo: ' + callSite.getLineNumber() + '\ncolumnNo: ' + callSite.getColumnNumber();
                });
                return trace.join('\n');
            };
            var handle = function _callee(title, log_data) {
                var username, userinfo;
                return _regenerator2.default.async(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                username = null;
                                _context.prev = 1;
                                _context.next = 4;
                                return _regenerator2.default.awrap(_this2.business.websql.getMap(keys.USER_INFO));

                            case 4:
                                userinfo = _context.sent;

                                username = userinfo.username;
                                _context.next = 10;
                                break;

                            case 8:
                                _context.prev = 8;
                                _context.t0 = _context['catch'](1);

                            case 10:
                                _this2.logUpload(username, title, log_data);

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, null, _this2, [[1, 8]]);
            };
            params.vue.config.errorHandler = function (err, vm, info) {
                console.log('vue error handler');
                var title = err.name + ': ' + err.message + ' (' + info + ')';
                var log_data = err.stack;
                handle(title, log_data);
            };
            window.onerror = function _callee2(message, source, lineNo, columnNo, error) {
                var title, log_data;
                return _regenerator2.default.async(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                console.log('window on error');
                                title = message;
                                log_data = 'source: ' + source + '\nlineNo: ' + lineNo + '\ncolumnNo: ' + columnNo;

                                handle(title, log_data);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, null, _this2);
            };
        }
    }, {
        key: 'logUpload',
        value: function logUpload(username, title, log_data) {
            this.log.upload({
                data: {
                    username: username,
                    title: title,
                    log_data: log_data,
                    environment: this.utils.getBrowserInfo(),
                    log_type: 1,
                    code_type: 3
                },
                success: function success(ret) {},
                error: function error(err) {},
                complete: function complete() {}
            });
        }
    }]);

    return IOTMain;
}(IOTBase);

module.exports = IOTMain;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalStorageTool = __webpack_require__(53);

var LocalStorageStore = function () {
    function LocalStorageStore(tableName) {
        _classCallCheck(this, LocalStorageStore);

        console.log('in LocalStorageStore');
        this.tableName = tableName;
        this.tableMap = this.tableName + "_map";
        this.storage = new LocalStorageTool(this.tableMap);
    }

    _createClass(LocalStorageStore, [{
        key: 'init',
        value: function init() {
            return this;
        }
    }, {
        key: 'setMap',
        value: function setMap(key, value, success, error) {
            var _this = this;

            var storagePromise = new Promise(function (resolve, reject) {
                // console.log('key', key);
                // console.log('value', value);
                _this.storage.set(key, value);
                resolve();
            });
            if (success) storagePromise.then(success).catch(error);else return storagePromise;
        }
    }, {
        key: 'setMaps',
        value: function setMaps(list, success, error) {
            var _this2 = this;

            var storagePromise = new Promise(function (resolve, reject) {
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    // console.log('key', item[0]);
                    // console.log('value', item[1]);
                    _this2.storage.set(item[0], item[1]);
                }
                resolve();
            });
            if (success) storagePromise.then(success).catch(error);else return storagePromise;
        }
    }, {
        key: 'getMap',
        value: function getMap(key, success, error) {
            var _this3 = this;

            var storagePromise = new Promise(function (resolve, reject) {
                // console.log('key', key);
                var value = _this3.storage.get(key);
                // console.log('value', value);
                resolve(value);
            });
            if (success) storagePromise.then(success).catch(error);else return storagePromise;
        }
    }, {
        key: 'delMap',
        value: function delMap(key, success, error) {
            var _this4 = this;

            var storagePromise = new Promise(function (resolve, reject) {
                // console.log('key', key);
                _this4.storage.remove(key);
                resolve();
            });
            if (success) storagePromise.then(success).catch(error);else return storagePromise;
        }
    }, {
        key: 'delMaps',
        value: function delMaps(keys, success, error) {
            var _this5 = this;

            var storagePromise = new Promise(function (resolve, reject) {
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    // console.log('key', key);
                    _this5.storage.remove(key);
                }
                resolve();
            });
            if (success) storagePromise.then(success).catch(error);else return storagePromise;
        }
    }]);

    return LocalStorageStore;
}();

module.exports = LocalStorageStore;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalStorageTool = function () {
    function LocalStorageTool(table) {
        _classCallCheck(this, LocalStorageTool);

        this.storage = window.localStorage;
        this.table = table;
        this.parameter = this.table + "_parameter";
        if (this.get(this.parameter) == null) {
            this.set(this.parameter, {});
        }
    }

    _createClass(LocalStorageTool, [{
        key: "get",
        value: function get(key) {
            var value = void 0;
            var type = void 0;
            if (key === this.parameter) {
                value = this.storage.getItem(key);
                type = "object";
            } else {
                value = this.storage.getItem(this.table + "_" + key);
                var parameter = this.get(this.parameter);
                type = parameter[key];
            }
            switch (type) {
                case "object":
                    value = JSON.parse(value);
                    break;
                case "number":
                    value = parseFloat(value);
                    break;
                case "boolean":
                    value = value === 'true';
                    break;
            }
            return value;
        }
    }, {
        key: "set",
        value: function set(key, value) {
            var type = typeof value === "undefined" ? "undefined" : _typeof(value);
            if (type === "object") {
                value = JSON.stringify(value);
            } else {
                value = value.toString();
            }
            if (key === this.parameter) {
                this.storage.setItem(key, value);
            } else {
                this.storage.setItem(this.table + "_" + key, value);
                var parameter = this.get(this.parameter);
                parameter[key] = type;
                this.set(this.parameter, parameter);
            }
        }
    }, {
        key: "remove",
        value: function remove(key) {
            this.storage.removeItem(this.table + "_" + key);
            var parameter = this.get(this.parameter);
            delete parameter[key];
            this.set(this.parameter, parameter);
        }
    }]);

    return LocalStorageTool;
}();

module.exports = LocalStorageTool;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

var _regenerator = __webpack_require__(18);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSqlTool = __webpack_require__(55);
var websql = new WebSqlTool('UIOT', '1.0', 'ugen', 1024 * 1024 * 5);

var WebSqlStore = function () {
    function WebSqlStore(tableName) {
        _classCallCheck(this, WebSqlStore);

        console.log('in WebSqlStore');
        this.tableName = tableName;
        this.tableMap = this.tableName + "_map";
        this.tableList = this.tableName + "_list";
        this.tabelSqlMap = 'CREATE TABLE IF NOT EXISTS ' + this.tableMap + ' (key TEXT unique, value TEXT, type TEXT);';
        this.tabelSqlList = 'CREATE TABLE IF NOT EXISTS ' + this.tableList + ' (i TEXT, value TEXT, key_group TEXT, type TEXT, unique(value, key_group));';
        // this.createListIndex = `CREATE INDEX IF NOT EXISTS b on ${this.tableList} (value, key_group);`;
    }

    _createClass(WebSqlStore, [{
        key: 'init',
        value: function init() {
            var _this = this;

            return new Promise(function (r, j) {
                websql.dbQuery(function () {
                    r(_this);
                }, function (err) {
                    j(err);
                }, _this.tabelSqlMap, _this.tabelSqlList);
            });
        }
    }, {
        key: 'setMap',
        value: function setMap(key, value, success, error) {
            var type = "String";
            if (value instanceof Object) {
                type = "Object";
                value = JSON.stringify(value);
            } else if (typeof value == "number") {
                type = "Number";
                value = value.toString();
            }
            var sql = 'INSERT OR REPLACE INTO ' + this.tableMap + ' VALUES (?,?,?);';
            var sqlPromise = websql.dbExec(sql, [key, value, type]);
            if (success) sqlPromise.then(success).catch(error);else return sqlPromise;
        }
    }, {
        key: 'setMaps',
        value: function setMaps(list, success, error) {
            var sql = 'INSERT OR REPLACE INTO ' + this.tableMap + ' ';
            var values = "";
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var item = list[i];
                var type = "String";
                var value = item[1];
                if (value instanceof Object) {
                    type = "Object";
                    value = JSON.stringify(value);
                } else if (typeof value == "number") {
                    type = "Number";
                    value = value.toString();
                }
                if (values != "") values += " UNION ALL ";
                values += 'select \'' + item[0] + '\' AS \'key\',\'' + value + '\' AS \'value\',\'' + type + '\' as \'type\'';
            }
            sql += values;
            var sqlPromise = websql.dbExec(sql);
            if (success) sqlPromise.then(success).catch(error);else return sqlPromise;
        }
    }, {
        key: 'getMap',
        value: function getMap(key, success, error) {
            var sql = 'select * from ' + this.tableMap + '};';
            var params = [];
            if (key != "*") {
                sql = 'select value,type from ' + this.tableMap + ' where key = ?;';
                params.push(key);
            }
            var formatResult = function formatResult(res) {
                var result = null;
                if (res.rows.length > 0) {
                    result = res.rows.item(0).value;
                    var type = res.rows.item(0).type;
                    if (type == "Object") {
                        result = JSON.parse(result);
                    } else if (type == "Number") {
                        result = parseFloat(result);
                    }
                }
                return result;
            };
            var formatSuccess = function formatSuccess(res) {
                success(formatResult(res));
            };
            var sqlPromise = websql.dbExec(sql, params);
            if (success) sqlPromise.then(formatSuccess).catch(error);else return new Promise(function (r, j) {
                sqlPromise.then(function (res) {
                    r(formatResult(res));
                }).catch(function (e) {
                    j(e);
                });
            });
        }
    }, {
        key: 'add',
        value: function add(group, item, success, error) {
            if (success) this.addList(group, [item], success, error);else return this.addList(group, [item]);
        }
    }, {
        key: 'addList',
        value: function addList(group, list, success, error) {
            var sql, getLastId, valuse, length, i, item, type, sqlPromise;
            return _regenerator2.default.async(function addList$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(group == null)) {
                                _context.next = 3;
                                break;
                            }

                            error("group is null");
                            return _context.abrupt('return');

                        case 3:
                            sql = 'INSERT OR REPLACE INTO ' + this.tableList + ' ';
                            getLastId = 0;
                            /* let getLastIdSql = `select i from ${this.tableList} where key_group = '${group}' order by CAST(i AS INTEGER) desc limit 1`;
                             let res = await websql.dbExec(getLastIdSql);
                             if (res.rows.length > 0) {
                                 getLastId = res.rows.item(0).i;
                                 getLastId++;
                             }*/

                            valuse = "";
                            length = list.length;

                            for (i = 0; i < length; i++) {
                                item = list[i];
                                type = "String";

                                if (item instanceof Object) {
                                    type = "Object";
                                    item = JSON.stringify(item);
                                }
                                if (valuse != "") {
                                    valuse += " UNION ALL ";
                                }
                                valuse += 'select \'' + getLastId + '\' AS \'i\',\'' + item + '\' AS \'value\',\'' + group + '\' AS \'key_group\',\'' + type + '\' as \'type\'';
                                // getLastId++;
                                // valuse += `select '${item}' AS 'value','${group}' AS 'key_group','${type}' as 'type'`;
                            }
                            sql += valuse;
                            sqlPromise = websql.dbExec(sql);

                            if (!success) {
                                _context.next = 14;
                                break;
                            }

                            sqlPromise.then(success).catch(error);
                            _context.next = 15;
                            break;

                        case 14:
                            return _context.abrupt('return', sqlPromise);

                        case 15:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'getList',
        value: function getList(group, success, error) {
            var sql = 'select rowid,value,type from ' + this.tableList + ' where key_group = ?;';
            var params = [group];
            var formatResult = function formatResult(res) {
                var resultList = [];
                var length = res.rows.length;
                for (var i = 0; i < length; i++) {
                    var index = res.rows.item(i).rowid;
                    var value = res.rows.item(i).value;
                    var type = res.rows.item(i).type;
                    if (type == "Object") {
                        value = JSON.parse(value);
                    }
                    var map = {
                        index: index,
                        value: value
                    };
                    resultList.push(map);
                }
                return resultList;
            };
            var formatSuccess = function formatSuccess(res) {
                success(formatResult(res));
            };
            var sqlPromise = websql.dbExec(sql, params);
            if (success) sqlPromise.then(formatSuccess).catch(error);else return new Promise(function (r, j) {
                sqlPromise.then(function (res) {
                    r(formatResult(res));
                }).catch(function (e) {
                    j(e);
                });
            });
        }
    }, {
        key: 'delList',
        value: function delList(group, success, error) {
            var sqlPromise = websql.dbExec('delete from ' + this.tableList + ' where key_group = ?;', [group]);
            if (success) sqlPromise.then(success).catch(error);else return sqlPromise;
        }
    }, {
        key: 'editListByIndex',
        value: function editListByIndex(group, index, item, success, error) {
            var type = "String";
            if (item instanceof Object) {
                type = "Object";
                item = JSON.stringify(item);
            }
            var sqlPromise = websql.dbExec('update ' + this.tableList + ' set value = ?,type = ? where key_group = ? and rowid = ?;', [item, type, group, index.toString()]);
            if (success) sqlPromise.then(success).catch(error);else return sqlPromise;
        }
    }, {
        key: 'delListByIndex',
        value: function delListByIndex(group, index, success, error) {
            var sqlPromise = websql.dbExec('delete from ' + this.tableList + ' where key_group = ? and rowid = ?;', [group, index.toString()]);
            if (success) sqlPromise.then(success).catch(error);else return sqlPromise;
        }
    }, {
        key: 'delMap',
        value: function delMap(key, success, error) {
            var sqlPromise = websql.dbExec('delete from ' + this.tableMap + ' where key = ?;', [key]);
            if (success) sqlPromise.then(success).catch(error);else return sqlPromise;
        }
    }, {
        key: 'delMaps',
        value: function delMaps(keys, success, error) {
            var keyStr = "";
            for (var i = 0; i < keys.length; i++) {
                if (keyStr != "") {
                    keyStr += ",";
                }
                keyStr += '?';
            }
            var sql = 'delete from ' + this.tableMap + ' where key in (' + keyStr + ');';
            var sqlPromise = websql.dbExec(sql, keys);
            if (success) sqlPromise.then(success).catch(error);else return sqlPromise;
        }
    }]);

    return WebSqlStore;
}();

module.exports = WebSqlStore;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

var _regenerator = __webpack_require__(18);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSqlTool = function () {
    function WebSqlTool(dbName, ver, description, size) {
        _classCallCheck(this, WebSqlTool);

        this.db = openDatabase(dbName, ver, description, size);
    }

    _createClass(WebSqlTool, [{
        key: "getTx",
        value: function getTx() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.db.transaction(function (tx) {
                    resolve(tx);
                });
            });
        }
    }, {
        key: "dbExec",
        value: function dbExec(sql, param) {
            var tx;
            return _regenerator2.default.async(function dbExec$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return _regenerator2.default.awrap(this.getTx());

                        case 2:
                            tx = _context.sent;
                            return _context.abrupt("return", new Promise(function (resolve, reject) {
                                tx.executeSql(sql, param, function (t, result) {
                                    resolve(result);
                                }, function (t, result) {
                                    reject(result);
                                });
                            }));

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: "dbQuery",
        value: function dbQuery(success, error) {
            var promiseList = [];

            for (var _len = arguments.length, sql = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                sql[_key - 2] = arguments[_key];
            }

            for (var i in sql) {
                var promiseSql = this.dbExec(sql[i]);
                promiseList.push(promiseSql);
            }
            Promise.all(promiseList).then(success).catch(error);
        }
    }]);

    return WebSqlTool;
}();

module.exports = WebSqlTool;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = __webpack_require__(6);
var Web = __webpack_require__(61);
var App = __webpack_require__(60);

var Loader = function Loader(type) {
    _classCallCheck(this, Loader);

    if (type == Loader.type.DEBUG) {
        if (Utils.getBrowserInfo().mobile == null) {
            return new Web();
        } else {
            return new App();
        }
    } else if (type == Loader.type.WEB) {
        return new Web();
    } else {
        return new App();
    }
};

Loader.type = {
    DEBUG: 'DEBUG',
    RELEASE: 'RELEASE',
    WEB: 'WEB'
};

module.exports = Loader;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = __webpack_require__(23);

var App = function (_Base) {
    _inherits(App, _Base);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        _this.backTime = null;
        return _this;
    }

    _createClass(App, [{
        key: 'openWindow',
        value: function openWindow(params) {
            var wv = plus.webview.create(params.url, params.id, { styles: params.styles || {} }, { IOTData: params.extras });
            wv.show('slide-in-right');
        }
    }, {
        key: 'getExtras',
        value: function getExtras() {
            var wv = plus.webview.currentWebview();
            return wv.IOTData || {};
        }
    }, {
        key: 'onBackEvent',
        value: function onBackEvent() {
            var _this2 = this;

            switch (plus.os.name) {
                case 'Android':
                    plus.key.addEventListener('backbutton', function () {
                        _this2.backEvent();
                    }, false);
                    break;
                case 'iOS':
                    break;
            }
        }
    }, {
        key: 'backEvent',
        value: function backEvent() {
            var _this3 = this;

            var wvs = plus.webview.all();
            if (wvs.length > 1) {
                this.back();
            } else {
                var wv = plus.webview.currentWebview();
                wv.canBack(function (e) {
                    if (e.canBack) {
                        window.history.back();
                    } else {
                        if (!_this3.backTime) {
                            _this3.backTime = new Date().getTime();
                            plus.nativeUI.toast('再按一次退出应用');
                            setTimeout(function () {
                                _this3.backTime = null;
                            }, 2000);
                        } else {
                            if (new Date().getTime() - _this3.backTime < 2000) {
                                plus.runtime.quit();
                            }
                        }
                    }
                });
            }
        }
    }, {
        key: 'back',
        value: function back() {
            var wv = plus.webview.currentWebview();
            wv.close();
        }
    }, {
        key: 'close',
        value: function close() {
            for (var _len = arguments.length, wvs = Array(_len), _key = 0; _key < _len; _key++) {
                wvs[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = wvs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var wv = _step.value;

                    plus.webview.close(wv);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'closeOthers',
        value: function closeOthers() {
            var wvs = plus.webview.all();
            var currentWv = plus.webview.currentWebview();
            for (var i = 0; i < wvs.length; i++) {
                if (wvs[i] != currentWv) {
                    wvs[i].close();
                }
            }
        }
    }, {
        key: 'backToHomePage',
        value: function backToHomePage() {
            var wvs = plus.webview.all();
            var homepage = plus.webview.getWebviewById('homepage');
            for (var i = 0; i < wvs.length; i++) {
                if (wvs[i] != homepage) {
                    wvs[i].close();
                }
            }
        }
    }, {
        key: 'fire',
        value: function fire(webview, eventType, data) {
            if (webview) {
                if (typeof data === 'undefined') {
                    data = '';
                } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
                    data = JSON.stringify(data || {}).replace(/\'/g, '\\u0027').replace(/\\/g, '\\u005c');
                }
                webview.evalJS('iot.navigator.receive("' + eventType + '","' + data + '")');
            }
        }
    }, {
        key: 'receive',
        value: function receive(eventType, data) {
            if (eventType) {
                try {
                    if (data && typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                } catch (e) {}
                this.trigger(document, eventType, data);
            }
        }
    }, {
        key: 'trigger',
        value: function trigger(element, eventType, eventData) {
            element.dispatchEvent(new CustomEvent(eventType, {
                detail: eventData,
                bubbles: true,
                cancelable: true
            }));
            return this;
        }
    }]);

    return App;
}(Base);

module.exports = App;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = __webpack_require__(23);

var Web = function (_Base) {
    _inherits(Web, _Base);

    function Web() {
        _classCallCheck(this, Web);

        return _possibleConstructorReturn(this, (Web.__proto__ || Object.getPrototypeOf(Web)).call(this));
    }

    return Web;
}(Base);

module.exports = Web;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Device = function () {
    function Device(business) {
        _classCallCheck(this, Device);

        this.business = business;
    }

    // 1 获取设备列表


    _createClass(Device, [{
        key: "getList",
        value: function getList(params) {
            var data = {
                product_id: params.data.product_id,
                parent_id: params.data.parent_id,
                start_id: params.data.start_id,
                number: params.data.number
            };
            var opts = {
                data: data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.business.api.getList(opts);
        }

        // 2 获取设备详情

    }, {
        key: "getInfo",
        value: function getInfo(params) {
            var data = {
                device_id: params.data.device_id
            };
            var opts = {
                data: data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.business.api.getDeviceInfo(opts);
        }

        // 3 获取设备所绑定的用户列表（管理员）

    }, {
        key: "getUsers",
        value: function getUsers(params) {
            var data = {
                device_id: params.data.device_id
            };
            var opts = {
                data: data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.business.api.getUsers(opts);
        }

        // 4 修改设备名称（管理员）

    }, {
        key: "setName",
        value: function setName(params) {
            var data = {
                device_id: params.data.device_id,
                device_name: params.data.device_name
            };
            var opts = {
                data: data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.business.api.setName(opts);
        }

        // 5 修改设备昵称

    }, {
        key: "setNickname",
        value: function setNickname(params) {
            var data = {
                device_id: params.data.device_id,
                nickname: params.data.nickname
            };
            var opts = {
                data: data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.business.api.setNickname(opts);
        }

        // 6 设置设备用户权限（管理员）

        // 7 绑定设备

    }, {
        key: "bind",
        value: function bind(params) {
            var data = {
                device_id: params.data.device_id,
                product_id: params.data.product_id,
                nickname: params.data.nickname,
                mac: params.data.mac
            };
            var opts = {
                data: data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.business.api.bind(opts);
        }

        // 8 扫码绑定

        // 9 用户解绑设备

    }, {
        key: "unbind",
        value: function unbind(params) {
            var data = {
                device_id: params.data.device_id
            };
            var opts = {
                data: data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.business.api.unbind(opts);
        }

        // 10 （管理员）删除设备用户

    }, {
        key: "removeUser",
        value: function removeUser(params) {
            var data = {
                device_id: params.data.device_id,
                user_id: params.data.user_id
            };
            var opts = {
                data: data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.business.api.removeUser(opts);
        }
    }, {
        key: "uploadBleData",
        value: function uploadBleData(params) {
            var opts = {
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.business.api.uploadBleData(opts);
        }
    }]);

    return Device;
}();

module.exports = Device;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(18);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = __webpack_require__(9);
var keys = config.keys;

var User = function () {
    function User(business) {
        _classCallCheck(this, User);

        this.business = business;
    }

    // 1 用户注册


    _createClass(User, [{
        key: 'reg',
        value: function reg(params) {
            var _this = this;

            var data = {
                username: params.data.username,
                pwd: params.data.pwd,
                vcode: params.data.vcode
            };
            var opts = {
                data: data,
                success: function success(ret) {
                    return _regenerator2.default.async(function success$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;

                                    if (!(ret.data.utoken.length !== 0)) {
                                        _context.next = 8;
                                        break;
                                    }

                                    _context.next = 4;
                                    return _regenerator2.default.awrap(_this.business.websql.setMap(keys.uToken, ret.data.utoken));

                                case 4:
                                    _this.business.setToken(ret.data.utoken);
                                    params.success(ret);
                                    _context.next = 9;
                                    break;

                                case 8:
                                    params.error();

                                case 9:
                                    _context.next = 14;
                                    break;

                                case 11:
                                    _context.prev = 11;
                                    _context.t0 = _context['catch'](0);

                                    params.error(_context.t0);

                                case 14:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, null, _this, [[0, 11]]);
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.reg(opts);
        }

        // 2 用户登录

    }, {
        key: 'login',
        value: function login(params) {
            var _this2 = this;

            var data = {
                username: params.data.username,
                pwd: params.data.pwd
            };
            var opts = {
                data: data,
                success: function success(ret) {
                    _this2.handleLoginSuccess(params, ret);
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.login(opts);
        }
    }, {
        key: 'thirdLogin',
        value: function thirdLogin(params) {
            var _this3 = this;

            var opts = {
                data: params.data,
                success: function success(ret) {
                    return _regenerator2.default.async(function success$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _this3.handleLoginSuccess(params, ret);

                                case 1:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, null, _this3);
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.thirdLogin(opts);
        }
    }, {
        key: 'simpleLogin',
        value: function simpleLogin(params) {
            var _this4 = this;

            var opts = {
                data: params.data,
                success: function success(ret) {
                    _this4.handleLoginSuccess(params, ret);
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.simpleLogin(opts);
        }

        // 3 自动登录

    }, {
        key: 'autoLogin',
        value: function autoLogin(params) {
            var _this5 = this;

            var data = {};
            var opts = {
                data: data,
                success: function success(ret) {
                    return _regenerator2.default.async(function success$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _context3.prev = 0;

                                    if (!(ret.data.utoken.length !== 0)) {
                                        _context3.next = 8;
                                        break;
                                    }

                                    _context3.next = 4;
                                    return _regenerator2.default.awrap(_this5.business.websql.setMap(keys.uToken, ret.data.utoken));

                                case 4:
                                    _this5.business.setToken(ret.data.utoken);
                                    params.success(ret);
                                    _context3.next = 9;
                                    break;

                                case 8:
                                    params.error();

                                case 9:
                                    _context3.next = 14;
                                    break;

                                case 11:
                                    _context3.prev = 11;
                                    _context3.t0 = _context3['catch'](0);

                                    params.error(_context3.t0);

                                case 14:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, null, _this5, [[0, 11]]);
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.autoLogin(opts);
        }

        // 4 忘记密码

    }, {
        key: 'resetPwd',
        value: function resetPwd(params) {
            // username
            // pwd
            // vcode
            this.business.api.resetPwd(params);
        }

        // 5 修改密码

    }, {
        key: 'setPwd',
        value: function setPwd(params) {
            // old_pwd
            // new_pwd
            this.business.api.setPwd(params);
        }

        // 6 设置用户信息

    }, {
        key: 'setInfo',
        value: function setInfo(params) {
            // nickname
            // head
            // info
            this.business.api.setInfo(params);
        }

        // 7 获取用户信息

    }, {
        key: 'getInfo',
        value: function getInfo(params) {
            var data = {};
            var opts = {
                data: data,
                success: function success(ret) {
                    if (ret.code && ret.code != 0) {
                        params.error(ret);
                    } else {
                        params.success(ret);
                    }
                },
                error: function error(err) {
                    params.error(err);
                },
                complete: function complete() {
                    params.complete();
                }
            };
            this.business.api.getUserInfo(params);
        }
    }, {
        key: 'setUserDeviceInfo',
        value: function setUserDeviceInfo(params) {
            // device_id
            // info
            this.business.api.setUserDeviceInfo(params);
        }
    }, {
        key: 'getUserDeviceInfo',
        value: function getUserDeviceInfo(params) {
            // device_id
            this.business.api.getUserDeviceInfo(params);
        }

        // 退出登录 清空数据

    }, {
        key: 'logout',
        value: function logout(params) {
            this.business.websql.delMaps([keys.uToken, keys.USER_INFO], function () {
                params.success();
            }, function (error) {
                console.log(error);
                params.error('logout error');
            });
        }
    }, {
        key: 'handleLoginSuccess',
        value: function handleLoginSuccess(params, response) {
            var data, infoArray;
            return _regenerator2.default.async(function handleLoginSuccess$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            data = response.data;

                            if (!(data.utoken.length !== 0)) {
                                _context4.next = 12;
                                break;
                            }

                            infoArray = [];

                            infoArray.push([keys.uToken, data.utoken]);
                            infoArray.push([keys.USER_INFO, data]);
                            _context4.next = 8;
                            return _regenerator2.default.awrap(this.business.websql.setMaps(infoArray));

                        case 8:
                            this.business.setToken(data.utoken);
                            params.success(response);
                            _context4.next = 13;
                            break;

                        case 12:
                            params.error();

                        case 13:
                            _context4.next = 18;
                            break;

                        case 15:
                            _context4.prev = 15;
                            _context4.t0 = _context4['catch'](0);

                            params.error(_context4.t0);

                        case 18:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, null, this, [[0, 15]]);
        }
    }]);

    return User;
}();

module.exports = User;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var md5 = __webpack_require__(8);
var config = __webpack_require__(9);
var keys = config.keys;
var NetWork = __webpack_require__(11);

var CloudAPI = function () {
    function CloudAPI(params) {
        _classCallCheck(this, CloudAPI);

        var cloud = params.cloud;
        this.checkKeyExists(params, 'appId');
        this.checkKeyExists(params, 'appSecret');
        this.checkKeyExists(cloud, 'url');
        this.appId = params.appId;
        this.appSecret = params.appSecret;
        this.baseUrl = cloud.url;
    }

    _createClass(CloudAPI, [{
        key: 'setToken',
        value: function setToken(token) {
            this.token = token;
        }
    }, {
        key: 'checkKeyExists',
        value: function checkKeyExists(map) {
            for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                keys[_key - 1] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    if (!(key in map)) {
                        var msg = key + ' is undefined';
                        console.log(msg);
                        throw new Error(msg);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'md5Hash',
        value: function md5Hash(value) {
            var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            return md5(value, key + keys.signPerfix);
        }
    }, {
        key: 'createSign',
        value: function createSign(time) {
            return md5(this.appId + this.appSecret + time);
        }

        // User
        // 1 用户注册

    }, {
        key: 'reg',
        value: function reg(params) {
            this.checkKeyExists(params.data, 'username', 'pwd', 'vcode');
            params.data.pwd = this.md5Hash(params.data.pwd);
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/reg', opts, false);
        }

        // 2 用户登录

    }, {
        key: 'login',
        value: function login(params) {
            this.checkKeyExists(params.data, 'username', 'pwd');
            params.data.pwd = this.md5Hash(params.data.pwd);
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/login', opts, false);
        }
    }, {
        key: 'thirdLogin',
        value: function thirdLogin(params) {
            this.checkKeyExists(params.data, 'type');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/thirdLogin', opts, false);
        }
    }, {
        key: 'simpleLogin',
        value: function simpleLogin(params) {
            this.checkKeyExists(params.data, 'username');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/login_simple', opts, false);
        }

        // 3 自动登录

    }, {
        key: 'autoLogin',
        value: function autoLogin(params) {
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/verLogin', opts);
        }

        // 4 忘记密码

    }, {
        key: 'resetPwd',
        value: function resetPwd(params) {
            this.checkKeyExists(params.data, 'username', 'pwd', 'vcode');
            params.data.pwd = this.md5Hash(params.data.pwd);
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/resetPwd', opts, false);
        }

        // 5 修改密码

    }, {
        key: 'setPwd',
        value: function setPwd(params) {
            this.checkKeyExists(params.data, 'old_pwd', 'new_pwd');
            params.data.old_pwd = this.md5Hash(params.data.old_pwd);
            params.data.new_pwd = this.md5Hash(params.data.new_pwd);
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/setPwd', opts);
        }

        // 6 设置用户信息

    }, {
        key: 'setInfo',
        value: function setInfo(params) {
            this.checkKeyExists(params.data, 'nickname', 'head');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/setInfo', opts);
        }

        // 7 获取用户信息

    }, {
        key: 'getUserInfo',
        value: function getUserInfo(params) {
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/getInfo', opts);
        }
    }, {
        key: 'setUserDeviceInfo',
        value: function setUserDeviceInfo(params) {
            this.checkKeyExists(params.data, 'device_id', 'info');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/setUserDeviceInfo', opts);
        }
    }, {
        key: 'getUserDeviceInfo',
        value: function getUserDeviceInfo(params) {
            this.checkKeyExists(params.data, 'device_id');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('user/getUserDeviceInfo', opts);
        }
    }, {
        key: 'wxLogin',
        value: function wxLogin(params) {
            this.checkKeyExists(params.data, 'code');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('wx/login', opts, false);
        }
    }, {
        key: 'wxSignature',
        value: function wxSignature(params) {
            this.checkKeyExists(params.data, 'url');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('wx/getSign', opts);
        }
    }, {
        key: 'wxBindDevice',
        value: function wxBindDevice(params) {
            this.checkKeyExists(params.data, 'deviceId', 'ticket');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('wx/bindDevice', opts);
        }
    }, {
        key: 'wxUnbindDevice',
        value: function wxUnbindDevice(params) {
            this.checkKeyExists(params.data, 'deviceId', 'ticket');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('wx/unbindDevice', opts);
        }

        // Device
        // 1 获取设备列表

    }, {
        key: 'getList',
        value: function getList(params) {
            this.checkKeyExists(params.data, 'product_id', 'start_id', 'number');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('device/getList', opts);
        }

        // 2 获取设备详情

    }, {
        key: 'getDeviceInfo',
        value: function getDeviceInfo(params) {
            this.checkKeyExists(params.data, 'device_id');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('device/getInfo', opts);
        }

        // 3 获取设备所绑定的用户列表（管理员）

    }, {
        key: 'getUsers',
        value: function getUsers(params) {
            this.checkKeyExists(params.data, 'device_id');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('device/getUsers', opts);
        }

        // 4 修改设备名称（管理员）

    }, {
        key: 'setName',
        value: function setName(params) {
            this.checkKeyExists(params.data, 'device_id', 'device_name');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('device/setName', opts);
        }

        // 5 修改设备昵称

    }, {
        key: 'setNickname',
        value: function setNickname(params) {
            this.checkKeyExists(params.data, 'device_id', 'nickname');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('device/setNickname', opts);
        }

        // 6 设置设备用户权限（管理员）

        // 7 绑定设备

    }, {
        key: 'bind',
        value: function bind(params) {
            var data = params.data;
            this.checkKeyExists(data, 'product_id');
            if (data['device_id'] || data['mac']) {
                var opts = {
                    type: 'post',
                    data: data,
                    success: params.success,
                    error: params.error,
                    complete: params.complete
                };
                this.send('device/bind', opts);
            } else {
                throw new ParamsError('device_id or mac must exist at least one');
            }
        }

        // 8 扫码绑定

        // 9 用户解绑设备

    }, {
        key: 'unbind',
        value: function unbind(params) {
            this.checkKeyExists(params.data, 'device_id');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('device/unbind', opts);
        }

        // 10 （管理员）删除设备用户

    }, {
        key: 'removeUser',
        value: function removeUser(params) {
            this.checkKeyExists(params.data, 'device_id', 'user_id');
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('device/removeUser', opts);
        }
    }, {
        key: 'uploadBleData',
        value: function uploadBleData(params) {
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send('device/' + this.appId, opts);
        }
    }, {
        key: 'sendCustom',
        value: function sendCustom(url, opts) {
            var needAuth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var isDebug = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            this.send(url, opts, needAuth, false, isDebug);
        }
    }, {
        key: 'sendLoop',
        value: function sendLoop(url, opts) {
            var _this = this;

            var needAuth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;

            var params = _extends({}, opts);
            var loop = function loop() {
                var handle = setTimeout(function () {
                    _this.sendLoop(url, opts, needAuth, delay);
                    window.clearTimeout(handle);
                }, delay * 1000);
            };
            params.success = function (ret) {
                if (opts.success(ret) === false) {
                    return;
                }
                loop();
            };
            params.error = function (err) {
                if (opts.error(err) === false) {
                    return;
                }
                loop();
            };
            this.send(url, params, needAuth, false);
        }
    }, {
        key: 'send',
        value: function send(url, opts) {
            var needAuth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var isPublic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
            var isDebug = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            // if (this.token == null && needAuth) {
            //     if (opts.error) {
            //         opts.error('please login first.');
            //     }
            // } else {
                var params = {};
                var headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8'
                };
                if (needAuth) {
                    headers['authorization'] = 'JWT ' + this.token;
                }
                params.headers = headers;
                params.data = opts.data;
                if (window.iotDebug) {
                    iotDebug.push('start: ' + url);
                }
                params.success = function (ret) {
                    if (ret.code && ret.code != 0) {
                        opts.error(ret);
                    } else {
                        if (window.iotDebug) {
                            iotDebug.push('end: ' + url);
                        }
                        opts.success(ret);
                    }
                };
                params.error = function (err) {
                    if (window.iotDebug) {
                        iotDebug.push('end: ' + url);
                    }
                    opts.error(err);
                };
                // params.error = opts.error;
                params.complete = opts.complete;
                params.timeout = opts.timeout;
                var time = Date.now();
                var sign = this.createSign(time);
                var requestUrl = '';
                if (isDebug) {
                    params.type = 'GET';
                    console.log(params.data);
                    params.data = null;
                    requestUrl = url;
                } else {
                    requestUrl = this.baseUrl + '/openapi/' + (isPublic ? 'public' : 'custom') + '/' + this.appId + '/' + url + '?sign=' + sign + '&time=' + time;
                }
                NetWork.send(requestUrl, params);
            }
        // }
    }]);

    return CloudAPI;
}();

module.exports = CloudAPI;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ready = __webpack_require__(3);
var CloudAPI = __webpack_require__(64);
var PublicStore = __webpack_require__(22);
var config = __webpack_require__(9);
var keys = config.keys;

var BusinessReady = function (_Ready) {
    _inherits(BusinessReady, _Ready);

    function BusinessReady(params) {
        _classCallCheck(this, BusinessReady);

        var _this = _possibleConstructorReturn(this, (BusinessReady.__proto__ || Object.getPrototypeOf(BusinessReady)).call(this));

        _this.tableName = 'bus_storage';
        _this.uToken = null;
        _this.api = new CloudAPI(params);
        var storage = _this.initStorage();
        storage.then(function (websql) {
            _this.websql = websql;
            _this.websql.getMap(keys.uToken, function (result) {
                _this.setToken(result);
                _this.dispatch();
            }, function (err) {
                console.log(err);
            });
        }).catch(function (err) {
            console.log(err);
        });
        return _this;
    }

    _createClass(BusinessReady, [{
        key: 'getToken',
        value: function getToken() {
            return this.uToken;
        }
    }, {
        key: 'setToken',
        value: function setToken(token) {
            this.uToken = token;
            this.api.setToken(token);
        }
    }, {
        key: 'initStorage',
        value: function initStorage() {
            var store = new PublicStore(this.tableName);
            return store.init();
        }
    }, {
        key: 'onReady',
        value: function onReady() {
            return this;
        }
    }]);

    return BusinessReady;
}(Ready);

module.exports = BusinessReady;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = __webpack_require__(2);
var Bridge = __webpack_require__(65);
var User = __webpack_require__(68);
var Device = __webpack_require__(67);

var WXBusiness = function (_Plugin) {
    _inherits(WXBusiness, _Plugin);

    function WXBusiness(params) {
        _classCallCheck(this, WXBusiness);

        var _this = _possibleConstructorReturn(this, (WXBusiness.__proto__ || Object.getPrototypeOf(WXBusiness)).call(this));

        _this.business = new Bridge(params);
        var wx = params.wx;
        _this.business.WXAppId = wx.appId;
        _this.business.user = new User(_this.business);
        _this.business.device = new Device(_this.business);
        return _this;
    }

    _createClass(WXBusiness, [{
        key: 'needReady',
        value: function needReady() {
            return new Array(this.business);
        }
    }]);

    return WXBusiness;
}(Plugin);

module.exports = WXBusiness;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var md5 = __webpack_require__(8);
var config = __webpack_require__(9);
var keys = config.keys;
var Utils = __webpack_require__(6);
var Device = __webpack_require__(62);
var SCOPE_BASE = 'snsapi_base';

var WXDevice = function (_Device) {
    _inherits(WXDevice, _Device);

    function WXDevice(business) {
        _classCallCheck(this, WXDevice);

        var _this = _possibleConstructorReturn(this, (WXDevice.__proto__ || Object.getPrototypeOf(WXDevice)).call(this, business));

        _this.WXAppId = business.WXAppId;
        return _this;
    }

    _createClass(WXDevice, [{
        key: 'openWXDeviceLib',
        value: function openWXDeviceLib(params) {
            var data = params.data;
            this.business.api.checkKeyExists(data, 'brandUserName', 'connType');
            data.connType = data.connType || 'blue';
            wx.invoke('openWXDeviceLib', data, function (res) {
                console.log('openWXDeviceLib', res);
                if (params.complete) {
                    params.complete(res);
                }
                if (res.err_msg == 'openWXDeviceLib:ok') {
                    params.success(res);
                } else {
                    params.error(res);
                }
            });
        }
    }, {
        key: 'getWXDeviceTicket',
        value: function getWXDeviceTicket(params) {
            var data = params.data;
            this.business.api.checkKeyExists(data, 'deviceId', 'type');
            data.connType = data.connType || 'blue';
            wx.invoke('getWXDeviceTicket', data, function (res) {
                console.log('getWXDeviceTicket', res);
                if (params.complete) {
                    params.complete(res);
                }
                if (res.err_msg == 'getWXDeviceTicket:ok' && res.hasOwnProperty('ticket')) {
                    // switch (data.type) {
                    //     case 1:
                    //         this.business.api.wxBindDevice(params);
                    //         break;
                    //     case 2:
                    //         this.business.api.wxUnbindDevice(params);
                    //         break;
                    // }
                    params.success(res);
                } else {
                    params.error(res);
                }
            });
        }
    }]);

    return WXDevice;
}(Device);

module.exports = WXDevice;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var md5 = __webpack_require__(8);
var config = __webpack_require__(9);
var keys = config.keys;
var Utils = __webpack_require__(6);
var User = __webpack_require__(63);
var SCOPE_BASE = 'snsapi_base';

var WXUser = function (_User) {
    _inherits(WXUser, _User);

    function WXUser(business) {
        _classCallCheck(this, WXUser);

        var _this = _possibleConstructorReturn(this, (WXUser.__proto__ || Object.getPrototypeOf(WXUser)).call(this, business));

        _this.WXAppId = business.WXAppId;
        return _this;
    }

    // 微信登录


    _createClass(WXUser, [{
        key: 'login',
        value: function login(params) {
            var _this2 = this;

            var data = {
                code: params.data.code
            };
            var opts = {
                data: data,
                success: function success(ret) {
                    _get(WXUser.prototype.__proto__ || Object.getPrototypeOf(WXUser.prototype), 'handleLoginSuccess', _this2).call(_this2, params, ret);
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.wxLogin(opts);
        }
    }, {
        key: 'linkToAuthorize',
        value: function linkToAuthorize() {
            var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SCOPE_BASE;
            var thirdParty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var redirect_uri = encodeURIComponent(window.location.href);
            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.WXAppId + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=' + scope + '&state=STATE';
            if (thirdParty) {
                url += '&component_appid=' + config.thirdParty.appId;
            }
            url += '#wechat_redirect';
            window.location.href = url;
        }
    }, {
        key: 'checkLoginWay',
        value: function checkLoginWay(params) {
            var _this3 = this;

            var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SCOPE_BASE;
            var thirdParty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var uToken = this.business.getToken();
            var code = Utils.getUrlQuery('code');
            var data = {
                code: code
            };
            var opts = {
                data: data,
                success: params.success,
                error: function error(_error) {
                    var loginError = function loginError() {
                        if (params.error(_error) === false) {
                            return;
                        }
                        _this3.linkToAuthorize(scope, thirdParty);
                    };
                    _this3.business.user.logout({
                        success: loginError,
                        error: loginError
                    });
                },
                complete: params.complete
            };
            if (uToken) {
                _get(WXUser.prototype.__proto__ || Object.getPrototypeOf(WXUser.prototype), 'autoLogin', this).call(this, opts);
            } else if (code) {
                this.login(opts);
            } else {
                this.linkToAuthorize(scope, thirdParty);
            }
        }
    }, {
        key: 'wxConfig',
        value: function wxConfig(params, jsApiList) {
            var _this4 = this;

            var debug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var data = params.data;
            data.url = window.location.href.split('#')[0];
            var opts = {
                type: 'post',
                data: data,
                success: function success(ret) {
                    var data = ret.data;
                    if (window.iotDebug) {
                        iotDebug.logData = [];
                        iotDebug.push(JSON.stringify(data));
                    }
                    wx.config({
                        // 调试模式
                        debug: debug,
                        // 注入wx.invoke方法来调用还未开放的jsapi方法
                        beta: true,
                        // 公众号的唯一标识
                        appId: _this4.WXAppId,
                        // 生成签名的时间戳
                        timestamp: data.timestamp,
                        // 生成签名的随机串
                        nonceStr: data.nonceStr,
                        // 签名
                        signature: data.signature,
                        // 需要使用的JS接口列表
                        jsApiList: jsApiList
                    });
                    new Promise(function (resolve, reject) {
                        wx.ready(function () {
                            resolve(ret);
                        });
                        wx.error(function (err) {
                            reject(err);
                        });
                    }).then(function (ret) {
                        params.success(ret);
                    }).catch(function (err) {
                        params.error(err);
                    });
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.wxSignature(opts);
        }
    }, {
        key: 'wxShareTimeline',
        value: function wxShareTimeline(params) {
            var data = params.data;
            this.business.api.checkKeyExists(data, 'title', 'link', 'imgUrl');
            var opts = {
                // 分享标题
                title: data.title,
                // 分享链接
                link: data.link,
                // 分享图标
                imgUrl: data.imgUrl,
                success: params.success,
                fail: params.error,
                complete: params.complete,
                cancel: params.cancel
            };
            wx.ready(function () {
                wx.onMenuShareTimeline(opts);
            });
        }
    }, {
        key: 'wxShareAppMessage',
        value: function wxShareAppMessage(params) {
            var data = params.data;
            this.business.api.checkKeyExists(data, 'title', 'desc', 'link', 'imgUrl');
            var opts = {
                // 分享标题
                title: data.title,
                // 分享描述
                desc: data.desc,
                // 分享链接
                link: data.link,
                // 分享图标
                imgUrl: data.imgUrl,
                // 分享类型 music video link
                type: data.type || 'link',
                dataUrl: data.dataUrl || '',
                success: params.success,
                fail: params.error,
                complete: params.complete,
                cancel: params.cancel
            };
            wx.ready(function () {
                wx.onMenuShareAppMessage(opts);
            });
        }
    }, {
        key: 'wxScanQRCode',
        value: function wxScanQRCode(params) {
            var data = params.data;
            wx.ready(function () {
                wx.scanQRCode({
                    needResult: data.needResult || 0,
                    scanType: ['qrCode', 'barCode'],
                    success: function success(res) {
                        var result = res.resultStr;
                        params.success(result);
                    },
                    fail: params.error,
                    complete: params.complete,
                    cancel: params.cancel
                });
            });
        }
    }]);

    return WXUser;
}(User);

module.exports = WXUser;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(24);


/***/ })
/******/ ]);
});
//# sourceMappingURL=UIOT.js.map