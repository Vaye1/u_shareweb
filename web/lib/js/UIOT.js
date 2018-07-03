(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["UIOT"] = factory();
	else
		root["UIOT"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 59);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PromiseSequence = __webpack_require__(19);
var CheckParams = __webpack_require__(9);

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
            if (barcode) {
                barcode.cancel();
                barcode.close();
            }
        }
    }]);

    return Utils;
}();

module.exports = Utils;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckParams = __webpack_require__(9);

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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Ugen on 16/12/12.
 */
__webpack_require__(23);
var IOTEvents = __webpack_require__(10);

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
    IOTEvents.getSendMsgObj("NetWork").beforeSend();
    var fetchPromise = _uFetch(url, opts).then(function (res) {
        IOTEvents.getSendMsgObj("NetWork").complete();
        if (params.dataType == 'text') return res.text();
        return res.json();
    }).catch(function (err) {
        IOTEvents.getSendMsgObj("NetWork").complete();
        throw err;
    });
    if (params.success) {
        fetchPromise.then(function (res) {
            params.success(res);
            if (params.complete) params.complete();
        }).catch(function (err) {
            IOTEvents.getSendMsgObj("NetWork").complete();
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

/***/ }),
/* 6 */
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
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return md5
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
}(this))


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var md5 = __webpack_require__(6);
var config = __webpack_require__(0);
var keys = config.keys;
var NetWork = __webpack_require__(5);

var Base = function () {
    function Base(cloud) {
        var _this = this;

        _classCallCheck(this, Base);

        this.router = this.constructor.name.toLowerCase();
        this.appId = cloud.appId;
        this.baseUrl = cloud.baseUrl;
        cloud.emitter.on("setToken", function (token) {
            _this.setToken(token);
        });
    }

    _createClass(Base, [{
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
    }, {
        key: 'send',
        value: function send(url, opts) {
            var needAuth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var isPublic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
            var isDebug = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            if (this.token === undefined && needAuth) {
                if (opts.error) {
                    opts.error('please login first.');
                }
            } else {
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
                if (opts.success) {
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
                    params.complete = opts.complete;
                }
                // params.error = opts.error;
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
                return NetWork.send(requestUrl, params);
            }
        }
    }]);

    return Base;
}();

module.exports = Base;

/***/ }),
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseEvent = __webpack_require__(11);
var EventNetWork = __webpack_require__(21);

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
			var _event = event.toLowerCase();
			if (_event in this.type) {
				return this.events[_event];
			}
			return null;
		}
	}, {
		key: 'loadEvent',
		value: function loadEvent(eventObj) {
			if (eventObj instanceof BaseEvent) {
				var eventName = eventObj.getEventName().toLowerCase();
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = __webpack_require__(12).EventEmitter;

var BaseEvent = function (_EventEmitter) {
    _inherits(BaseEvent, _EventEmitter);

    function BaseEvent(name) {
        _classCallCheck(this, BaseEvent);

        var _this = _possibleConstructorReturn(this, (BaseEvent.__proto__ || Object.getPrototypeOf(BaseEvent)).call(this));

        _this._name = name;
        return _this;
    }

    _createClass(BaseEvent, [{
        key: 'getEventName',
        value: function getEventName() {
            return this._name ? this._name : this.constructor.name.toUpperCase();
        }
    }, {
        key: 'onEvent',
        value: function onEvent() {}
    }]);

    return BaseEvent;
}(EventEmitter);

module.exports = BaseEvent;

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PublicStore = function () {
    function PublicStore(tableName) {
        _classCallCheck(this, PublicStore);

        try {
            var WebSqlStore = __webpack_require__(24);
            this.store = new WebSqlStore(tableName);
        } catch (error) {
            var LocalStorageStore = __webpack_require__(26);
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

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var qs = __webpack_require__(38);

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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(4);

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
var error = __webpack_require__(18);
var IOTBase = __webpack_require__(20);
var IOTEvents = __webpack_require__(10);
var Log = __webpack_require__(22);
var network = __webpack_require__(5);
var PublicStore = __webpack_require__(13);
var Utils = __webpack_require__(1);
var config = __webpack_require__(0);
var keys = config.keys;

var IOTMain = function (_IOTBase) {
    _inherits(IOTMain, _IOTBase);

    function IOTMain(params) {
        _classCallCheck(this, IOTMain);

        // Log
        var _this = _possibleConstructorReturn(this, (IOTMain.__proto__ || Object.getPrototypeOf(IOTMain)).call(this));

        if (params.plugin && params.plugin.log) {
            var log = new Log(params);
            _this.log = log;
            _this.errorHandler(params);
        }
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
            if (params.vue) {
                params.vue.config.errorHandler = function (err, vm, info) {
                    console.error(err);
                    var title = err.name + ': ' + err.message + ' (' + info + ')';
                    var log_data = err.stack;
                    handle(title, log_data);
                };
            }
            window.onerror = function _callee2(message, source, lineNo, columnNo, error) {
                var title, log_data;
                return _regenerator2.default.async(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                console.error(error);
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
/* 16 */
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

module.exports = __webpack_require__(17);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Error.js
 * Version: 0.1
 * User: shz
 * Date: 2017-10-30
 * Copyright(c)  2017. U-GEN Tech.Co,Ltd. All Rights Reserved.
 * Error
 */
var Utils = __webpack_require__(1);
var LOG_URL = 'https://admin.iot.u-gen.net/admin/api/debug/uploadDebugLog';
window.onerror = function (message, source, lineNo, columnNo, error) {
    console.log('window on error');
    var title = message;
    console.log(title);
    var log_data = 'source: ' + source + '\nlineNo: ' + lineNo + '\ncolumnNo: ' + columnNo;
    console.log(log_data);
    var http = new XMLHttpRequest();
    var params = {
        cloud_app_id: 'all',
        title: title,
        log_data: log_data,
        environment: Utils.getBrowserInfo(),
        log_type: 1,
        code_type: 3
    };
    http.open('POST', LOG_URL, true);
    http.setRequestHeader('Accept', 'application/json');
    http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            // let response = JSON.parse(http.responseText);
            // console.log(response);
        }
    };
    http.send(JSON.stringify(params));
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ready = __webpack_require__(2);
var Plugin = __webpack_require__(3);
var md5 = __webpack_require__(6);

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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseEvent = __webpack_require__(11);

var NetWork = function (_BaseEvent) {
	_inherits(NetWork, _BaseEvent);

	function NetWork() {
		_classCallCheck(this, NetWork);

		return _possibleConstructorReturn(this, (NetWork.__proto__ || Object.getPrototypeOf(NetWork)).call(this, "NetWork"));
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
/* 22 */
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
var config = __webpack_require__(0);
var NetWork = __webpack_require__(5);

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
/* 23 */
/***/ (function(module, exports) {

(function(self) {
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


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSqlTool = __webpack_require__(25);
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
            if (group == null) {
                error("group is null");
                return;
            }
            var sql = 'INSERT OR REPLACE INTO ' + this.tableList + ' ';
            var getLastId = 0;
            /* let getLastIdSql = `select i from ${this.tableList} where key_group = '${group}' order by CAST(i AS INTEGER) desc limit 1`;
             let res = await websql.dbExec(getLastIdSql);
             if (res.rows.length > 0) {
                 getLastId = res.rows.item(0).i;
                 getLastId++;
             }*/
            var valuse = "";
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var item = list[i];
                var type = "String";
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
            var sqlPromise = websql.dbExec(sql);
            if (success) sqlPromise.then(success).catch(error);else return sqlPromise;
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

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(4);

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

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalStorageTool = __webpack_require__(27);

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

/***/ }),
/* 27 */
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ready = __webpack_require__(2);
var CloudAPI = __webpack_require__(29);
var PublicStore = __webpack_require__(13);
var config = __webpack_require__(0);
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = __webpack_require__(12).EventEmitter;
var md5 = __webpack_require__(6);
var config = __webpack_require__(0);
var keys = config.keys;
var NetWork = __webpack_require__(5);
var Product = __webpack_require__(30);
var App = __webpack_require__(31);
var User = __webpack_require__(32);

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
        this.uploadUrl = cloud.upload;
        this.emitter = new EventEmitter();
        this.product = new Product(this);
        this.app = new App(this);
        this.user = new User(this);
    }

    _createClass(CloudAPI, [{
        key: 'setToken',
        value: function setToken(token) {
            this.token = token;
            this.emitter.emit("setToken", this.token);
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
            this.upload('device/' + this.appId, opts);
        }
    }, {
        key: 'sendCustom',
        value: function sendCustom(url, opts) {
            var needAuth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var isDebug = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            return this.send(url, opts, needAuth, false, isDebug);
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

            if (this.token == null && needAuth) {
                if (opts.error) {
                    opts.error('please login first.');
                }
            } else {
                var params = {};
                var headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8'
                };
                headers['xu-type'] = "app";
                if (needAuth) {
                    headers['authorization'] = 'JWT ' + this.token;
                }
                params.headers = headers;
                params.data = opts.data;
                if (window.iotDebug) {
                    iotDebug.push('start: ' + url);
                }
                if (opts.success) {
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
                    params.complete = opts.complete;
                }
                // params.error = opts.error;
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
                return NetWork.send(requestUrl, params);
            }
        }
    }, {
        key: 'upload',
        value: function upload(url, opts) {
            var needAuth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            if (this.token == null && needAuth) {
                if (opts.error) {
                    opts.error('please login first.');
                }
            } else {
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
                var requestUrl = this.uploadUrl + '/' + url + '?sign=' + sign + '&time=' + time;
                NetWork.send(requestUrl, params);
            }
        }
    }]);

    return CloudAPI;
}();

module.exports = CloudAPI;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = __webpack_require__(7);

var Product = function (_Base) {
    _inherits(Product, _Base);

    function Product(cloud) {
        _classCallCheck(this, Product);

        return _possibleConstructorReturn(this, (Product.__proto__ || Object.getPrototypeOf(Product)).call(this, cloud));
    }

    _createClass(Product, [{
        key: 'getInfoById',
        value: function getInfoById(params) {
            this.checkKeyExists(params.data, 'pid');
            var opts = {
                type: 'get',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send(this.router + '/getInfoById', opts, false);
        }
    }]);

    return Product;
}(Base);

module.exports = Product;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = __webpack_require__(7);

var App = function (_Base) {
    _inherits(App, _Base);

    function App(cloud) {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, cloud));
    }

    _createClass(App, [{
        key: 'getVersion',
        value: function getVersion(params) {
            this.checkKeyExists(params.data, 'os');
            var opts = {
                type: 'get',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send(this.router + '/getVersion', opts, false);
        }
    }]);

    return App;
}(Base);

module.exports = App;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = __webpack_require__(7);

var User = function (_Base) {
    _inherits(User, _Base);

    function User(cloud) {
        _classCallCheck(this, User);

        return _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this, cloud));
    }

    // User
    // 1 用户注册


    _createClass(User, [{
        key: 'reg',
        value: function reg(params) {
            this.checkKeyExists(params.data, 'username', 'pwd');
            params.data.pwd = this.md5Hash(params.data.pwd);
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            return this.send(this.router + '/reg', opts, false);
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
            return this.send(this.router + '/login', opts, false);
        }

        //退出登陆

    }, {
        key: 'logout',
        value: function logout(params) {
            var opts = {
                type: 'post',
                data: params.data,
                success: params.success,
                error: params.error,
                complete: params.complete
            };
            this.send(this.router + '/logout', opts);
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
            this.send(this.router + '/thirdLogin', opts, false);
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
            this.send(this.router + '/login_simple', opts, false);
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
            this.send(this.router + '/verLogin', opts);
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
            this.send(this.router + '/resetPwd', opts, false);
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
            this.send(this.router + '/setPwd', opts);
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
            this.send(this.router + '/setInfo', opts);
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
            this.send(this.router + '/getInfo', opts);
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
            this.send(this.router + '/setUserDeviceInfo', opts);
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
            this.send(this.router + '/getUserDeviceInfo', opts);
        }
    }]);

    return User;
}(Base);

module.exports = User;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(4);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = __webpack_require__(0);
var keys = config.keys;

var User = function () {
    function User(business) {
        _classCallCheck(this, User);

        this.business = business;
    }

    // 1 用户注册


    _createClass(User, [{
        key: "reg",
        value: function reg(params) {
            var _this2 = this;

            var data = {
                username: params.data.username,
                pwd: params.data.pwd,
                vcode: params.data.vcode
            };
            var opts = {
                data: data,
                success: function success(ret) {
                    _this2.handleLoginSuccess(params, ret);
                },
                error: params.error,
                complete: params.complete
            };
            return this.business.api.user.reg(opts);
        }

        // 2 用户登录

    }, {
        key: "login",
        value: function login(params) {
            var _this3 = this;

            var data = {
                username: params.data.username,
                pwd: params.data.pwd
            };
            var opts = {
                data: data,
                success: function success(ret) {
                    _this3.handleLoginSuccess(params, ret);
                },
                error: params.error,
                complete: params.complete
            };
            return this.business.api.user.login(opts);
        }
    }, {
        key: "thirdLogin",
        value: function thirdLogin(params) {
            var _this4 = this;

            var opts = {
                data: params.data,
                success: function success(ret) {
                    return _regenerator2.default.async(function success$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _this4.handleLoginSuccess(params, ret);

                                case 1:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, null, _this4);
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.user.thirdLogin(opts);
        }
    }, {
        key: "simpleLogin",
        value: function simpleLogin(params) {
            var _this5 = this;

            var opts = {
                data: params.data,
                success: function success(ret) {
                    _this5.handleLoginSuccess(params, ret);
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.user.simpleLogin(opts);
        }

        // 3 自动登录

    }, {
        key: "autoLogin",
        value: function autoLogin(params) {
            var _this6 = this;

            var data = {};
            var opts = {
                data: data,
                success: function success(ret) {
                    return _regenerator2.default.async(function success$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.prev = 0;

                                    if (!(ret.data.utoken.length !== 0)) {
                                        _context2.next = 8;
                                        break;
                                    }

                                    _context2.next = 4;
                                    return _regenerator2.default.awrap(_this6.business.websql.setMap(keys.uToken, ret.data.utoken));

                                case 4:
                                    _this6.business.setToken(ret.data.utoken);
                                    params.success(ret);
                                    _context2.next = 9;
                                    break;

                                case 8:
                                    params.error();

                                case 9:
                                    _context2.next = 14;
                                    break;

                                case 11:
                                    _context2.prev = 11;
                                    _context2.t0 = _context2["catch"](0);

                                    params.error(_context2.t0);

                                case 14:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, null, _this6, [[0, 11]]);
                },
                error: params.error,
                complete: params.complete
            };
            this.business.api.user.autoLogin(opts);
        }

        // 4 忘记密码

    }, {
        key: "resetPwd",
        value: function resetPwd(params) {
            // username
            // pwd
            // vcode
            this.business.api.user.resetPwd(params);
        }

        // 5 修改密码

    }, {
        key: "setPwd",
        value: function setPwd(params) {
            // old_pwd
            // new_pwd
            this.business.api.user.setPwd(params);
        }

        // 6 设置用户信息

    }, {
        key: "setInfo",
        value: function setInfo(params) {
            // nickname
            // head
            // info
            this.business.api.user.setInfo(params);
        }

        // 7 获取用户信息

    }, {
        key: "getInfo",
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
            this.business.api.user.getUserInfo(params);
        }
    }, {
        key: "setUserDeviceInfo",
        value: function setUserDeviceInfo(params) {
            // device_id
            // info
            this.business.api.user.setUserDeviceInfo(params);
        }
    }, {
        key: "getUserDeviceInfo",
        value: function getUserDeviceInfo(params) {
            // device_id
            this.business.api.user.getUserDeviceInfo(params);
        }

        // 退出登录 清空数据

    }, {
        key: "logout",
        value: function logout(params) {
            var _this7 = this;

            var data = {};
            var _this = this;
            var opts = {
                data: data,
                success: function success(ret) {
                    return _regenerator2.default.async(function success$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _context3.prev = 0;
                                    _context3.next = 3;
                                    return _regenerator2.default.awrap(_this7.business.websql.delMaps([keys.uToken, keys.USER_INFO]));

                                case 3:
                                    params.success(ret);
                                    _context3.next = 9;
                                    break;

                                case 6:
                                    _context3.prev = 6;
                                    _context3.t0 = _context3["catch"](0);

                                    params.error(_context3.t0);

                                case 9:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, null, _this7, [[0, 6]]);
                },
                error: function error(err) {
                    params.error(err);
                },
                complete: function complete() {
                    params.complete();
                }
            };
            this.business.api.user.logout(opts);
        }
    }, {
        key: "getUserInfoByStorage",
        value: function getUserInfoByStorage() {
            return this.business.websql.getMap(keys.USER_INFO);
        }
    }, {
        key: "saveUserInfo",
        value: function saveUserInfo(data) {
            var infoArray;
            return _regenerator2.default.async(function saveUserInfo$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;

                            if (!data.utoken || data.utoken && data.utoken.length === 0) {
                                User.throwNoToken();
                            }
                            infoArray = [];

                            infoArray.push([keys.uToken, data.utoken]);
                            infoArray.push([keys.USER_INFO, data]);
                            _context4.next = 7;
                            return _regenerator2.default.awrap(this.business.websql.setMaps(infoArray));

                        case 7:
                            this.business.setToken(data.utoken);
                            return _context4.abrupt("return", true);

                        case 11:
                            _context4.prev = 11;
                            _context4.t0 = _context4["catch"](0);

                            console.error(_context4.t0);
                            return _context4.abrupt("return", false);

                        case 15:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, null, this, [[0, 11]]);
        }
    }, {
        key: "handleLoginSuccess",
        value: function handleLoginSuccess(params, response) {
            return _regenerator2.default.async(function handleLoginSuccess$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return _regenerator2.default.awrap(this.saveUserInfo(response));

                        case 2:
                            if (!_context5.sent) {
                                _context5.next = 6;
                                break;
                            }

                            params.success(response);
                            _context5.next = 7;
                            break;

                        case 6:
                            params.error();

                        case 7:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, null, this);
        }
    }], [{
        key: "throwNoToken",
        value: function throwNoToken() {
            throw new Error("not found utoken");
        }
    }]);

    return User;
}();

module.exports = User;

/***/ }),
/* 34 */
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = __webpack_require__(3);
var Ready = __webpack_require__(2);
var Utils = __webpack_require__(1);

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
        if (Utils.getBrowserInfo().mobile != null && isApp) {
            document.addEventListener("plusready", function () {
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
            var arr = [];
            var match = window.location.href.match(/custom\/[A-Za-z0-9]+\/view/g);
            if (window.location.protocol.indexOf("http") > -1) {
                arr.push(this.getHttpLang(this.getProjecPath() + path));
                if (match !== null) {
                    arr.push(this.getHttpLang(this.getProjecPath(true) + path));
                }
            } else {
                arr.push(this.getLocalLang(path));
                if (match !== null) {
                    var customPath = match[0].replace('view', '') + path;
                    arr.push(this.getLocalLang(customPath));
                }
            }
            Promise.all(arr).then(function (res) {
                var json = {};
                for (var j in res) {
                    json = _extends(json, res[j]);
                }
                return json;
            }).then(function (json) {
                _this3.init(language, json);
            });
        }
    }, {
        key: "getLocalLang",
        value: function getLocalLang(path) {
            return new Promise(function (r, j) {
                console.log("_www/" + path);
                plus.io.resolveLocalFileSystemURL("_www/" + path, function (entry) {
                    // 可通过entry对象操作test.html文件
                    entry.file(function (file) {
                        var fileReader = new plus.io.FileReader();
                        fileReader.readAsText(file, 'utf-8');
                        fileReader.onloadend = function (evt) {
                            var json = JSON.parse(evt.target.result);
                            r(json);
                        };
                    });
                }, function (e) {
                    console.error(e);
                    r({});
                });
            });
        }
    }, {
        key: "getHttpLang",
        value: function getHttpLang(path) {
            return new Promise(function (r, j) {
                fetch(path).then(function (res) {
                    if (res.status !== 200) r({});
                    r(res.json());
                }).catch(function (e) {
                    console.error(e);
                    r({});
                });
            });
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
            var needCustom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
            var curWwwPath = window.document.location.href;
            var match = curWwwPath.match(/custom\/[A-Za-z0-9]+\/view/g);
            if (match !== null) {
                match = curWwwPath.match(/custom\/[A-Za-z0-9]+\//g);
                if (!needCustom) {
                    curWwwPath = curWwwPath.replace(match[0], '');
                }
            }
            //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
            // let pathName = window.document.location.pathname;
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = __webpack_require__(1);
var Web = __webpack_require__(37);
var App = __webpack_require__(41);

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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = __webpack_require__(14);

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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(39);
exports.encode = exports.stringify = __webpack_require__(40);


/***/ }),
/* 39 */
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
/* 40 */
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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(mui) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = __webpack_require__(14);

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
            // let wv = plus.webview.create(params.url, params.id, {styles: params.styles || {}}, {IOTData: params.extras});
            // wv.show('slide-in-right');
            mui.openWindow({
                url: params.url,
                id: params.id,
                styles: params.styles || {},
                show: params.show,
                extras: { IOTData: params.extras },
                waiting: params.waiting || { autoShow: false }
            });
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
                webview.evalJS("iot.navigator.receive('" + eventType + "','" + data + "')");
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
    }, {
        key: 'osName',
        value: function osName() {
            return plus.os.name;
        }
    }, {
        key: 'runtimeVersion',
        value: function runtimeVersion() {
            return plus.runtime.version;
        }
    }, {
        key: 'openURL',
        value: function openURL(url) {
            plus.runtime.openURL(str, function (ret) {
                console.log(ret);
            }, function (err) {
                console.log(err);
            });
        }
    }, {
        key: 'confirm',
        value: function confirm(content, deal, title, buttonArray) {
            plus.nativeUI.confirm(content, function (e) {
                deal(e);
            }, title, buttonArray);
        }
    }]);

    return App;
}(Base);

module.exports = App;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(42)))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(43)(__webpack_require__(44));

/*** EXPORTS FROM exports-loader ***/
module.exports = window.mui;

/***/ }),
/* 43 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	function log(error) {
		(typeof console !== "undefined")
		&& (console.error || console.log)("[Script Loader]", error);
	}

	// Check for IE =< 8
	function isIE() {
		return typeof attachEvent !== "undefined" && typeof addEventListener === "undefined";
	}

	try {
		if (typeof execScript !== "undefined" && isIE()) {
			execScript(src);
		} else if (typeof eval !== "undefined") {
			eval.call(null, src);
		} else {
			log("EvalError: No eval function available");
		}
	} catch (error) {
		log(error);
	}
}


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "/*!\n * =====================================================\n * Mui v3.7.2 (http://dev.dcloud.net.cn/mui)\n * =====================================================\n */\nvar mui=function(a,b){var c=/complete|loaded|interactive/,d=/^#([\\w-]+)$/,e=/^\\.([\\w-]+)$/,f=/^[\\w-]+$/,g=/translate(?:3d)?\\((.+?)\\)/,h=/matrix(3d)?\\((.+?)\\)/,i=function(b,c){if(c=c||a,!b)return j();if(\"object\"==typeof b)return i.isArrayLike(b)?j(i.slice.call(b),null):j([b],null);if(\"function\"==typeof b)return i.ready(b);if(\"string\"==typeof b)try{if(b=b.trim(),d.test(b)){var e=a.getElementById(RegExp.$1);return j(e?[e]:[])}return j(i.qsa(b,c),b)}catch(f){}return j()},j=function(a,b){return a=a||[],Object.setPrototypeOf(a,i.fn),a.selector=b||\"\",a};i.uuid=0,i.data={},i.extend=function(){var a,c,d,e,f,g,h=arguments[0]||{},j=1,k=arguments.length,l=!1;for(\"boolean\"==typeof h&&(l=h,h=arguments[j]||{},j++),\"object\"==typeof h||i.isFunction(h)||(h={}),j===k&&(h=this,j--);k>j;j++)if(null!=(a=arguments[j]))for(c in a)d=h[c],e=a[c],h!==e&&(l&&e&&(i.isPlainObject(e)||(f=i.isArray(e)))?(f?(f=!1,g=d&&i.isArray(d)?d:[]):g=d&&i.isPlainObject(d)?d:{},h[c]=i.extend(l,g,e)):e!==b&&(h[c]=e));return h},i.noop=function(){},i.slice=[].slice,i.filter=[].filter,i.type=function(a){return null==a?String(a):k[{}.toString.call(a)]||\"object\"},i.isArray=Array.isArray||function(a){return a instanceof Array},i.isArrayLike=function(a){var b=!!a&&\"length\"in a&&a.length,c=i.type(a);return\"function\"===c||i.isWindow(a)?!1:\"array\"===c||0===b||\"number\"==typeof b&&b>0&&b-1 in a},i.isWindow=function(a){return null!=a&&a===a.window},i.isObject=function(a){return\"object\"===i.type(a)},i.isPlainObject=function(a){return i.isObject(a)&&!i.isWindow(a)&&Object.getPrototypeOf(a)===Object.prototype},i.isEmptyObject=function(a){for(var c in a)if(c!==b)return!1;return!0},i.isFunction=function(a){return\"function\"===i.type(a)},i.qsa=function(b,c){return c=c||a,i.slice.call(e.test(b)?c.getElementsByClassName(RegExp.$1):f.test(b)?c.getElementsByTagName(b):c.querySelectorAll(b))},i.ready=function(b){return c.test(a.readyState)?b(i):a.addEventListener(\"DOMContentLoaded\",function(){b(i)},!1),this},i.buffer=function(a,b,c){function d(){e&&(e.cancel(),e=0),f=i.now(),a.apply(c||this,arguments),g=i.now()}var e,f=0,g=0,b=b||150;return i.extend(function(){!f||g>=f&&i.now()-g>b||f>g&&i.now()-f>8*b?d.apply(this,arguments):(e&&e.cancel(),e=i.later(d,b,null,i.slice.call(arguments)))},{stop:function(){e&&(e.cancel(),e=0)}})},i.each=function(a,b,c){if(!a)return this;if(\"number\"==typeof a.length)[].every.call(a,function(a,c){return b.call(a,c,a)!==!1});else for(var d in a)if(c){if(a.hasOwnProperty(d)&&b.call(a[d],d,a[d])===!1)return a}else if(b.call(a[d],d,a[d])===!1)return a;return this},i.focus=function(a){i.os.ios?setTimeout(function(){a.focus()},10):a.focus()},i.trigger=function(a,b,c){return a.dispatchEvent(new CustomEvent(b,{detail:c,bubbles:!0,cancelable:!0})),this},i.getStyles=function(a,b){var c=a.ownerDocument.defaultView.getComputedStyle(a,null);return b?c.getPropertyValue(b)||c[b]:c},i.parseTranslate=function(a,b){var c=a.match(g||\"\");return c&&c[1]||(c=[\"\",\"0,0,0\"]),c=c[1].split(\",\"),c={x:parseFloat(c[0]),y:parseFloat(c[1]),z:parseFloat(c[2])},b&&c.hasOwnProperty(b)?c[b]:c},i.parseTranslateMatrix=function(a,b){var c=a.match(h),d=c&&c[1];c?(c=c[2].split(\",\"),\"3d\"===d?c=c.slice(12,15):(c.push(0),c=c.slice(4,7))):c=[0,0,0];var e={x:parseFloat(c[0]),y:parseFloat(c[1]),z:parseFloat(c[2])};return b&&e.hasOwnProperty(b)?e[b]:e},i.hooks={},i.addAction=function(a,b){var c=i.hooks[a];return c||(c=[]),b.index=b.index||1e3,c.push(b),c.sort(function(a,b){return a.index-b.index}),i.hooks[a]=c,i.hooks[a]},i.doAction=function(a,b){i.isFunction(b)?i.each(i.hooks[a],b):i.each(i.hooks[a],function(a,b){return!b.handle()})},i.later=function(a,b,c,d){b=b||0;var e,f,g=a,h=d;return\"string\"==typeof a&&(g=c[a]),e=function(){g.apply(c,i.isArray(h)?h:[h])},f=setTimeout(e,b),{id:f,cancel:function(){clearTimeout(f)}}},i.now=Date.now||function(){return+new Date};var k={};return i.each([\"Boolean\",\"Number\",\"String\",\"Function\",\"Array\",\"Date\",\"RegExp\",\"Object\",\"Error\"],function(a,b){k[\"[object \"+b+\"]\"]=b.toLowerCase()}),window.JSON&&(i.parseJSON=JSON.parse),i.fn={each:function(a){return[].every.call(this,function(b,c){return a.call(b,c,b)!==!1}),this}},\"function\"==typeof define&&define.amd&&define(\"mui\",[],function(){return i}),i}(document);!function(a,b){function c(c){this.os={};var d=[function(){var a=c.match(/(MicroMessenger)\\/([\\d\\.]+)/i);return a&&(this.os.wechat={version:a[2].replace(/_/g,\".\")}),!1},function(){var a=c.match(/(Android);?[\\s\\/]+([\\d.]+)?/);return a&&(this.os.android=!0,this.os.version=a[2],this.os.isBadAndroid=!/Chrome\\/\\d/.test(b.navigator.appVersion)),this.os.android===!0},function(){var a=c.match(/(iPhone\\sOS)\\s([\\d_]+)/);if(a)this.os.ios=this.os.iphone=!0,this.os.version=a[2].replace(/_/g,\".\");else{var b=c.match(/(iPad).*OS\\s([\\d_]+)/);b&&(this.os.ios=this.os.ipad=!0,this.os.version=b[2].replace(/_/g,\".\"))}return this.os.ios===!0}];[].every.call(d,function(b){return!b.call(a)})}c.call(a,navigator.userAgent)}(mui,window),function(a,b){function c(c){this.os=this.os||{};var d=c.match(/Html5Plus/i);d&&(this.os.plus=!0,a(function(){b.body.classList.add(\"mui-plus\")}),c.match(/StreamApp/i)&&(this.os.stream=!0,a(function(){b.body.classList.add(\"mui-plus-stream\")})))}c.call(a,navigator.userAgent)}(mui,document),function(a){\"ontouchstart\"in window?(a.isTouchable=!0,a.EVENT_START=\"touchstart\",a.EVENT_MOVE=\"touchmove\",a.EVENT_END=\"touchend\"):(a.isTouchable=!1,a.EVENT_START=\"mousedown\",a.EVENT_MOVE=\"mousemove\",a.EVENT_END=\"mouseup\"),a.EVENT_CANCEL=\"touchcancel\",a.EVENT_CLICK=\"click\";var b=1,c={},d={preventDefault:\"isDefaultPrevented\",stopImmediatePropagation:\"isImmediatePropagationStopped\",stopPropagation:\"isPropagationStopped\"},e=function(){return!0},f=function(){return!1},g=function(b,c){return b.detail?b.detail.currentTarget=c:b.detail={currentTarget:c},a.each(d,function(a,c){var d=b[a];b[a]=function(){return this[c]=e,d&&d.apply(b,arguments)},b[c]=f},!0),b},h=function(a){return a&&(a._mid||(a._mid=b++))},i={},j=function(b,d,e,f){return function(e){for(var f=c[b._mid][d],h=[],i=e.target,j={};i&&i!==document&&i!==b&&(!~[\"click\",\"tap\",\"doubletap\",\"longtap\",\"hold\"].indexOf(d)||!i.disabled&&!i.classList.contains(\"mui-disabled\"));i=i.parentNode){var k={};a.each(f,function(c,d){j[c]||(j[c]=a.qsa(c,b)),j[c]&&~j[c].indexOf(i)&&(k[c]||(k[c]=d))},!0),a.isEmptyObject(k)||h.push({element:i,handlers:k})}j=null,e=g(e),a.each(h,function(b,c){i=c.element;var f=i.tagName;return\"tap\"===d&&\"INPUT\"!==f&&\"TEXTAREA\"!==f&&\"SELECT\"!==f&&(e.preventDefault(),e.detail&&e.detail.gesture&&e.detail.gesture.preventDefault()),a.each(c.handlers,function(b,c){a.each(c,function(a,b){b.call(i,e)===!1&&(e.preventDefault(),e.stopPropagation())},!0)},!0),e.isPropagationStopped()?!1:void 0},!0)}},k=function(a,b){var c=i[h(a)],d=[];if(c){if(d=[],b){var e=function(a){return a.type===b};return c.filter(e)}d=c}return d},l=/^(INPUT|TEXTAREA|BUTTON|SELECT)$/;a.fn.on=function(b,d,e){return this.each(function(){var f=this;h(f),h(e);var g=!1,k=c[f._mid]||(c[f._mid]={}),m=k[b]||(k[b]={});a.isEmptyObject(m)&&(g=!0);var n=m[d]||(m[d]=[]);if(n.push(e),g){var o=i[h(f)];o||(o=[]);var p=j(f,b,d,e);o.push(p),p.i=o.length-1,p.type=b,i[h(f)]=o,f.addEventListener(b,p),\"tap\"===b&&f.addEventListener(\"click\",function(a){if(a.target){var b=a.target.tagName;if(!l.test(b))if(\"A\"===b){var c=a.target.href;c&&~c.indexOf(\"tel:\")||a.preventDefault()}else a.preventDefault()}})}})},a.fn.off=function(b,d,e){return this.each(function(){var f=h(this);if(b)if(d)if(e){var g=c[f]&&c[f][b]&&c[f][b][d];a.each(g,function(a,b){return h(b)===h(e)?(g.splice(a,1),!1):void 0},!0)}else c[f]&&c[f][b]&&delete c[f][b][d];else c[f]&&delete c[f][b];else c[f]&&delete c[f];c[f]?(!c[f][b]||a.isEmptyObject(c[f][b]))&&k(this,b).forEach(function(a){this.removeEventListener(a.type,a),delete i[f][a.i]}.bind(this)):k(this).forEach(function(a){this.removeEventListener(a.type,a),delete i[f][a.i]}.bind(this))})}}(mui),function(a,b,c){a.targets={},a.targetHandles=[],a.registerTarget=function(b){return b.index=b.index||1e3,a.targetHandles.push(b),a.targetHandles.sort(function(a,b){return a.index-b.index}),a.targetHandles},b.addEventListener(a.EVENT_START,function(b){for(var d=b.target,e={};d&&d!==c;d=d.parentNode){var f=!1;if(a.each(a.targetHandles,function(c,g){var h=g.name;f||e[h]||!g.hasOwnProperty(\"handle\")?e[h]||g.isReset!==!1&&(a.targets[h]=!1):(a.targets[h]=g.handle(b,d),a.targets[h]&&(e[h]=!0,g.isContinue!==!0&&(f=!0)))}),f)break}}),b.addEventListener(\"click\",function(b){for(var d=b.target,e=!1;d&&d!==c&&(\"A\"!==d.tagName||(a.each(a.targetHandles,function(a,c){c.name;return c.hasOwnProperty(\"handle\")&&c.handle(b,d)?(e=!0,b.preventDefault(),!1):void 0}),!e));d=d.parentNode);})}(mui,window,document),function(a){String.prototype.trim===a&&(String.prototype.trim=function(){return this.replace(/^\\s+|\\s+$/g,\"\")}),Object.setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a}}(),function(){function a(a,b){b=b||{bubbles:!1,cancelable:!1,detail:void 0};var c=document.createEvent(\"Events\"),d=!0;for(var e in b)\"bubbles\"===e?d=!!b[e]:c[e]=b[e];return c.initEvent(a,d,!0),c}\"undefined\"==typeof window.CustomEvent&&(a.prototype=window.Event.prototype,window.CustomEvent=a)}(),Function.prototype.bind=Function.prototype.bind||function(a){var b=Array.prototype.splice.call(arguments,1),c=this,d=function(){var e=b.concat(Array.prototype.splice.call(arguments,0));return this instanceof d?void c.apply(this,e):c.apply(a,e)};return d.prototype=c.prototype,d},function(a){\"classList\"in a.documentElement||!Object.defineProperty||\"undefined\"==typeof HTMLElement||Object.defineProperty(HTMLElement.prototype,\"classList\",{get:function(){function a(a){return function(c){var d=b.className.split(/\\s+/),e=d.indexOf(c);a(d,e,c),b.className=d.join(\" \")}}var b=this,c={add:a(function(a,b,c){~b||a.push(c)}),remove:a(function(a,b){~b&&a.splice(b,1)}),toggle:a(function(a,b,c){~b?a.splice(b,1):a.push(c)}),contains:function(a){return!!~b.className.split(/\\s+/).indexOf(a)},item:function(a){return b.className.split(/\\s+/)[a]||null}};return Object.defineProperty(c,\"length\",{get:function(){return b.className.split(/\\s+/).length}}),c}})}(document),function(a){if(!a.requestAnimationFrame){var b=0;a.requestAnimationFrame=a.webkitRequestAnimationFrame||function(c,d){var e=(new Date).getTime(),f=Math.max(0,16.7-(e-b)),g=a.setTimeout(function(){c(e+f)},f);return b=e+f,g},a.cancelAnimationFrame=a.webkitCancelAnimationFrame||a.webkitCancelRequestAnimationFrame||function(a){clearTimeout(a)}}}(window),function(a,b,c){if((a.os.android||a.os.ios)&&!b.FastClick){var d=function(a,b){return\"LABEL\"===b.tagName&&b.parentNode&&(b=b.parentNode.querySelector(\"input\")),!b||\"radio\"!==b.type&&\"checkbox\"!==b.type||b.disabled?!1:b};a.registerTarget({name:c,index:40,handle:d,target:!1});var e=function(c){var d=a.targets.click;if(d){var e,f;document.activeElement&&document.activeElement!==d&&document.activeElement.blur(),f=c.detail.gesture.changedTouches[0],e=document.createEvent(\"MouseEvents\"),e.initMouseEvent(\"click\",!0,!0,b,1,f.screenX,f.screenY,f.clientX,f.clientY,!1,!1,!1,!1,0,null),e.forwardedTouchEvent=!0,d.dispatchEvent(e),c.detail&&c.detail.gesture.preventDefault()}};b.addEventListener(\"tap\",e),b.addEventListener(\"doubletap\",e),b.addEventListener(\"click\",function(b){return a.targets.click&&!b.forwardedTouchEvent?(b.stopImmediatePropagation?b.stopImmediatePropagation():b.propagationStopped=!0,b.stopPropagation(),b.preventDefault(),!1):void 0},!0)}}(mui,window,\"click\"),function(a,b){a(function(){if(a.os.ios){var c=\"mui-focusin\",d=\"mui-bar-tab\",e=\"mui-bar-footer\",f=\"mui-bar-footer-secondary\",g=\"mui-bar-footer-secondary-tab\";b.addEventListener(\"focusin\",function(h){if(!(a.os.plus&&window.plus&&plus.webview.currentWebview().children().length>0)){var i=h.target;if(i.tagName&&(\"TEXTAREA\"===i.tagName||\"INPUT\"===i.tagName&&(\"text\"===i.type||\"search\"===i.type||\"number\"===i.type))){if(i.disabled||i.readOnly)return;b.body.classList.add(c);for(var j=!1;i&&i!==b;i=i.parentNode){var k=i.classList;if(k&&k.contains(d)||k.contains(e)||k.contains(f)||k.contains(g)){j=!0;break}}if(j){var l=b.body.scrollHeight,m=b.body.scrollLeft;setTimeout(function(){window.scrollTo(m,l)},20)}}}}),b.addEventListener(\"focusout\",function(a){var d=b.body.classList;d.contains(c)&&(d.remove(c),setTimeout(function(){window.scrollTo(b.body.scrollLeft,b.body.scrollTop)},20))})}})}(mui,document),function(a){a.namespace=\"mui\",a.classNamePrefix=a.namespace+\"-\",a.classSelectorPrefix=\".\"+a.classNamePrefix,a.className=function(b){return a.classNamePrefix+b},a.classSelector=function(b){return b.replace(/\\./g,a.classSelectorPrefix)},a.eventName=function(b,c){return b+(a.namespace?\".\"+a.namespace:\"\")+(c?\".\"+c:\"\")}}(mui),function(a,b){a.gestures={session:{}},a.preventDefault=function(a){a.preventDefault()},a.stopPropagation=function(a){a.stopPropagation()},a.addGesture=function(b){return a.addAction(\"gestures\",b)};var c=Math.round,d=Math.abs,e=Math.sqrt,f=(Math.atan,Math.atan2),g=function(a,b,c){c||(c=[\"x\",\"y\"]);var d=b[c[0]]-a[c[0]],f=b[c[1]]-a[c[1]];return e(d*d+f*f)},h=function(a,b){if(a.length>=2&&b.length>=2){var c=[\"pageX\",\"pageY\"];return g(b[1],b[0],c)/g(a[1],a[0],c)}return 1},i=function(a,b,c){c||(c=[\"x\",\"y\"]);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*f(e,d)/Math.PI},j=function(a,b){return a===b?\"\":d(a)>=d(b)?a>0?\"left\":\"right\":b>0?\"up\":\"down\"},k=function(a,b){var c=[\"pageX\",\"pageY\"];return i(b[1],b[0],c)-i(a[1],a[0],c)},l=function(a,b,c){return{x:b/a||0,y:c/a||0}},m=function(b,c){a.gestures.stoped||a.doAction(\"gestures\",function(d,e){a.gestures.stoped||a.options.gestureConfig[e.name]!==!1&&e.handle(b,c)})},n=function(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1},o=function(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];e.indexOf(g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d},p=function(a){var b=a.length;if(1===b)return{x:c(a[0].pageX),y:c(a[0].pageY)};for(var d=0,e=0,f=0;b>f;)d+=a[f].pageX,e+=a[f].pageY,f++;return{x:c(d/b),y:c(e/b)}},q=function(){return a.options.gestureConfig.pinch},r=function(b){for(var d=[],e=0;e<b.touches.length;)d[e]={pageX:c(b.touches[e].pageX),pageY:c(b.touches[e].pageY)},e++;return{timestamp:a.now(),gesture:b.gesture,touches:d,center:p(b.touches),deltaX:b.deltaX,deltaY:b.deltaY}},s=function(b){var c=a.gestures.session,d=b.center,e=c.offsetDelta||{},f=c.prevDelta||{},g=c.prevTouch||{};(b.gesture.type===a.EVENT_START||b.gesture.type===a.EVENT_END)&&(f=c.prevDelta={x:g.deltaX||0,y:g.deltaY||0},e=c.offsetDelta={x:d.x,y:d.y}),b.deltaX=f.x+(d.x-e.x),b.deltaY=f.y+(d.y-e.y)},t=function(b){var c=a.gestures.session,d=b.touches,e=d.length;c.firstTouch||(c.firstTouch=r(b)),q()&&e>1&&!c.firstMultiTouch?c.firstMultiTouch=r(b):1===e&&(c.firstMultiTouch=!1);var f=c.firstTouch,l=c.firstMultiTouch,m=l?l.center:f.center,n=b.center=p(d);b.timestamp=a.now(),b.deltaTime=b.timestamp-f.timestamp,b.angle=i(m,n),b.distance=g(m,n),s(b),b.offsetDirection=j(b.deltaX,b.deltaY),b.scale=l?h(l.touches,d):1,b.rotation=l?k(l.touches,d):0,v(b)},u=25,v=function(b){var c,e,f,g,h=a.gestures.session,i=h.lastInterval||b,k=b.timestamp-i.timestamp;if(b.gesture.type!=a.EVENT_CANCEL&&(k>u||void 0===i.velocity)){var m=i.deltaX-b.deltaX,n=i.deltaY-b.deltaY,o=l(k,m,n);e=o.x,f=o.y,c=d(o.x)>d(o.y)?o.x:o.y,g=j(m,n)||i.direction,h.lastInterval=b}else c=i.velocity,e=i.velocityX,f=i.velocityY,g=i.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g},w={},x=function(a){for(var b=0;b<a.length;b++)!a.identifier&&(a.identifier=0);return a},y=function(b,c){var d=x(a.slice.call(b.touches||[b])),e=b.type,f=[],g=[];if(e!==a.EVENT_START&&e!==a.EVENT_MOVE||1!==d.length){var h=0,f=[],g=[],i=x(a.slice.call(b.changedTouches||[b]));c.target=b.target;var j=a.gestures.session.target||b.target;if(f=d.filter(function(a){return n(a.target,j)}),e===a.EVENT_START)for(h=0;h<f.length;)w[f[h].identifier]=!0,h++;for(h=0;h<i.length;)w[i[h].identifier]&&g.push(i[h]),(e===a.EVENT_END||e===a.EVENT_CANCEL)&&delete w[i[h].identifier],h++;if(!g.length)return!1}else w[d[0].identifier]=!0,f=d,g=d,c.target=b.target;f=o(f.concat(g),\"identifier\",!0);var k=f.length,l=g.length;return e===a.EVENT_START&&k-l===0&&(c.isFirst=!0,a.gestures.touch=a.gestures.session={target:b.target}),c.isFinal=(e===a.EVENT_END||e===a.EVENT_CANCEL)&&k-l===0,c.touches=f,c.changedTouches=g,!0},z=function(b){var c={gesture:b},d=y(b,c);d&&(t(c),m(b,c),a.gestures.session.prevTouch=c,b.type!==a.EVENT_END||a.isTouchable||(a.gestures.touch=a.gestures.session={}))};b.addEventListener(a.EVENT_START,z),b.addEventListener(a.EVENT_MOVE,z),b.addEventListener(a.EVENT_END,z),b.addEventListener(a.EVENT_CANCEL,z),b.addEventListener(a.EVENT_CLICK,function(b){(a.os.android||a.os.ios)&&(a.targets.popover&&b.target===a.targets.popover||a.targets.tab||a.targets.offcanvas||a.targets.modal)&&b.preventDefault()},!0),a.isScrolling=!1;var A=null;b.addEventListener(\"scroll\",function(){a.isScrolling=!0,A&&clearTimeout(A),A=setTimeout(function(){a.isScrolling=!1},250)})}(mui,window),function(a,b){var c=0,d=function(d,e){var f=a.gestures.session,g=this.options,h=a.now();switch(d.type){case a.EVENT_MOVE:h-c>300&&(c=h,f.flickStart=e.center);break;case a.EVENT_END:case a.EVENT_CANCEL:e.flick=!1,f.flickStart&&g.flickMaxTime>h-c&&e.distance>g.flickMinDistince&&(e.flick=!0,e.flickTime=h-c,e.flickDistanceX=e.center.x-f.flickStart.x,e.flickDistanceY=e.center.y-f.flickStart.y,a.trigger(f.target,b,e),a.trigger(f.target,b+e.direction,e))}};a.addGesture({name:b,index:5,handle:d,options:{flickMaxTime:200,flickMinDistince:10}})}(mui,\"flick\"),function(a,b){var c=function(c,d){var e=a.gestures.session;if(c.type===a.EVENT_END||c.type===a.EVENT_CANCEL){var f=this.options;d.swipe=!1,d.direction&&f.swipeMaxTime>d.deltaTime&&d.distance>f.swipeMinDistince&&(d.swipe=!0,a.trigger(e.target,b,d),a.trigger(e.target,b+d.direction,d))}};a.addGesture({name:b,index:10,handle:c,options:{swipeMaxTime:300,swipeMinDistince:18}})}(mui,\"swipe\"),function(a,b){var c=function(c,d){var e=a.gestures.session;switch(c.type){case a.EVENT_START:break;case a.EVENT_MOVE:if(!d.direction||!e.target)return;e.lockDirection&&e.startDirection&&e.startDirection&&e.startDirection!==d.direction&&(\"up\"===e.startDirection||\"down\"===e.startDirection?d.direction=d.deltaY<0?\"up\":\"down\":d.direction=d.deltaX<0?\"left\":\"right\"),e.drag||(e.drag=!0,a.trigger(e.target,b+\"start\",d)),a.trigger(e.target,b,d),a.trigger(e.target,b+d.direction,d);break;case a.EVENT_END:case a.EVENT_CANCEL:e.drag&&d.isFinal&&a.trigger(e.target,b+\"end\",d)}};a.addGesture({name:b,index:20,handle:c,options:{fingers:1}})}(mui,\"drag\"),function(a,b){var c,d,e=function(e,f){var g=a.gestures.session,h=this.options;switch(e.type){case a.EVENT_END:if(!f.isFinal)return;var i=g.target;if(!i||i.disabled||i.classList&&i.classList.contains(\"mui-disabled\"))return;if(f.distance<h.tapMaxDistance&&f.deltaTime<h.tapMaxTime){if(a.options.gestureConfig.doubletap&&c&&c===i&&d&&f.timestamp-d<h.tapMaxInterval)return a.trigger(i,\"doubletap\",f),d=a.now(),void(c=i);a.trigger(i,b,f),d=a.now(),c=i}}};a.addGesture({name:b,index:30,handle:e,options:{fingers:1,tapMaxInterval:300,tapMaxDistance:5,tapMaxTime:250}})}(mui,\"tap\"),function(a,b){var c,d=function(d,e){var f=a.gestures.session,g=this.options;switch(d.type){case a.EVENT_START:clearTimeout(c),c=setTimeout(function(){a.trigger(f.target,b,e)},g.holdTimeout);break;case a.EVENT_MOVE:e.distance>g.holdThreshold&&clearTimeout(c);break;case a.EVENT_END:case a.EVENT_CANCEL:clearTimeout(c)}};a.addGesture({name:b,index:10,handle:d,options:{fingers:1,holdTimeout:500,holdThreshold:2}})}(mui,\"longtap\"),function(a,b){var c,d=function(d,e){var f=a.gestures.session,g=this.options;switch(d.type){case a.EVENT_START:a.options.gestureConfig.hold&&(c&&clearTimeout(c),c=setTimeout(function(){e.hold=!0,a.trigger(f.target,b,e)},g.holdTimeout));break;case a.EVENT_MOVE:break;case a.EVENT_END:case a.EVENT_CANCEL:c&&(clearTimeout(c)&&(c=null),a.trigger(f.target,\"release\",e))}};a.addGesture({name:b,index:10,handle:d,options:{fingers:1,holdTimeout:0}})}(mui,\"hold\"),function(a,b){var c=function(c,d){var e=this.options,f=a.gestures.session;switch(c.type){case a.EVENT_START:break;case a.EVENT_MOVE:if(a.options.gestureConfig.pinch){if(d.touches.length<2)return;f.pinch||(f.pinch=!0,a.trigger(f.target,b+\"start\",d)),a.trigger(f.target,b,d);var g=d.scale,h=d.rotation,i=\"undefined\"==typeof d.lastScale?1:d.lastScale,j=1e-12;g>i?(i=g-j,a.trigger(f.target,b+\"out\",d)):i>g&&(i=g+j,a.trigger(f.target,b+\"in\",d)),Math.abs(h)>e.minRotationAngle&&a.trigger(f.target,\"rotate\",d)}break;case a.EVENT_END:case a.EVENT_CANCEL:a.options.gestureConfig.pinch&&f.pinch&&2===d.touches.length&&(f.pinch=!1,a.trigger(f.target,b+\"end\",d))}};a.addGesture({name:b,index:10,handle:c,options:{minRotationAngle:0}})}(mui,\"pinch\"),function(a){function b(a,b){var c=\"MUI_SCROLL_POSITION_\"+document.location.href+\"_\"+b.src,d=parseFloat(localStorage.getItem(c))||0;d&&!function(a){b.onload=function(){window.scrollTo(0,a)}}(d),setInterval(function(){var a=window.scrollY;d!==a&&(localStorage.setItem(c,a+\"\"),d=a)},100)}a.global=a.options={gestureConfig:{tap:!0,doubletap:!1,longtap:!1,hold:!1,flick:!0,swipe:!0,drag:!0,pinch:!1}},a.initGlobal=function(b){return a.options=a.extend(!0,a.global,b),this};var c={};a.init=function(b){return a.options=a.extend(!0,a.global,b||{}),a.ready(function(){a.doAction(\"inits\",function(b,d){var e=!(c[d.name]&&!d.repeat);e&&(d.handle.call(a),c[d.name]=!0)})}),this},a.addInit=function(b){return a.addAction(\"inits\",b)},a.addInit({name:\"iframe\",index:100,handle:function(){var b=a.options,c=b.subpages||[];!a.os.plus&&c.length&&d(c[0])}});var d=function(c){var d=document.createElement(\"div\");d.className=\"mui-iframe-wrapper\";var e=c.styles||{};\"string\"!=typeof e.top&&(e.top=\"0px\"),\"string\"!=typeof e.bottom&&(e.bottom=\"0px\"),d.style.top=e.top,d.style.bottom=e.bottom;var f=document.createElement(\"iframe\");f.src=c.url,f.id=c.id||c.url,f.name=f.id,d.appendChild(f),document.body.appendChild(d),a.os.wechat&&b(d,f)};a(function(){var b=document.body.classList,c=[];a.os.ios?(c.push({os:\"ios\",version:a.os.version}),b.add(\"mui-ios\")):a.os.android&&(c.push({os:\"android\",version:a.os.version}),b.add(\"mui-android\")),a.os.wechat&&(c.push({os:\"wechat\",version:a.os.wechat.version}),b.add(\"mui-wechat\")),c.length&&a.each(c,function(c,d){var e=\"\";d.version&&a.each(d.version.split(\".\"),function(c,f){e=e+(e?\"-\":\"\")+f,b.add(a.className(d.os+\"-\"+e))})})})}(mui),function(a){var b={swipeBack:!1,preloadPages:[],preloadLimit:10,keyEventBind:{backbutton:!0,menubutton:!0},titleConfig:{height:\"44px\",backgroundColor:\"#f7f7f7\",bottomBorderColor:\"#cccccc\",title:{text:\"\",position:{top:0,left:0,width:\"100%\",height:\"100%\"},styles:{color:\"#000000\",align:\"center\",family:\"'Helvetica Neue',Helvetica,sans-serif\",size:\"17px\",style:\"normal\",weight:\"normal\",fontSrc:\"\"}},back:{image:{base64Data:\"\",imgSrc:\"\",sprite:{top:\"0px\",left:\"0px\",width:\"100%\",height:\"100%\"},position:{top:\"10px\",left:\"10px\",width:\"24px\",height:\"24px\"}}}}},c={event:\"titleUpdate\",autoShow:!0,duration:300,aniShow:\"slide-in-right\",extras:{}};a.options.show&&(c=a.extend(!0,c,a.options.show)),a.currentWebview=null,a.extend(!0,a.global,b),a.extend(!0,a.options,b),a.waitingOptions=function(b){return a.extend(!0,{},{autoShow:!0,title:\"\",modal:!1},b)},a.showOptions=function(b){return a.extend(!0,{},c,b)},a.windowOptions=function(b){return a.extend({scalable:!1,bounce:\"\"},b)},a.plusReady=function(a){return window.plus?setTimeout(function(){a()},0):document.addEventListener(\"plusready\",function(){a()},!1),this},a.fire=function(b,c,d){if(b){if(\"undefined\"==typeof d)d=\"\";else{if(\"boolean\"==typeof d||\"number\"==typeof d)return void b.evalJS(\"typeof mui!=='undefined'&&mui.receive('\"+c+\"',\"+d+\")\");(a.isPlainObject(d)||a.isArray(d))&&(d=JSON.stringify(d||{}).replace(/\\'/g,\"\\\\u0027\").replace(/\\\\/g,\"\\\\u005c\"))}b.evalJS(\"typeof mui!=='undefined'&&mui.receive('\"+c+\"','\"+d+\"')\")}},a.receive=function(b,c){if(b){try{c&&\"string\"==typeof c&&(c=JSON.parse(c))}catch(d){}a.trigger(document,b,c)}};var d=function(b){if(!b.preloaded){a.fire(b,\"preload\");for(var c=b.children(),d=0;d<c.length;d++)a.fire(c[d],\"preload\");b.preloaded=!0}},e=function(b,c,d){if(d){if(!b[c+\"ed\"]){a.fire(b,c);for(var e=b.children(),f=0;f<e.length;f++)a.fire(e[f],c);b[c+\"ed\"]=!0}}else{a.fire(b,c);for(var e=b.children(),f=0;f<e.length;f++)a.fire(e[f],c)}};a.openWindow=function(b,f,g){if(\"object\"==typeof b?(g=b,b=g.url,f=g.id||b):\"object\"==typeof f?(g=f,f=g.id||b):f=f||b,!a.os.plus)return void(a.os.ios||a.os.android?window.top.location.href=b:window.parent.location.href=b);if(window.plus){g=g||{};var h,i,j=g.params||{},k=null,l=null;if(a.webviews[f]?(l=a.webviews[f],plus.webview.getWebviewById(f)&&(k=l.webview)):g.createNew!==!0&&(k=plus.webview.getWebviewById(f)),k)return h=l?l.show:c,h=g.show?a.extend(h,g.show):h,h.autoShow&&k.show(h.aniShow,h.duration,function(){d(k),e(k,\"pagebeforeshow\",!1)}),l&&l.afterShowMethodName&&k.evalJS(l.afterShowMethodName+\"('\"+JSON.stringify(j)+\"')\"),k;if(!b)throw new Error(\"webview[\"+f+\"] does not exist\");var m=a.waitingOptions(g.waiting);if(m.autoShow&&(i=plus.nativeUI.showWaiting(m.title,m.options)),g=a.extend(g,{id:f,url:b}),k=a.createWindow(g),h=a.showOptions(g.show),h.autoShow){var n=function(){i&&i.close(),k.show(h.aniShow,h.duration,function(){},h.extras),g.afterShowMethodName&&k.evalJS(g.afterShowMethodName+\"('\"+JSON.stringify(j)+\"')\")};k.addEventListener(h.event,n,!1),k.addEventListener(\"loaded\",function(){d(k),e(k,\"pagebeforeshow\",!1)},!1)}return k}},a.openWindowWithTitle=function(b,f){b=b||{};var g=b.url,h=b.id||g;if(!a.os.plus)return void(a.os.ios||a.os.android?window.top.location.href=g:window.parent.location.href=g);if(window.plus){var i,j,k=b.params||{},l=null,m=null;if(a.webviews[h]?(m=a.webviews[h],plus.webview.getWebviewById(h)&&(l=m.webview)):b.createNew!==!0&&(l=plus.webview.getWebviewById(h)),l)return i=m?m.show:c,i=b.show?a.extend(i,b.show):i,i.autoShow&&l.show(i.aniShow,i.duration,function(){d(l),e(l,\"pagebeforeshow\",!1)}),m&&m.afterShowMethodName&&l.evalJS(m.afterShowMethodName+\"('\"+JSON.stringify(k)+\"')\"),l;if(!g)throw new Error(\"webview[\"+h+\"] does not exist\");var n=a.waitingOptions(b.waiting);if(n.autoShow&&(j=plus.nativeUI.showWaiting(n.title,n.options)),b=a.extend(b,{id:h,url:g}),l=a.createWindow(b),f){a.extend(!0,a.options.titleConfig,f);var o=a.options.titleConfig.id?a.options.titleConfig.id:h+\"_title\",p=new plus.nativeObj.View(o,{top:0,height:a.options.titleConfig.height,width:\"100%\",dock:\"top\",position:\"dock\"});p.drawRect(a.options.titleConfig.backgroundColor);var q=parseInt(a.options.titleConfig.height)-1;if(p.drawRect(a.options.titleConfig.bottomBorderColor,{top:q+\"px\",left:\"0px\"}),a.options.titleConfig.title.text){var r=a.options.titleConfig.title;p.drawText(r.text,r.position,r.styles)}var s=a.options.titleConfig.back,t=null,u=s.image;if(u.base64Data||u.imgSrc){t={left:parseInt(u.position.left),right:parseInt(u.position.left)+parseInt(u.position.width)};var v=new plus.nativeObj.Bitmap(h+\"_back\");u.base64Data?v.loadBase64Data(u.base64Data):v.load(u.imgSrc),p.drawBitmap(v,u.sprite,u.position)}p.setTouchEventRect({top:\"0px\",left:\"0px\",width:\"100%\",height:\"100%\"}),p.interceptTouchEvent(!0),p.addEventListener(\"click\",function(b){var c=b.clientX;t&&c>t.left&&c<t.right&&(s.click&&a.isFunction(s.click)?s.click():l.evalJS(\"window.mui&&mui.back();\"))},!1),l.append(p)}return i=a.showOptions(b.show),i.autoShow&&l.addEventListener(i.event,function(){j&&j.close(),l.show(i.aniShow,i.duration,function(){},i.extras)},!1),l}},a.createWindow=function(b,c){if(window.plus){var d,e=b.id||b.url;if(b.preload){a.webviews[e]&&a.webviews[e].webview.getURL()?d=a.webviews[e].webview:(b.createNew!==!0&&(d=plus.webview.getWebviewById(e)),d||(d=plus.webview.create(b.url,e,a.windowOptions(b.styles),a.extend({preload:!0},b.extras)),b.subpages&&a.each(b.subpages,function(b,c){var e=c.id||c.url;if(e){var f=plus.webview.getWebviewById(e);f||(f=plus.webview.create(c.url,e,a.windowOptions(c.styles),a.extend({preload:!0},c.extras))),d.append(f)}}))),a.webviews[e]={webview:d,preload:!0,show:a.showOptions(b.show),afterShowMethodName:b.afterShowMethodName};var f=a.data.preloads,g=f.indexOf(e);if(~g&&f.splice(g,1),f.push(e),f.length>a.options.preloadLimit){var h=a.data.preloads.shift(),i=a.webviews[h];i&&i.webview&&a.closeAll(i.webview),delete a.webviews[h]}}else c!==!1&&(d=plus.webview.create(b.url,e,a.windowOptions(b.styles),b.extras),b.subpages&&a.each(b.subpages,function(b,c){var e=c.id||c.url,f=plus.webview.getWebviewById(e);f||(f=plus.webview.create(c.url,e,a.windowOptions(c.styles),c.extras)),d.append(f)}));return d}},a.preload=function(b){return b.preload||(b.preload=!0),a.createWindow(b)},a.closeOpened=function(b){var c=b.opened();if(c)for(var d=0,e=c.length;e>d;d++){var f=c[d],g=f.opened();g&&g.length>0?(a.closeOpened(f),f.close(\"none\")):f.parent()!==b&&f.close(\"none\")}},a.closeAll=function(b,c){a.closeOpened(b),c?b.close(c):b.close()},a.createWindows=function(b){a.each(b,function(b,c){a.createWindow(c,!1)})},a.appendWebview=function(b){if(window.plus){var c,d=b.id||b.url;return a.webviews[d]||(plus.webview.getWebviewById(d)||(c=plus.webview.create(b.url,d,b.styles,b.extras)),plus.webview.currentWebview().append(c),a.webviews[d]=b),c}},a.webviews={},a.data.preloads=[],a.plusReady(function(){a.currentWebview=plus.webview.currentWebview()}),a.addInit({name:\"5+\",index:100,handle:function(){var b=a.options,c=b.subpages||[];a.os.plus&&a.plusReady(function(){a.each(c,function(b,c){a.appendWebview(c)}),plus.webview.currentWebview()===plus.webview.getWebviewById(plus.runtime.appid)&&setTimeout(function(){d(plus.webview.currentWebview())},300),a.os.ios&&a.options.statusBarBackground&&plus.navigator.setStatusBarBackground(a.options.statusBarBackground),a.os.android&&parseFloat(a.os.version)<4.4&&null==plus.webview.currentWebview().parent()&&document.addEventListener(\"resume\",function(){var a=document.body;a.style.display=\"none\",setTimeout(function(){a.style.display=\"\"},10)})})}}),window.addEventListener(\"preload\",function(){var b=a.options.preloadPages||[];a.plusReady(function(){a.each(b,function(b,c){a.createWindow(a.extend(c,{preload:!0}))})})}),a.supportStatusbarOffset=function(){return a.os.plus&&a.os.ios&&parseFloat(a.os.version)>=7},a.ready(function(){a.supportStatusbarOffset()&&document.body.classList.add(\"mui-statusbar\")})}(mui),function(a,b){a.addBack=function(b){return a.addAction(\"backs\",b)},a.addBack({name:\"browser\",index:100,handle:function(){return b.history.length>1?(b.history.back(),!0):!1}}),a.back=function(){(\"function\"!=typeof a.options.beforeback||a.options.beforeback()!==!1)&&a.doAction(\"backs\")},b.addEventListener(\"tap\",function(b){var c=a.targets.action;c&&c.classList.contains(\"mui-action-back\")&&(a.back(),a.targets.action=!1)}),b.addEventListener(\"swiperight\",function(b){var c=b.detail;a.options.swipeBack===!0&&Math.abs(c.angle)<3&&a.back()})}(mui,window),function(a,b){a.os.plus&&a.os.android&&a.addBack({name:\"mui\",index:5,handle:function(){if(a.targets._popover&&a.targets._popover.classList.contains(\"mui-active\"))return a(a.targets._popover).popover(\"hide\"),!0;var b=document.querySelector(\".mui-off-canvas-wrap.mui-active\");if(b)return a(b).offCanvas(\"close\"),!0;var c=a.isFunction(a.getPreviewImage)&&a.getPreviewImage();return c&&c.isShown()?(c.close(),!0):a.closePopup()}}),a.__back__first=null,a.addBack({name:\"5+\",index:10,handle:function(){if(!b.plus)return!1;var c=plus.webview.currentWebview(),d=c.parent();return d?d.evalJS(\"mui&&mui.back();\"):c.canBack(function(d){d.canBack?b.history.back():c.id===plus.runtime.appid?a.__back__first?(new Date).getTime()-a.__back__first<2e3&&plus.runtime.quit():(a.__back__first=(new Date).getTime(),mui.toast(\"再按一次退出应用\"),setTimeout(function(){a.__back__first=null},2e3)):c.preload?c.hide(\"auto\"):a.closeAll(c)}),!0}}),a.menu=function(){var c=document.querySelector(\".mui-action-menu\");if(c)a.trigger(c,a.EVENT_START),a.trigger(c,\"tap\");else if(b.plus){var d=a.currentWebview,e=d.parent();\ne&&e.evalJS(\"mui&&mui.menu();\")}};var c=function(){a.back()},d=function(){a.menu()};a.plusReady(function(){a.options.keyEventBind.backbutton&&plus.key.addEventListener(\"backbutton\",c,!1),a.options.keyEventBind.menubutton&&plus.key.addEventListener(\"menubutton\",d,!1)}),a.addInit({name:\"keyEventBind\",index:1e3,handle:function(){a.plusReady(function(){a.options.keyEventBind.backbutton||plus.key.removeEventListener(\"backbutton\",c),a.options.keyEventBind.menubutton||plus.key.removeEventListener(\"menubutton\",d)})}})}(mui,window),function(a){a.addInit({name:\"pullrefresh\",index:1e3,handle:function(){var b=a.options,c=b.pullRefresh||{},d=c.down&&c.down.hasOwnProperty(\"callback\"),e=c.up&&c.up.hasOwnProperty(\"callback\");if(d||e){var f=c.container;if(f){var g=a(f);1===g.length&&(a.os.plus?d&&\"circle\"==c.down.style?a.plusReady(function(){a.fn.pullRefresh=a.fn.pullRefresh_native,g.pullRefresh(c)}):a.os.android?a.plusReady(function(){a.fn.pullRefresh=a.fn.pullRefresh_native;var b=plus.webview.currentWebview();if(window.__NWin_Enable__===!1)g.pullRefresh(c);else{if(e){var f={};f.up=c.up,f.webviewId=b.id||b.getURL(),g.pullRefresh(f)}if(d){var h=b.parent(),i=b.id||b.getURL();if(h){e||g.pullRefresh({webviewId:i});var j={webviewId:i};j.down=a.extend({},c.down),j.down.callback=\"_CALLBACK\",h.evalJS(\"mui.fn.pullRefresh=mui.fn.pullRefresh_native\"),h.evalJS(\"mui&&mui(document.querySelector('.mui-content')).pullRefresh('\"+JSON.stringify(j)+\"')\")}}}}):g.pullRefresh(c):g.pullRefresh(c))}}}})}(mui),function(a,b,c){var d=\"application/json\",e=\"text/html\",f=/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi,g=/^(?:text|application)\\/javascript/i,h=/^(?:text|application)\\/xml/i,i=/^\\s*$/;a.ajaxSettings={type:\"GET\",beforeSend:a.noop,success:a.noop,error:a.noop,complete:a.noop,context:null,xhr:function(a){return new b.XMLHttpRequest},accepts:{script:\"text/javascript, application/javascript, application/x-javascript\",json:d,xml:\"application/xml, text/xml\",html:e,text:\"text/plain\"},timeout:0,processData:!0,cache:!0};var j=function(a,b){var c=b.context;return b.beforeSend.call(c,a,b)===!1?!1:void 0},k=function(a,b,c){c.success.call(c.context,a,\"success\",b),m(\"success\",b,c)},l=function(a,b,c,d){d.error.call(d.context,c,b,a),m(b,c,d)},m=function(a,b,c){c.complete.call(c.context,b,a)},n=function(b,c,d,e){var f,g=a.isArray(c),h=a.isPlainObject(c);a.each(c,function(c,i){f=a.type(i),e&&(c=d?e:e+\"[\"+(h||\"object\"===f||\"array\"===f?c:\"\")+\"]\"),!e&&g?b.add(i.name,i.value):\"array\"===f||!d&&\"object\"===f?n(b,i,d,c):b.add(c,i)})},o=function(b){if(b.processData&&b.data&&\"string\"!=typeof b.data){var e=b.contentType;!e&&b.headers&&(e=b.headers[\"Content-Type\"]),e&&~e.indexOf(d)?b.data=JSON.stringify(b.data):b.data=a.param(b.data,b.traditional)}!b.data||b.type&&\"GET\"!==b.type.toUpperCase()||(b.url=p(b.url,b.data),b.data=c)},p=function(a,b){return\"\"===b?a:(a+\"&\"+b).replace(/[&?]{1,2}/,\"?\")},q=function(a){return a&&(a=a.split(\";\",2)[0]),a&&(a===e?\"html\":a===d?\"json\":g.test(a)?\"script\":h.test(a)&&\"xml\")||\"text\"},r=function(b,d,e,f){return a.isFunction(d)&&(f=e,e=d,d=c),a.isFunction(e)||(f=e,e=c),{url:b,data:d,success:e,dataType:f}};a.ajax=function(d,e){\"object\"==typeof d&&(e=d,d=c);var f=e||{};f.url=d||f.url;for(var g in a.ajaxSettings)f[g]===c&&(f[g]=a.ajaxSettings[g]);o(f);var h=f.dataType;f.cache!==!1&&(e&&e.cache===!0||\"script\"!==h)||(f.url=p(f.url,\"_=\"+a.now()));var m,n=f.accepts[h&&h.toLowerCase()],r={},s=function(a,b){r[a.toLowerCase()]=[a,b]},t=/^([\\w-]+:)\\/\\//.test(f.url)?RegExp.$1:b.location.protocol,u=f.xhr(f),v=u.setRequestHeader;if(s(\"X-Requested-With\",\"XMLHttpRequest\"),s(\"Accept\",n||\"*/*\"),(n=f.mimeType||n)&&(n.indexOf(\",\")>-1&&(n=n.split(\",\",2)[0]),u.overrideMimeType&&u.overrideMimeType(n)),(f.contentType||f.contentType!==!1&&f.data&&\"GET\"!==f.type.toUpperCase())&&s(\"Content-Type\",f.contentType||\"application/x-www-form-urlencoded\"),f.headers)for(var w in f.headers)s(w,f.headers[w]);if(u.setRequestHeader=s,u.onreadystatechange=function(){if(4===u.readyState){u.onreadystatechange=a.noop,clearTimeout(m);var b,c=!1,d=\"file:\"===t;if(u.status>=200&&u.status<300||304===u.status||0===u.status&&d&&u.responseText){h=h||q(f.mimeType||u.getResponseHeader(\"content-type\")),b=u.responseText;try{\"script\"===h?(1,eval)(b):\"xml\"===h?b=u.responseXML:\"json\"===h&&(b=i.test(b)?null:a.parseJSON(b))}catch(e){c=e}c?l(c,\"parsererror\",u,f):k(b,u,f)}else{var g=u.status?\"error\":\"abort\",j=u.statusText||null;d&&(g=\"error\",j=\"404\"),l(j,g,u,f)}}},j(u,f)===!1)return u.abort(),l(null,\"abort\",u,f),u;if(f.xhrFields)for(var w in f.xhrFields)u[w]=f.xhrFields[w];var x=\"async\"in f?f.async:!0;u.open(f.type.toUpperCase(),f.url,x,f.username,f.password);for(var w in r)r.hasOwnProperty(w)&&v.apply(u,r[w]);return f.timeout>0&&(m=setTimeout(function(){u.onreadystatechange=a.noop,u.abort(),l(null,\"timeout\",u,f)},f.timeout)),u.send(f.data?f.data:null),u},a.param=function(a,b){var c=[];return c.add=function(a,b){this.push(encodeURIComponent(a)+\"=\"+encodeURIComponent(b))},n(c,a,b),c.join(\"&\").replace(/%20/g,\"+\")},a.get=function(){return a.ajax(r.apply(null,arguments))},a.post=function(){var b=r.apply(null,arguments);return b.type=\"POST\",a.ajax(b)},a.getJSON=function(){var b=r.apply(null,arguments);return b.dataType=\"json\",a.ajax(b)},a.fn.load=function(b,c,d){if(!this.length)return this;var e,g=this,h=b.split(/\\s/),i=r(b,c,d),j=i.success;return h.length>1&&(i.url=h[0],e=h[1]),i.success=function(a){if(e){var b=document.createElement(\"div\");b.innerHTML=a.replace(f,\"\");var c=document.createElement(\"div\"),d=b.querySelectorAll(e);if(d&&d.length>0)for(var h=0,i=d.length;i>h;h++)c.appendChild(d[h]);g[0].innerHTML=c.innerHTML}else g[0].innerHTML=a;j&&j.apply(g,arguments)},a.ajax(i),this}}(mui,window),function(a){var b=document.createElement(\"a\");b.href=window.location.href,a.plusReady(function(){a.ajaxSettings=a.extend(a.ajaxSettings,{xhr:function(c){if(c.crossDomain)return new plus.net.XMLHttpRequest;if(\"file:\"!==b.protocol){var d=document.createElement(\"a\");if(d.href=c.url,d.href=d.href,c.crossDomain=b.protocol+\"//\"+b.host!=d.protocol+\"//\"+d.host,c.crossDomain)return new plus.net.XMLHttpRequest}return a.os.ios&&window.webkit&&window.webkit.messageHandlers?new plus.net.XMLHttpRequest:new window.XMLHttpRequest}})})}(mui),function(a,b,c){a.offset=function(a){var d={top:0,left:0};return typeof a.getBoundingClientRect!==c&&(d=a.getBoundingClientRect()),{top:d.top+b.pageYOffset-a.clientTop,left:d.left+b.pageXOffset-a.clientLeft}}}(mui,window),function(a,b){a.scrollTo=function(a,c,d){c=c||1e3;var e=function(c){if(0>=c)return b.scrollTo(0,a),void(d&&d());var f=a-b.scrollY;setTimeout(function(){b.scrollTo(0,b.scrollY+f/c*10),e(c-10)},16.7)};e(c)},a.animationFrame=function(a){var b,c,d;return function(){b=arguments,d=this,c||(c=!0,requestAnimationFrame(function(){a.apply(d,b),c=!1}))}}}(mui,window),function(a){var b=!1,c=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,d=function(){};d.extend=function(a){function d(){!b&&this.init&&this.init.apply(this,arguments)}var e=this.prototype;b=!0;var f=new this;b=!1;for(var g in a)f[g]=\"function\"==typeof a[g]&&\"function\"==typeof e[g]&&c.test(a[g])?function(a,b){return function(){var c=this._super;this._super=e[a];var d=b.apply(this,arguments);return this._super=c,d}}(g,a[g]):a[g];return d.prototype=f,d.prototype.constructor=d,d.extend=arguments.callee,d},a.Class=d}(mui),function(a,b,c){var d=\"mui-pull-top-pocket\",e=\"mui-pull-bottom-pocket\",f=\"mui-pull\",g=\"mui-pull-loading\",h=\"mui-pull-caption\",i=\"mui-pull-caption-down\",j=\"mui-pull-caption-refresh\",k=\"mui-pull-caption-nomore\",l=\"mui-icon\",m=\"mui-spinner\",n=\"mui-icon-pulldown\",o=\"mui-block\",p=\"mui-hidden\",q=\"mui-visibility\",r=g+\" \"+l+\" \"+n,s=g+\" \"+l+\" \"+n,t=g+\" \"+l+\" \"+m,u=['<div class=\"'+f+'\">','<div class=\"{icon}\"></div>','<div class=\"'+h+'\">{contentrefresh}</div>',\"</div>\"].join(\"\"),v={init:function(b,c){this._super(b,a.extend(!0,{scrollY:!0,scrollX:!1,indicators:!0,deceleration:.003,down:{height:50,contentinit:\"下拉可以刷新\",contentdown:\"下拉可以刷新\",contentover:\"释放立即刷新\",contentrefresh:\"正在刷新...\"},up:{height:50,auto:!1,contentinit:\"上拉显示更多\",contentdown:\"上拉显示更多\",contentrefresh:\"正在加载...\",contentnomore:\"没有更多数据了\",duration:300}},c))},_init:function(){this._super(),this._initPocket()},_initPulldownRefresh:function(){this.pulldown=!0,this.topPocket&&(this.pullPocket=this.topPocket,this.pullPocket.classList.add(o),this.pullPocket.classList.add(q),this.pullCaption=this.topCaption,this.pullLoading=this.topLoading)},_initPullupRefresh:function(){this.pulldown=!1,this.bottomPocket&&(this.pullPocket=this.bottomPocket,this.pullPocket.classList.add(o),this.pullPocket.classList.add(q),this.pullCaption=this.bottomCaption,this.pullLoading=this.bottomLoading)},_initPocket:function(){var a=this.options;a.down&&a.down.hasOwnProperty(\"callback\")&&(this.topPocket=this.scroller.querySelector(\".\"+d),this.topPocket||(this.topPocket=this._createPocket(d,a.down,s),this.wrapper.insertBefore(this.topPocket,this.wrapper.firstChild)),this.topLoading=this.topPocket.querySelector(\".\"+g),this.topCaption=this.topPocket.querySelector(\".\"+h)),a.up&&a.up.hasOwnProperty(\"callback\")&&(this.bottomPocket=this.scroller.querySelector(\".\"+e),this.bottomPocket||(this.bottomPocket=this._createPocket(e,a.up,t),this.scroller.appendChild(this.bottomPocket)),this.bottomLoading=this.bottomPocket.querySelector(\".\"+g),this.bottomCaption=this.bottomPocket.querySelector(\".\"+h),this.wrapper.addEventListener(\"scrollbottom\",this))},_createPocket:function(a,c,d){var e=b.createElement(\"div\");return e.className=a,e.innerHTML=u.replace(\"{contentrefresh}\",c.contentinit).replace(\"{icon}\",d),e},_resetPullDownLoading:function(){var a=this.pullLoading;a&&(this.pullCaption.innerHTML=this.options.down.contentdown,a.style.webkitTransition=\"\",a.style.webkitTransform=\"\",a.style.webkitAnimation=\"\",a.className=s)},_setCaptionClass:function(a,b,c){if(!a)switch(c){case this.options.up.contentdown:b.className=h+\" \"+i;break;case this.options.up.contentrefresh:b.className=h+\" \"+j;break;case this.options.up.contentnomore:b.className=h+\" \"+k}},_setCaption:function(a,b){if(!this.loading){var c=this.options,d=this.pullPocket,e=this.pullCaption,f=this.pullLoading,g=this.pulldown,h=this;d&&(b?setTimeout(function(){e.innerHTML=h.lastTitle=a,g?f.className=s:(h._setCaptionClass(!1,e,a),f.className=t),f.style.webkitAnimation=\"\",f.style.webkitTransition=\"\",f.style.webkitTransform=\"\"},100):a!==this.lastTitle&&(e.innerHTML=a,g?a===c.down.contentrefresh?(f.className=t,f.style.webkitAnimation=\"spinner-spin 1s step-end infinite\"):a===c.down.contentover?(f.className=r,f.style.webkitTransition=\"-webkit-transform 0.3s ease-in\",f.style.webkitTransform=\"rotate(180deg)\"):a===c.down.contentdown&&(f.className=s,f.style.webkitTransition=\"-webkit-transform 0.3s ease-in\",f.style.webkitTransform=\"rotate(0deg)\"):(a===c.up.contentrefresh?f.className=t+\" \"+q:f.className=t+\" \"+p,h._setCaptionClass(!1,e,a)),this.lastTitle=a))}}};a.PullRefresh=v}(mui,document),function(a,b,c,d){var e=\"mui-scroll\",f=\"mui-scrollbar\",g=\"mui-scrollbar-indicator\",h=f+\"-vertical\",i=f+\"-horizontal\",j=\"mui-active\",k={quadratic:{style:\"cubic-bezier(0.25, 0.46, 0.45, 0.94)\",fn:function(a){return a*(2-a)}},circular:{style:\"cubic-bezier(0.1, 0.57, 0.1, 1)\",fn:function(a){return Math.sqrt(1- --a*a)}},outCirc:{style:\"cubic-bezier(0.075, 0.82, 0.165, 1)\"},outCubic:{style:\"cubic-bezier(0.165, 0.84, 0.44, 1)\"}},l=a.Class.extend({init:function(b,c){this.wrapper=this.element=b,this.scroller=this.wrapper.children[0],this.scrollerStyle=this.scroller&&this.scroller.style,this.stopped=!1,this.options=a.extend(!0,{scrollY:!0,scrollX:!1,startX:0,startY:0,indicators:!0,stopPropagation:!1,hardwareAccelerated:!0,fixedBadAndorid:!1,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT|VIDEO)$/},momentum:!0,snapX:.5,snap:!1,bounce:!0,bounceTime:500,bounceEasing:k.outCirc,scrollTime:500,scrollEasing:k.outCubic,directionLockThreshold:5,parallaxElement:!1,parallaxRatio:.5},c),this.x=0,this.y=0,this.translateZ=this.options.hardwareAccelerated?\" translateZ(0)\":\"\",this._init(),this.scroller&&(this.refresh(),this.scrollTo(this.options.startX,this.options.startY))},_init:function(){this._initParallax(),this._initIndicators(),this._initEvent()},_initParallax:function(){this.options.parallaxElement&&(this.parallaxElement=c.querySelector(this.options.parallaxElement),this.parallaxStyle=this.parallaxElement.style,this.parallaxHeight=this.parallaxElement.offsetHeight,this.parallaxImgStyle=this.parallaxElement.querySelector(\"img\").style)},_initIndicators:function(){var a=this;if(a.indicators=[],this.options.indicators){var b,c=[];a.options.scrollY&&(b={el:this._createScrollBar(h),listenX:!1},this.wrapper.appendChild(b.el),c.push(b)),this.options.scrollX&&(b={el:this._createScrollBar(i),listenY:!1},this.wrapper.appendChild(b.el),c.push(b));for(var d=c.length;d--;)this.indicators.push(new m(this,c[d]))}},_initSnap:function(){this.currentPage={},this.pages=[];for(var a=this.snaps,b=a.length,c=0,d=-1,e=0,f=0,g=0,h=0,i=0;b>i;i++){var k=a[i],l=k.offsetLeft,m=k.offsetWidth;(0===i||l<=a[i-1].offsetLeft)&&(c=0,d++),this.pages[c]||(this.pages[c]=[]),e=this._getSnapX(l),h=Math.round(m*this.options.snapX),f=e-h,g=e-m+h,this.pages[c][d]={x:e,leftX:f,rightX:g,pageX:c,element:k},k.classList.contains(j)&&(this.currentPage=this.pages[c][0]),e>=this.maxScrollX&&c++}this.options.startX=this.currentPage.x||0},_getSnapX:function(a){return Math.max(Math.min(0,-a+this.wrapperWidth/2),this.maxScrollX)},_gotoPage:function(a){this.currentPage=this.pages[Math.min(a,this.pages.length-1)][0];for(var b=0,c=this.snaps.length;c>b;b++)b===a?this.snaps[b].classList.add(j):this.snaps[b].classList.remove(j);this.scrollTo(this.currentPage.x,0,this.options.scrollTime)},_nearestSnap:function(a){if(!this.pages.length)return{x:0,pageX:0};var b=0,c=this.pages.length;for(a>0?a=0:a<this.maxScrollX&&(a=this.maxScrollX);c>b;b++){var d=\"left\"===this.direction?this.pages[b][0].leftX:this.pages[b][0].rightX;if(a>=d)return this.pages[b][0]}return{x:0,pageX:0}},_initEvent:function(c){var d=c?\"removeEventListener\":\"addEventListener\";b[d](\"orientationchange\",this),b[d](\"resize\",this),this.scroller[d](\"webkitTransitionEnd\",this),this.wrapper[d](a.EVENT_START,this),this.wrapper[d](a.EVENT_CANCEL,this),this.wrapper[d](a.EVENT_END,this),this.wrapper[d](\"drag\",this),this.wrapper[d](\"dragend\",this),this.wrapper[d](\"flick\",this),this.wrapper[d](\"scrollend\",this),this.options.scrollX&&this.wrapper[d](\"swiperight\",this);var e=this.wrapper.querySelector(\".mui-segmented-control\");e&&mui(e)[c?\"off\":\"on\"](\"click\",\"a\",a.preventDefault),this.wrapper[d](\"scrollstart\",this),this.wrapper[d](\"refresh\",this)},_handleIndicatorScrollend:function(){this.indicators.map(function(a){a.fade()})},_handleIndicatorScrollstart:function(){this.indicators.map(function(a){a.fade(1)})},_handleIndicatorRefresh:function(){this.indicators.map(function(a){a.refresh()})},handleEvent:function(b){if(this.stopped)return void this.resetPosition();switch(b.type){case a.EVENT_START:this._start(b);break;case\"drag\":this.options.stopPropagation&&b.stopPropagation(),this._drag(b);break;case\"dragend\":case\"flick\":this.options.stopPropagation&&b.stopPropagation(),this._flick(b);break;case a.EVENT_CANCEL:case a.EVENT_END:this._end(b);break;case\"webkitTransitionEnd\":this.transitionTimer&&this.transitionTimer.cancel(),this._transitionEnd(b);break;case\"scrollstart\":this._handleIndicatorScrollstart(b);break;case\"scrollend\":this._handleIndicatorScrollend(b),this._scrollend(b),b.stopPropagation();break;case\"orientationchange\":case\"resize\":this._resize();break;case\"swiperight\":b.stopPropagation();break;case\"refresh\":this._handleIndicatorRefresh(b)}},_start:function(b){if(this.moved=this.needReset=!1,this._transitionTime(),this.isInTransition){this.needReset=!0,this.isInTransition=!1;var c=a.parseTranslateMatrix(a.getStyles(this.scroller,\"webkitTransform\"));this.setTranslate(Math.round(c.x),Math.round(c.y)),a.trigger(this.scroller,\"scrollend\",this),b.preventDefault()}this.reLayout(),a.trigger(this.scroller,\"beforescrollstart\",this)},_getDirectionByAngle:function(a){return-80>a&&a>-100?\"up\":a>=80&&100>a?\"down\":a>=170||-170>=a?\"left\":a>=-35&&10>=a?\"right\":null},_drag:function(c){var d=c.detail;if((this.options.scrollY||\"up\"===d.direction||\"down\"===d.direction)&&a.os.ios&&parseFloat(a.os.version)>=8){var e=d.gesture.touches[0].clientY;if(e+10>b.innerHeight||10>e)return void this.resetPosition(this.options.bounceTime)}var f=isReturn=!1;this._getDirectionByAngle(d.angle);if(\"left\"===d.direction||\"right\"===d.direction?this.options.scrollX?(f=!0,this.moved||(a.gestures.session.lockDirection=!0,a.gestures.session.startDirection=d.direction)):this.options.scrollY&&!this.moved&&(isReturn=!0):\"up\"===d.direction||\"down\"===d.direction?this.options.scrollY?(f=!0,this.moved||(a.gestures.session.lockDirection=!0,a.gestures.session.startDirection=d.direction)):this.options.scrollX&&!this.moved&&(isReturn=!0):isReturn=!0,(this.moved||f)&&(c.stopPropagation(),d.gesture&&d.gesture.preventDefault()),!isReturn){this.moved?c.stopPropagation():a.trigger(this.scroller,\"scrollstart\",this);var g=0,h=0;this.moved?(g=d.deltaX-a.gestures.session.prevTouch.deltaX,h=d.deltaY-a.gestures.session.prevTouch.deltaY):(g=d.deltaX,h=d.deltaY);var i=Math.abs(d.deltaX),j=Math.abs(d.deltaY);i>j+this.options.directionLockThreshold?h=0:j>=i+this.options.directionLockThreshold&&(g=0),g=this.hasHorizontalScroll?g:0,h=this.hasVerticalScroll?h:0;var k=this.x+g,l=this.y+h;(k>0||k<this.maxScrollX)&&(k=this.options.bounce?this.x+g/3:k>0?0:this.maxScrollX),(l>0||l<this.maxScrollY)&&(l=this.options.bounce?this.y+h/3:l>0?0:this.maxScrollY),this.requestAnimationFrame||this._updateTranslate(),this.direction=d.deltaX>0?\"right\":\"left\",this.moved=!0,this.x=k,this.y=l,a.trigger(this.scroller,\"scroll\",this)}},_flick:function(b){if(this.moved){b.stopPropagation();var c=b.detail;if(this._clearRequestAnimationFrame(),\"dragend\"!==b.type||!c.flick){var d=Math.round(this.x),e=Math.round(this.y);if(this.isInTransition=!1,!this.resetPosition(this.options.bounceTime)){if(this.scrollTo(d,e),\"dragend\"===b.type)return void a.trigger(this.scroller,\"scrollend\",this);var f=0,g=\"\";return this.options.momentum&&c.flickTime<300&&(momentumX=this.hasHorizontalScroll?this._momentum(this.x,c.flickDistanceX,c.flickTime,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:d,duration:0},momentumY=this.hasVerticalScroll?this._momentum(this.y,c.flickDistanceY,c.flickTime,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:e,duration:0},d=momentumX.destination,e=momentumY.destination,f=Math.max(momentumX.duration,momentumY.duration),this.isInTransition=!0),d!=this.x||e!=this.y?((d>0||d<this.maxScrollX||e>0||e<this.maxScrollY)&&(g=k.quadratic),void this.scrollTo(d,e,f,g)):void a.trigger(this.scroller,\"scrollend\",this)}}}},_end:function(b){this.needReset=!1,(!this.moved&&this.needReset||b.type===a.EVENT_CANCEL)&&this.resetPosition()},_transitionEnd:function(b){b.target==this.scroller&&this.isInTransition&&(this._transitionTime(),this.resetPosition(this.options.bounceTime)||(this.isInTransition=!1,a.trigger(this.scroller,\"scrollend\",this)))},_scrollend:function(b){(0===this.y&&0===this.maxScrollY||Math.abs(this.y)>0&&this.y<=this.maxScrollY)&&a.trigger(this.scroller,\"scrollbottom\",this)},_resize:function(){var a=this;clearTimeout(a.resizeTimeout),a.resizeTimeout=setTimeout(function(){a.refresh()},a.options.resizePolling)},_transitionTime:function(b){if(b=b||0,this.scrollerStyle.webkitTransitionDuration=b+\"ms\",this.parallaxElement&&this.options.scrollY&&(this.parallaxStyle.webkitTransitionDuration=b+\"ms\"),this.options.fixedBadAndorid&&!b&&a.os.isBadAndroid&&(this.scrollerStyle.webkitTransitionDuration=\"0.001s\",this.parallaxElement&&this.options.scrollY&&(this.parallaxStyle.webkitTransitionDuration=\"0.001s\")),this.indicators)for(var c=this.indicators.length;c--;)this.indicators[c].transitionTime(b);b&&(this.transitionTimer&&this.transitionTimer.cancel(),this.transitionTimer=a.later(function(){a.trigger(this.scroller,\"webkitTransitionEnd\")},b+100,this))},_transitionTimingFunction:function(a){if(this.scrollerStyle.webkitTransitionTimingFunction=a,this.parallaxElement&&this.options.scrollY&&(this.parallaxStyle.webkitTransitionDuration=a),this.indicators)for(var b=this.indicators.length;b--;)this.indicators[b].transitionTimingFunction(a)},_translate:function(a,b){this.x=a,this.y=b},_clearRequestAnimationFrame:function(){this.requestAnimationFrame&&(cancelAnimationFrame(this.requestAnimationFrame),this.requestAnimationFrame=null)},_updateTranslate:function(){var a=this;(a.x!==a.lastX||a.y!==a.lastY)&&a.setTranslate(a.x,a.y),a.requestAnimationFrame=requestAnimationFrame(function(){a._updateTranslate()})},_createScrollBar:function(a){var b=c.createElement(\"div\"),d=c.createElement(\"div\");return b.className=f+\" \"+a,d.className=g,b.appendChild(d),a===h?(this.scrollbarY=b,this.scrollbarIndicatorY=d):a===i&&(this.scrollbarX=b,this.scrollbarIndicatorX=d),this.wrapper.appendChild(b),b},_preventDefaultException:function(a,b){for(var c in b)if(b[c].test(a[c]))return!0;return!1},_reLayout:function(){if(this.hasHorizontalScroll||(this.maxScrollX=0,this.scrollerWidth=this.wrapperWidth),this.hasVerticalScroll||(this.maxScrollY=0,this.scrollerHeight=this.wrapperHeight),this.indicators.map(function(a){a.refresh()}),this.options.snap&&\"string\"==typeof this.options.snap){var a=this.scroller.querySelectorAll(this.options.snap);this.itemLength=0,this.snaps=[];for(var b=0,c=a.length;c>b;b++){var d=a[b];d.parentNode===this.scroller&&(this.itemLength++,this.snaps.push(d))}this._initSnap()}},_momentum:function(a,b,c,e,f,g){var h,i,j=parseFloat(Math.abs(b)/c);return g=g===d?6e-4:g,h=a+j*j/(2*g)*(0>b?-1:1),i=j/g,e>h?(h=f?e-f/2.5*(j/8):e,b=Math.abs(h-a),i=b/j):h>0&&(h=f?f/2.5*(j/8):0,b=Math.abs(a)+h,i=b/j),{destination:Math.round(h),duration:i}},_getTranslateStr:function(a,b){return this.options.hardwareAccelerated?\"translate3d(\"+a+\"px,\"+b+\"px,0px) \"+this.translateZ:\"translate(\"+a+\"px,\"+b+\"px) \"},setStopped:function(a){a?(this.disablePullupToRefresh(),this.disablePulldownToRefresh()):(this.enablePullupToRefresh(),this.enablePulldownToRefresh())},setTranslate:function(b,c){if(this.x=b,this.y=c,this.scrollerStyle.webkitTransform=this._getTranslateStr(b,c),this.parallaxElement&&this.options.scrollY){var d=c*this.options.parallaxRatio,e=1+d/((this.parallaxHeight-d)/2);e>1?(this.parallaxImgStyle.opacity=1-d/100*this.options.parallaxRatio,this.parallaxStyle.webkitTransform=this._getTranslateStr(0,-d)+\" scale(\"+e+\",\"+e+\")\"):(this.parallaxImgStyle.opacity=1,this.parallaxStyle.webkitTransform=this._getTranslateStr(0,-1)+\" scale(1,1)\")}if(this.indicators)for(var f=this.indicators.length;f--;)this.indicators[f].updatePosition();this.lastX=this.x,this.lastY=this.y,a.trigger(this.scroller,\"scroll\",this)},reLayout:function(){this.wrapper.offsetHeight;var b=parseFloat(a.getStyles(this.wrapper,\"padding-left\"))||0,c=parseFloat(a.getStyles(this.wrapper,\"padding-right\"))||0,d=parseFloat(a.getStyles(this.wrapper,\"padding-top\"))||0,e=parseFloat(a.getStyles(this.wrapper,\"padding-bottom\"))||0,f=this.wrapper.clientWidth,g=this.wrapper.clientHeight;this.scrollerWidth=this.scroller.offsetWidth,this.scrollerHeight=this.scroller.offsetHeight,this.wrapperWidth=f-b-c,this.wrapperHeight=g-d-e,this.maxScrollX=Math.min(this.wrapperWidth-this.scrollerWidth,0),this.maxScrollY=Math.min(this.wrapperHeight-this.scrollerHeight,0),this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0,this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0,this._reLayout()},resetPosition:function(a){var b=this.x,c=this.y;return a=a||0,!this.hasHorizontalScroll||this.x>0?b=0:this.x<this.maxScrollX&&(b=this.maxScrollX),!this.hasVerticalScroll||this.y>0?c=0:this.y<this.maxScrollY&&(c=this.maxScrollY),b==this.x&&c==this.y?!1:(this.scrollTo(b,c,a,this.options.scrollEasing),!0)},_reInit:function(){for(var a=this.wrapper.querySelectorAll(\".\"+e),b=0,c=a.length;c>b;b++)if(a[b].parentNode===this.wrapper){this.scroller=a[b];break}this.scrollerStyle=this.scroller&&this.scroller.style},refresh:function(){this._reInit(),this.reLayout(),a.trigger(this.scroller,\"refresh\",this),this.resetPosition()},scrollTo:function(a,b,c,d){var d=d||k.circular;this.isInTransition=c>0,this.isInTransition?(this._clearRequestAnimationFrame(),this._transitionTimingFunction(d.style),this._transitionTime(c),this.setTranslate(a,b)):this.setTranslate(a,b)},scrollToBottom:function(a,b){a=a||this.options.scrollTime,this.scrollTo(0,this.maxScrollY,a,b)},gotoPage:function(a){this._gotoPage(a)},destroy:function(){this._initEvent(!0),delete a.data[this.wrapper.getAttribute(\"data-scroll\")],this.wrapper.setAttribute(\"data-scroll\",\"\")}}),m=function(b,d){this.wrapper=\"string\"==typeof d.el?c.querySelector(d.el):d.el,this.wrapperStyle=this.wrapper.style,this.indicator=this.wrapper.children[0],this.indicatorStyle=this.indicator.style,this.scroller=b,this.options=a.extend({listenX:!0,listenY:!0,fade:!1,speedRatioX:0,speedRatioY:0},d),this.sizeRatioX=1,this.sizeRatioY=1,this.maxPosX=0,this.maxPosY=0,this.options.fade&&(this.wrapperStyle.webkitTransform=this.scroller.translateZ,this.wrapperStyle.webkitTransitionDuration=this.options.fixedBadAndorid&&a.os.isBadAndroid?\"0.001s\":\"0ms\",this.wrapperStyle.opacity=\"0\")};m.prototype={handleEvent:function(a){},transitionTime:function(b){b=b||0,this.indicatorStyle.webkitTransitionDuration=b+\"ms\",this.scroller.options.fixedBadAndorid&&!b&&a.os.isBadAndroid&&(this.indicatorStyle.webkitTransitionDuration=\"0.001s\")},transitionTimingFunction:function(a){this.indicatorStyle.webkitTransitionTimingFunction=a},refresh:function(){this.transitionTime(),this.options.listenX&&!this.options.listenY?this.indicatorStyle.display=this.scroller.hasHorizontalScroll?\"block\":\"none\":this.options.listenY&&!this.options.listenX?this.indicatorStyle.display=this.scroller.hasVerticalScroll?\"block\":\"none\":this.indicatorStyle.display=this.scroller.hasHorizontalScroll||this.scroller.hasVerticalScroll?\"block\":\"none\",this.wrapper.offsetHeight,this.options.listenX&&(this.wrapperWidth=this.wrapper.clientWidth,this.indicatorWidth=Math.max(Math.round(this.wrapperWidth*this.wrapperWidth/(this.scroller.scrollerWidth||this.wrapperWidth||1)),8),this.indicatorStyle.width=this.indicatorWidth+\"px\",this.maxPosX=this.wrapperWidth-this.indicatorWidth,this.minBoundaryX=0,this.maxBoundaryX=this.maxPosX,this.sizeRatioX=this.options.speedRatioX||this.scroller.maxScrollX&&this.maxPosX/this.scroller.maxScrollX),this.options.listenY&&(this.wrapperHeight=this.wrapper.clientHeight,this.indicatorHeight=Math.max(Math.round(this.wrapperHeight*this.wrapperHeight/(this.scroller.scrollerHeight||this.wrapperHeight||1)),8),this.indicatorStyle.height=this.indicatorHeight+\"px\",this.maxPosY=this.wrapperHeight-this.indicatorHeight,this.minBoundaryY=0,this.maxBoundaryY=this.maxPosY,this.sizeRatioY=this.options.speedRatioY||this.scroller.maxScrollY&&this.maxPosY/this.scroller.maxScrollY),this.updatePosition()},updatePosition:function(){var a=this.options.listenX&&Math.round(this.sizeRatioX*this.scroller.x)||0,b=this.options.listenY&&Math.round(this.sizeRatioY*this.scroller.y)||0;a<this.minBoundaryX?(this.width=Math.max(this.indicatorWidth+a,8),this.indicatorStyle.width=this.width+\"px\",a=this.minBoundaryX):a>this.maxBoundaryX?(this.width=Math.max(this.indicatorWidth-(a-this.maxPosX),8),this.indicatorStyle.width=this.width+\"px\",a=this.maxPosX+this.indicatorWidth-this.width):this.width!=this.indicatorWidth&&(this.width=this.indicatorWidth,this.indicatorStyle.width=this.width+\"px\"),b<this.minBoundaryY?(this.height=Math.max(this.indicatorHeight+3*b,8),this.indicatorStyle.height=this.height+\"px\",b=this.minBoundaryY):b>this.maxBoundaryY?(this.height=Math.max(this.indicatorHeight-3*(b-this.maxPosY),8),this.indicatorStyle.height=this.height+\"px\",b=this.maxPosY+this.indicatorHeight-this.height):this.height!=this.indicatorHeight&&(this.height=this.indicatorHeight,this.indicatorStyle.height=this.height+\"px\"),this.x=a,this.y=b,this.indicatorStyle.webkitTransform=this.scroller._getTranslateStr(a,b)},fade:function(a,b){if(!b||this.visible){clearTimeout(this.fadeTimeout),this.fadeTimeout=null;var c=a?250:500,d=a?0:300;a=a?\"1\":\"0\",this.wrapperStyle.webkitTransitionDuration=c+\"ms\",this.fadeTimeout=setTimeout(function(a){this.wrapperStyle.opacity=a,this.visible=+a}.bind(this,a),d)}}},a.Scroll=l,a.fn.scroll=function(b){var c=[];return this.each(function(){var d=null,e=this,f=e.getAttribute(\"data-scroll\");if(f)d=a.data[f];else{f=++a.uuid;var g=a.extend({},b);e.classList.contains(\"mui-segmented-control\")&&(g=a.extend(g,{scrollY:!1,scrollX:!0,indicators:!1,snap:\".mui-control-item\"})),a.data[f]=d=new l(e,g),e.setAttribute(\"data-scroll\",f)}c.push(d)}),1===c.length?c[0]:c}}(mui,window,document),function(a,b,c,d){var e=\"mui-visibility\",f=\"mui-hidden\",g=a.Scroll.extend(a.extend({handleEvent:function(a){this._super(a),\"scrollbottom\"===a.type&&a.target===this.scroller&&this._scrollbottom()},_scrollbottom:function(){this.pulldown||this.loading||(this.pulldown=!1,this._initPullupRefresh(),this.pullupLoading())},_start:function(a){a.touches&&a.touches.length&&a.touches[0].clientX>30&&a.target&&!this._preventDefaultException(a.target,this.options.preventDefaultException)&&a.preventDefault(),this.loading||(this.pulldown=this.pullPocket=this.pullCaption=this.pullLoading=!1),this._super(a)},_drag:function(a){this.y>=0&&this.disablePulldown&&\"down\"===a.detail.direction||(this._super(a),!this.pulldown&&!this.loading&&this.topPocket&&\"down\"===a.detail.direction&&this.y>=0&&this._initPulldownRefresh(),this.pulldown&&this._setCaption(this.y>this.options.down.height?this.options.down.contentover:this.options.down.contentdown))},_reLayout:function(){this.hasVerticalScroll=!0,this._super()},resetPosition:function(a){if(this.pulldown&&!this.disablePulldown){if(this.y>=this.options.down.height)return this.pulldownLoading(d,a||0),!0;!this.loading&&this.topPocket.classList.remove(e)}return this._super(a)},pulldownLoading:function(a,b){if(\"undefined\"==typeof a&&(a=this.options.down.height),this.scrollTo(0,a,b,this.options.bounceEasing),!this.loading){this._initPulldownRefresh(),this._setCaption(this.options.down.contentrefresh),this.loading=!0,this.indicators.map(function(a){a.fade(0)});var c=this.options.down.callback;c&&c.call(this)}},endPulldownToRefresh:function(){var a=this;a.topPocket&&a.loading&&this.pulldown&&(a.scrollTo(0,0,a.options.bounceTime,a.options.bounceEasing),a.loading=!1,a._setCaption(a.options.down.contentdown,!0),setTimeout(function(){a.loading||a.topPocket.classList.remove(e)},350))},pullupLoading:function(a,b,c){b=b||0,this.scrollTo(b,this.maxScrollY,c,this.options.bounceEasing),this.loading||(this._initPullupRefresh(),this._setCaption(this.options.up.contentrefresh),this.indicators.map(function(a){a.fade(0)}),this.loading=!0,a=a||this.options.up.callback,a&&a.call(this))},endPullupToRefresh:function(a){var b=this;b.bottomPocket&&(b.loading=!1,a?(this.finished=!0,b._setCaption(b.options.up.contentnomore),b.wrapper.removeEventListener(\"scrollbottom\",b)):(b._setCaption(b.options.up.contentdown),b.loading||b.bottomPocket.classList.remove(e)))},disablePullupToRefresh:function(){this._initPullupRefresh(),this.bottomPocket.className=\"mui-pull-bottom-pocket \"+f,this.wrapper.removeEventListener(\"scrollbottom\",this)},disablePulldownToRefresh:function(){this._initPulldownRefresh(),this.topPocket.className=\"mui-pull-top-pocket \"+f,this.disablePulldown=!0},enablePulldownToRefresh:function(){this._initPulldownRefresh(),this.topPocket.classList.remove(f),this._setCaption(this.options.down.contentdown),this.disablePulldown=!1},enablePullupToRefresh:function(){this._initPullupRefresh(),this.bottomPocket.classList.remove(f),this._setCaption(this.options.up.contentdown),this.wrapper.addEventListener(\"scrollbottom\",this)},refresh:function(a){a&&this.finished&&(this.enablePullupToRefresh(),this.finished=!1),\nthis._super()}},a.PullRefresh));a.fn.pullRefresh=function(b){if(1===this.length){var c=this[0],d=null,e=c.getAttribute(\"data-pullrefresh\");return e||\"undefined\"!=typeof b?(b=b||{},e?d=a.data[e]:(e=++a.uuid,a.data[e]=d=new g(c,b),c.setAttribute(\"data-pullrefresh\",e)),b.down&&b.down.auto?d.pulldownLoading(b.down.autoY):b.up&&b.up.auto&&d.pullupLoading(),d):!1}}}(mui,window,document),function(a,b){var c=\"mui-slider\",d=\"mui-slider-group\",e=\"mui-slider-loop\",f=\"mui-action-previous\",g=\"mui-action-next\",h=\"mui-slider-item\",i=\"mui-active\",j=\".\"+h,k=\".mui-slider-progress-bar\",l=a.Slider=a.Scroll.extend({init:function(b,c){this._super(b,a.extend(!0,{fingers:1,interval:0,scrollY:!1,scrollX:!0,indicators:!1,scrollTime:1e3,startX:!1,slideTime:0,snap:j},c)),this.options.startX},_init:function(){this._reInit(),this.scroller&&(this.scrollerStyle=this.scroller.style,this.progressBar=this.wrapper.querySelector(k),this.progressBar&&(this.progressBarWidth=this.progressBar.offsetWidth,this.progressBarStyle=this.progressBar.style),this._super(),this._initTimer())},_triggerSlide:function(){var b=this;b.isInTransition=!1;b.currentPage;b.slideNumber=b._fixedSlideNumber(),b.loop&&(0===b.slideNumber?b.setTranslate(b.pages[1][0].x,0):b.slideNumber===b.itemLength-3&&b.setTranslate(b.pages[b.itemLength-2][0].x,0)),b.lastSlideNumber!=b.slideNumber&&(b.lastSlideNumber=b.slideNumber,b.lastPage=b.currentPage,a.trigger(b.wrapper,\"slide\",{slideNumber:b.slideNumber})),b._initTimer()},_handleSlide:function(b){var c=this;if(b.target===c.wrapper){var d=b.detail;d.slideNumber=d.slideNumber||0;for(var e=c.scroller.querySelectorAll(j),f=[],g=0,h=e.length;h>g;g++){var k=e[g];k.parentNode===c.scroller&&f.push(k)}var l=d.slideNumber;if(c.loop&&(l+=1),!c.wrapper.classList.contains(\"mui-segmented-control\"))for(var g=0,h=f.length;h>g;g++){var k=f[g];k.parentNode===c.scroller&&(g===l?k.classList.add(i):k.classList.remove(i))}var m=c.wrapper.querySelector(\".mui-slider-indicator\");if(m){m.getAttribute(\"data-scroll\")&&a(m).scroll().gotoPage(d.slideNumber);var n=m.querySelectorAll(\".mui-indicator\");if(n.length>0)for(var g=0,h=n.length;h>g;g++)n[g].classList[g===d.slideNumber?\"add\":\"remove\"](i);else{var o=m.querySelector(\".mui-number span\");if(o)o.innerText=d.slideNumber+1;else for(var p=m.querySelectorAll(\".mui-control-item\"),g=0,h=p.length;h>g;g++)p[g].classList[g===d.slideNumber?\"add\":\"remove\"](i)}}b.stopPropagation()}},_handleTabShow:function(a){var b=this;b.gotoItem(a.detail.tabNumber||0,b.options.slideTime)},_handleIndicatorTap:function(a){var b=this,c=a.target;(c.classList.contains(f)||c.classList.contains(g))&&(b[c.classList.contains(f)?\"prevItem\":\"nextItem\"](),a.stopPropagation())},_initEvent:function(b){var c=this;c._super(b);var d=b?\"removeEventListener\":\"addEventListener\";c.wrapper[d](\"slide\",this),c.wrapper[d](a.eventName(\"shown\",\"tab\"),this)},handleEvent:function(b){switch(this._super(b),b.type){case\"slide\":this._handleSlide(b);break;case a.eventName(\"shown\",\"tab\"):~this.snaps.indexOf(b.target)&&this._handleTabShow(b)}},_scrollend:function(a){this._super(a),this._triggerSlide(a)},_drag:function(a){this._super(a);var c=a.detail.direction;if(\"left\"===c||\"right\"===c){var d=this.wrapper.getAttribute(\"data-slidershowTimer\");d&&b.clearTimeout(d),a.stopPropagation()}},_initTimer:function(){var a=this,c=a.wrapper,d=a.options.interval,e=c.getAttribute(\"data-slidershowTimer\");e&&b.clearTimeout(e),d&&(e=b.setTimeout(function(){c&&((c.offsetWidth||c.offsetHeight)&&a.nextItem(!0),a._initTimer())},d),c.setAttribute(\"data-slidershowTimer\",e))},_fixedSlideNumber:function(a){a=a||this.currentPage;var b=a.pageX;return this.loop&&(b=0===a.pageX?this.itemLength-3:a.pageX===this.itemLength-1?0:a.pageX-1),b},_reLayout:function(){this.hasHorizontalScroll=!0,this.loop=this.scroller.classList.contains(e),this._super()},_getScroll:function(){var b=a.parseTranslateMatrix(a.getStyles(this.scroller,\"webkitTransform\"));return b?b.x:0},_transitionEnd:function(b){b.target===this.scroller&&this.isInTransition&&(this._transitionTime(),this.isInTransition=!1,a.trigger(this.wrapper,\"scrollend\",this))},_flick:function(a){if(this.moved){var b=a.detail,c=b.direction;this._clearRequestAnimationFrame(),this.isInTransition=!0,\"flick\"===a.type?(b.deltaTime<200&&(this.x=this._getPage(this.slideNumber+(\"right\"===c?-1:1),!0).x),this.resetPosition(this.options.bounceTime)):\"dragend\"!==a.type||b.flick||this.resetPosition(this.options.bounceTime),a.stopPropagation()}},_initSnap:function(){if(this.scrollerWidth=this.itemLength*this.scrollerWidth,this.maxScrollX=Math.min(this.wrapperWidth-this.scrollerWidth,0),this._super(),this.currentPage.x)this.slideNumber=this._fixedSlideNumber(),this.lastSlideNumber=\"undefined\"==typeof this.lastSlideNumber?this.slideNumber:this.lastSlideNumber;else{var a=this.pages[this.loop?1:0];if(a=a||this.pages[0],!a)return;this.currentPage=a[0],this.slideNumber=0,this.lastSlideNumber=\"undefined\"==typeof this.lastSlideNumber?0:this.lastSlideNumber}this.options.startX=this.currentPage.x||0},_getSnapX:function(a){return Math.max(-a,this.maxScrollX)},_getPage:function(a,b){return this.loop?a>this.itemLength-(b?2:3)?(a=1,time=0):(b?-1:0)>a?(a=this.itemLength-2,time=0):a+=1:(b||(a>this.itemLength-1?(a=0,time=0):0>a&&(a=this.itemLength-1,time=0)),a=Math.min(Math.max(0,a),this.itemLength-1)),this.pages[a][0]},_gotoItem:function(b,c){this.currentPage=this._getPage(b,!0),this.scrollTo(this.currentPage.x,0,c,this.options.scrollEasing),0===c&&a.trigger(this.wrapper,\"scrollend\",this)},setTranslate:function(a,b){this._super(a,b);var c=this.progressBar;c&&(this.progressBarStyle.webkitTransform=this._getTranslateStr(-a*(this.progressBarWidth/this.wrapperWidth),0))},resetPosition:function(a){return a=a||0,this.x>0?this.x=0:this.x<this.maxScrollX&&(this.x=this.maxScrollX),this.currentPage=this._nearestSnap(this.x),this.scrollTo(this.currentPage.x,0,a,this.options.scrollEasing),!0},gotoItem:function(a,b){this._gotoItem(a,\"undefined\"==typeof b?this.options.scrollTime:b)},nextItem:function(){this._gotoItem(this.slideNumber+1,this.options.scrollTime)},prevItem:function(){this._gotoItem(this.slideNumber-1,this.options.scrollTime)},getSlideNumber:function(){return this.slideNumber||0},_reInit:function(){for(var a=this.wrapper.querySelectorAll(\".\"+d),b=0,c=a.length;c>b;b++)if(a[b].parentNode===this.wrapper){this.scroller=a[b];break}this.scrollerStyle=this.scroller&&this.scroller.style,this.progressBar&&(this.progressBarWidth=this.progressBar.offsetWidth,this.progressBarStyle=this.progressBar.style)},refresh:function(b){b?(a.extend(this.options,b),this._super(),this._initTimer()):this._super()},destroy:function(){this._initEvent(!0),delete a.data[this.wrapper.getAttribute(\"data-slider\")],this.wrapper.setAttribute(\"data-slider\",\"\")}});a.fn.slider=function(b){var d=null;return this.each(function(){var e=this;if(this.classList.contains(c)||(e=this.querySelector(\".\"+c)),e&&e.querySelector(j)){var f=e.getAttribute(\"data-slider\");f?(d=a.data[f],d&&b&&d.refresh(b)):(f=++a.uuid,a.data[f]=d=new l(e,b),e.setAttribute(\"data-slider\",f))}}),d},a.ready(function(){a(\".mui-slider\").slider(),a(\".mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control\").scroll({scrollY:!1,scrollX:!0,indicators:!1,snap:\".mui-control-item\"})})}(mui,window),function(a,b){a.os.plus&&a.plusReady(function(){if(window.__NWin_Enable__!==!1){var c=\"mui-plus-pullrefresh\",d=\"mui-visibility\",e=\"mui-hidden\",f=\"mui-block\",g=\"mui-pull-caption\",h=\"mui-pull-caption-down\",i=\"mui-pull-caption-refresh\",j=\"mui-pull-caption-nomore\",k=a.Class.extend({init:function(a,b){this.element=a,this.options=b,this.wrapper=this.scroller=a,this._init(),this._initPulldownRefreshEvent()},_init:function(){var a=this;window.addEventListener(\"dragup\",a),b.addEventListener(\"plusscrollbottom\",a),a.scrollInterval=window.setInterval(function(){a.isScroll&&!a.loading&&window.pageYOffset+window.innerHeight+10>=b.documentElement.scrollHeight&&(a.isScroll=!1,a.bottomPocket&&a.pullupLoading())},100)},_initPulldownRefreshEvent:function(){var b=this;a.plusReady(function(){if(\"circle\"==b.options.down.style)b.options.webview=plus.webview.currentWebview(),b.options.webview.setPullToRefresh({support:!0,color:b.options.down.color||\"#2BD009\",height:b.options.down.height||\"50px\",range:b.options.down.range||\"100px\",style:\"circle\",offset:b.options.down.offset||\"0px\"},function(){b.options.down.callback()});else if(b.topPocket&&b.options.webviewId){var a=plus.webview.getWebviewById(b.options.webviewId);if(!a)return;b.options.webview=a;var c=b.options.down,d=c.height;a.addEventListener(\"close\",function(){var a=b.options.webviewId&&b.options.webviewId.replace(/\\//g,\"_\");b.element.removeAttribute(\"data-pullrefresh-plus-\"+a)}),a.addEventListener(\"dragBounce\",function(d){switch(b.pulldown?b.pullPocket.classList.add(f):b._initPulldownRefresh(),d.status){case\"beforeChangeOffset\":b._setCaption(c.contentdown);break;case\"afterChangeOffset\":b._setCaption(c.contentover);break;case\"dragEndAfterChangeOffset\":a.evalJS(\"window.mui&&mui.options.pullRefresh.down.callback()\"),b._setCaption(c.contentrefresh)}},!1),a.setBounce({position:{top:2*d+\"px\"},changeoffset:{top:d+\"px\"}})}})},handleEvent:function(a){var b=this;b.stopped||(b.isScroll=!1,(\"dragup\"===a.type||\"plusscrollbottom\"===a.type)&&(b.isScroll=!0,setTimeout(function(){b.isScroll=!1},1e3)))}}).extend(a.extend({setStopped:function(a){this.stopped=!!a;var b=plus.webview.currentWebview();if(this.stopped)b.setStyle({bounce:\"none\"}),b.setBounce({position:{top:\"none\"}});else{var c=this.options.down.height;b.setStyle({bounce:\"vertical\"}),b.setBounce({position:{top:2*c+\"px\"},changeoffset:{top:c+\"px\"}})}},beginPulldown:function(){var b=this;a.plusReady(function(){setTimeout(function(){\"circle\"==b.options.down.style?plus.webview.currentWebview().beginPullToRefresh():plus.webview.currentWebview().setBounce({offset:{top:b.options.down.height+\"px\"}})},15)}.bind(this))},pulldownLoading:function(){this.beginPulldown()},_pulldownLoading:function(){var b=this;a.plusReady(function(){var a=plus.webview.getWebviewById(b.options.webviewId);a&&a.setBounce({offset:{top:b.options.down.height+\"px\"}})})},endPulldown:function(){var a=plus.webview.currentWebview();a.parent()&&\"circle\"!==this.options.down.style?a.parent().evalJS(\"mui&&mui(document.querySelector('.mui-content')).pullRefresh('\"+JSON.stringify({webviewId:a.id})+\"')._endPulldownToRefresh()\"):a.endPullToRefresh()},endPulldownToRefresh:function(){this.endPulldown()},_endPulldownToRefresh:function(){var a=this;a.topPocket&&a.options.webview&&(a.options.webview.endPullToRefresh(),a.loading=!1,a._setCaption(a.options.down.contentdown,!0),setTimeout(function(){a.loading||a.topPocket.classList.remove(f)},350))},beginPullup:function(a){var b=this;b.isLoading||(b.isLoading=!0,b.pulldown!==!1?b._initPullupRefresh():this.pullPocket.classList.add(f),setTimeout(function(){b.pullLoading.classList.add(d),b.pullLoading.classList.remove(e),b.pullCaption.innerHTML=\"\",b.pullCaption.className=g+\" \"+i,b.pullCaption.innerHTML=b.options.up.contentrefresh,a=a||b.options.up.callback,a&&a.call(b)},300))},pullupLoading:function(a){this.beginPullup(a)},endPullup:function(a){var c=this;c.pullLoading&&(c.pullLoading.classList.remove(d),c.pullLoading.classList.add(e),c.isLoading=!1,a?(c.finished=!0,c.pullCaption.className=g+\" \"+j,c.pullCaption.innerHTML=c.options.up.contentnomore,b.removeEventListener(\"plusscrollbottom\",c),window.removeEventListener(\"dragup\",c)):(c.pullCaption.className=g+\" \"+h,c.pullCaption.innerHTML=c.options.up.contentdown))},endPullupToRefresh:function(a){this.endPullup(a)},disablePullupToRefresh:function(){this._initPullupRefresh(),this.bottomPocket.className=\"mui-pull-bottom-pocket \"+e,window.removeEventListener(\"dragup\",this)},enablePullupToRefresh:function(){this._initPullupRefresh(),this.bottomPocket.classList.remove(e),this.pullCaption.className=g+\" \"+h,this.pullCaption.innerHTML=this.options.up.contentdown,b.addEventListener(\"plusscrollbottom\",this),window.addEventListener(\"dragup\",this)},scrollTo:function(b,c,d){a.scrollTo(c,d)},scrollToBottom:function(c){a.scrollTo(b.documentElement.scrollHeight,c)},refresh:function(a){a&&this.finished&&(this.enablePullupToRefresh(),this.finished=!1)}},a.PullRefresh));a.fn.pullRefresh_native=function(d){var e;0===this.length?(e=b.createElement(\"div\"),e.className=\"mui-content\",b.body.appendChild(e)):e=this[0];var f=d;d=d||{},\"string\"==typeof d&&(d=a.parseJSON(d)),!d.webviewId&&(d.webviewId=plus.webview.currentWebview().id||plus.webview.currentWebview().getURL());var g=null,h=d.webviewId&&d.webviewId.replace(/\\//g,\"_\"),i=e.getAttribute(\"data-pullrefresh-plus-\"+h);return i||\"undefined\"!=typeof f?(i?g=a.data[i]:(i=++a.uuid,e.setAttribute(\"data-pullrefresh-plus-\"+h,i),b.body.classList.add(c),a.data[i]=g=new k(e,d)),d.down&&d.down.auto?g.beginPulldown():d.up&&d.up.auto&&g.beginPullup(),g):!1}}})}(mui,document),function(a,b,c,d){var e=\"mui-off-canvas-left\",f=\"mui-off-canvas-right\",g=\"mui-off-canvas-backdrop\",h=\"mui-off-canvas-wrap\",i=\"mui-slide-in\",j=\"mui-active\",k=\"mui-transitioning\",l=\".mui-inner-wrap\",m=a.Class.extend({init:function(b,d){this.wrapper=this.element=b,this.scroller=this.wrapper.querySelector(l),this.classList=this.wrapper.classList,this.scroller&&(this.options=a.extend(!0,{dragThresholdX:10,scale:.8,opacity:.1,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT|VIDEO)$/}},d),c.body.classList.add(\"mui-fullscreen\"),this.refresh(),this.initEvent())},_preventDefaultException:function(a,b){for(var c in b)if(b[c].test(a[c]))return!0;return!1},refresh:function(a){this.slideIn=this.classList.contains(i),this.scalable=this.classList.contains(\"mui-scalable\")&&!this.slideIn,this.scroller=this.wrapper.querySelector(l),this.offCanvasLefts=this.wrapper.querySelectorAll(\".\"+e),this.offCanvasRights=this.wrapper.querySelectorAll(\".\"+f),a?a.classList.contains(e)?this.offCanvasLeft=a:a.classList.contains(f)&&(this.offCanvasRight=a):(this.offCanvasRight=this.wrapper.querySelector(\".\"+f),this.offCanvasLeft=this.wrapper.querySelector(\".\"+e)),this.offCanvasRightWidth=this.offCanvasLeftWidth=0,this.offCanvasLeftSlideIn=this.offCanvasRightSlideIn=!1,this.offCanvasRight&&(this.offCanvasRightWidth=this.offCanvasRight.offsetWidth,this.offCanvasRightSlideIn=this.slideIn&&this.offCanvasRight.parentNode===this.wrapper),this.offCanvasLeft&&(this.offCanvasLeftWidth=this.offCanvasLeft.offsetWidth,this.offCanvasLeftSlideIn=this.slideIn&&this.offCanvasLeft.parentNode===this.wrapper),this.backdrop=this.scroller.querySelector(\".\"+g),this.options.dragThresholdX=this.options.dragThresholdX||10,this.visible=!1,this.startX=null,this.lastX=null,this.offsetX=null,this.lastTranslateX=null},handleEvent:function(b){switch(b.type){case a.EVENT_START:b.target&&!this._preventDefaultException(b.target,this.options.preventDefaultException)&&b.preventDefault();break;case\"webkitTransitionEnd\":b.target===this.scroller&&this._dispatchEvent();break;case\"drag\":var c=b.detail;this.startX?this.lastX=c.center.x:(this.startX=c.center.x,this.lastX=this.startX),!this.isDragging&&Math.abs(this.lastX-this.startX)>this.options.dragThresholdX&&(\"left\"===c.direction||\"right\"===c.direction)&&(this.slideIn?(this.scroller=this.wrapper.querySelector(l),this.classList.contains(j)?this.offCanvasRight&&this.offCanvasRight.classList.contains(j)?(this.offCanvas=this.offCanvasRight,this.offCanvasWidth=this.offCanvasRightWidth):(this.offCanvas=this.offCanvasLeft,this.offCanvasWidth=this.offCanvasLeftWidth):\"left\"===c.direction&&this.offCanvasRight?(this.offCanvas=this.offCanvasRight,this.offCanvasWidth=this.offCanvasRightWidth):\"right\"===c.direction&&this.offCanvasLeft?(this.offCanvas=this.offCanvasLeft,this.offCanvasWidth=this.offCanvasLeftWidth):this.scroller=null):this.classList.contains(j)?\"left\"===c.direction?(this.offCanvas=this.offCanvasLeft,this.offCanvasWidth=this.offCanvasLeftWidth):(this.offCanvas=this.offCanvasRight,this.offCanvasWidth=this.offCanvasRightWidth):\"right\"===c.direction?(this.offCanvas=this.offCanvasLeft,this.offCanvasWidth=this.offCanvasLeftWidth):(this.offCanvas=this.offCanvasRight,this.offCanvasWidth=this.offCanvasRightWidth),this.offCanvas&&this.scroller&&(this.startX=this.lastX,this.isDragging=!0,a.gestures.session.lockDirection=!0,a.gestures.session.startDirection=c.direction,this.offCanvas.classList.remove(k),this.scroller.classList.remove(k),this.offsetX=this.getTranslateX(),this._initOffCanvasVisible())),this.isDragging&&(this.updateTranslate(this.offsetX+(this.lastX-this.startX)),c.gesture.preventDefault(),b.stopPropagation());break;case\"dragend\":if(this.isDragging){var c=b.detail,d=c.direction;this.isDragging=!1,this.offCanvas.classList.add(k),this.scroller.classList.add(k);var e=0,f=this.getTranslateX();if(this.slideIn){if(e=f>=0?this.offCanvasRightWidth&&f/this.offCanvasRightWidth||0:this.offCanvasLeftWidth&&f/this.offCanvasLeftWidth||0,\"right\"===d&&0>=e&&(e>=-.5||c.swipe)?this.openPercentage(100):\"right\"===d&&e>0&&(e>=.5||c.swipe)?this.openPercentage(0):\"right\"===d&&-.5>=e?this.openPercentage(0):\"right\"===d&&e>0&&.5>=e?this.openPercentage(-100):\"left\"===d&&e>=0&&(.5>=e||c.swipe)?this.openPercentage(-100):\"left\"===d&&0>e&&(-.5>=e||c.swipe)?this.openPercentage(0):\"left\"===d&&e>=.5?this.openPercentage(0):\"left\"===d&&e>=-.5&&0>e?this.openPercentage(100):this.openPercentage(0),1===e||-1===e||0===e)return void this._dispatchEvent()}else{if(e=f>=0?this.offCanvasLeftWidth&&f/this.offCanvasLeftWidth||0:this.offCanvasRightWidth&&f/this.offCanvasRightWidth||0,0===e)return this.openPercentage(0),void this._dispatchEvent();\"right\"===d&&e>=0&&(e>=.5||c.swipe)?this.openPercentage(100):\"right\"===d&&0>e&&(e>-.5||c.swipe)?this.openPercentage(0):\"right\"===d&&e>0&&.5>e?this.openPercentage(0):\"right\"===d&&.5>e?this.openPercentage(-100):\"left\"===d&&0>=e&&(-.5>=e||c.swipe)?this.openPercentage(-100):\"left\"===d&&e>0&&(.5>=e||c.swipe)?this.openPercentage(0):\"left\"===d&&0>e&&e>=-.5?this.openPercentage(0):\"left\"===d&&e>.5?this.openPercentage(100):this.openPercentage(0),(1===e||-1===e)&&this._dispatchEvent()}}}},_dispatchEvent:function(){this.classList.contains(j)?a.trigger(this.wrapper,\"shown\",this):a.trigger(this.wrapper,\"hidden\",this)},_initOffCanvasVisible:function(){this.visible||(this.visible=!0,this.offCanvasLeft&&(this.offCanvasLeft.style.visibility=\"visible\"),this.offCanvasRight&&(this.offCanvasRight.style.visibility=\"visible\"))},initEvent:function(){var b=this;b.backdrop&&b.backdrop.addEventListener(\"tap\",function(a){b.close(),a.detail.gesture.preventDefault()}),this.classList.contains(\"mui-draggable\")&&(this.wrapper.addEventListener(a.EVENT_START,this),this.wrapper.addEventListener(\"drag\",this),this.wrapper.addEventListener(\"dragend\",this)),this.wrapper.addEventListener(\"webkitTransitionEnd\",this)},openPercentage:function(a){var b=a/100;this.slideIn?(this.offCanvasLeft&&a>=0?(b=0===b?-1:0,this.updateTranslate(this.offCanvasLeftWidth*b),this.offCanvasLeft.classList[0!==a?\"add\":\"remove\"](j)):this.offCanvasRight&&0>=a&&(b=0===b?1:0,this.updateTranslate(this.offCanvasRightWidth*b),this.offCanvasRight.classList[0!==a?\"add\":\"remove\"](j)),this.classList[0!==a?\"add\":\"remove\"](j)):(this.offCanvasLeft&&a>=0?(this.updateTranslate(this.offCanvasLeftWidth*b),this.offCanvasLeft.classList[0!==b?\"add\":\"remove\"](j)):this.offCanvasRight&&0>=a&&(this.updateTranslate(this.offCanvasRightWidth*b),this.offCanvasRight.classList[0!==b?\"add\":\"remove\"](j)),this.classList[0!==b?\"add\":\"remove\"](j))},updateTranslate:function(b){if(b!==this.lastTranslateX){if(this.slideIn){if(this.offCanvas.classList.contains(f)){if(0>b)return void this.setTranslateX(0);if(b>this.offCanvasRightWidth)return void this.setTranslateX(this.offCanvasRightWidth)}else{if(b>0)return void this.setTranslateX(0);if(b<-this.offCanvasLeftWidth)return void this.setTranslateX(-this.offCanvasLeftWidth)}this.setTranslateX(b)}else{if(!this.offCanvasLeft&&b>0||!this.offCanvasRight&&0>b)return void this.setTranslateX(0);if(this.leftShowing&&b>this.offCanvasLeftWidth)return void this.setTranslateX(this.offCanvasLeftWidth);if(this.rightShowing&&b<-this.offCanvasRightWidth)return void this.setTranslateX(-this.offCanvasRightWidth);this.setTranslateX(b),b>=0?(this.leftShowing=!0,this.rightShowing=!1,b>0&&(this.offCanvasLeft&&a.each(this.offCanvasLefts,function(a,b){b===this.offCanvasLeft?this.offCanvasLeft.style.zIndex=0:b.style.zIndex=-1}.bind(this)),this.offCanvasRight&&(this.offCanvasRight.style.zIndex=-1))):(this.rightShowing=!0,this.leftShowing=!1,this.offCanvasRight&&a.each(this.offCanvasRights,function(a,b){b===this.offCanvasRight?b.style.zIndex=0:b.style.zIndex=-1}.bind(this)),this.offCanvasLeft&&(this.offCanvasLeft.style.zIndex=-1))}this.lastTranslateX=b}},setTranslateX:a.animationFrame(function(a){if(this.scroller)if(this.scalable&&this.offCanvas.parentNode===this.wrapper){var b=Math.abs(a)/this.offCanvasWidth,c=1-(1-this.options.scale)*b,d=this.options.scale+(1-this.options.scale)*b,f=(1-(1-this.options.opacity)*b,this.options.opacity+(1-this.options.opacity)*b);this.offCanvas.classList.contains(e)?(this.offCanvas.style.webkitTransformOrigin=\"-100%\",this.scroller.style.webkitTransformOrigin=\"left\"):(this.offCanvas.style.webkitTransformOrigin=\"200%\",this.scroller.style.webkitTransformOrigin=\"right\"),this.offCanvas.style.opacity=f,this.offCanvas.style.webkitTransform=\"translate3d(0,0,0) scale(\"+d+\")\",this.scroller.style.webkitTransform=\"translate3d(\"+a+\"px,0,0) scale(\"+c+\")\"}else this.slideIn?this.offCanvas.style.webkitTransform=\"translate3d(\"+a+\"px,0,0)\":this.scroller.style.webkitTransform=\"translate3d(\"+a+\"px,0,0)\"}),getTranslateX:function(){if(this.offCanvas){var b=this.slideIn?this.offCanvas:this.scroller,c=a.parseTranslateMatrix(a.getStyles(b,\"webkitTransform\"));return c&&c.x||0}return 0},isShown:function(a){var b=!1;if(this.slideIn)b=\"left\"===a?this.classList.contains(j)&&this.wrapper.querySelector(\".\"+e+\".\"+j):\"right\"===a?this.classList.contains(j)&&this.wrapper.querySelector(\".\"+f+\".\"+j):this.classList.contains(j)&&(this.wrapper.querySelector(\".\"+e+\".\"+j)||this.wrapper.querySelector(\".\"+f+\".\"+j));else{var c=this.getTranslateX();b=\"right\"===a?this.classList.contains(j)&&0>c:\"left\"===a?this.classList.contains(j)&&c>0:this.classList.contains(j)&&0!==c}return b},close:function(){this._initOffCanvasVisible(),this.offCanvas=this.wrapper.querySelector(\".\"+f+\".\"+j)||this.wrapper.querySelector(\".\"+e+\".\"+j),this.offCanvasWidth=this.offCanvas.offsetWidth,this.scroller&&(this.offCanvas.offsetHeight,this.offCanvas.classList.add(k),this.scroller.classList.add(k),this.openPercentage(0))},show:function(a){return this._initOffCanvasVisible(),this.isShown(a)?!1:(a||(a=this.wrapper.querySelector(\".\"+f)?\"right\":\"left\"),\"right\"===a?(this.offCanvas=this.offCanvasRight,this.offCanvasWidth=this.offCanvasRightWidth):(this.offCanvas=this.offCanvasLeft,this.offCanvasWidth=this.offCanvasLeftWidth),this.scroller&&(this.offCanvas.offsetHeight,this.offCanvas.classList.add(k),this.scroller.classList.add(k),this.openPercentage(\"left\"===a?100:-100)),!0)},toggle:function(a){var b=a;a&&a.classList&&(b=a.classList.contains(e)?\"left\":\"right\",this.refresh(a)),this.show(b)||this.close()}}),n=function(a){if(parentNode=a.parentNode,parentNode){if(parentNode.classList.contains(h))return parentNode;if(parentNode=parentNode.parentNode,parentNode.classList.contains(h))return parentNode}},o=function(b,d){if(\"A\"===d.tagName&&d.hash){var e=c.getElementById(d.hash.replace(\"#\",\"\"));if(e){var f=n(e);if(f)return a.targets._container=f,e}}return!1};a.registerTarget({name:d,index:60,handle:o,target:!1,isReset:!1,isContinue:!0}),b.addEventListener(\"tap\",function(b){if(a.targets.offcanvas)for(var d=b.target;d&&d!==c;d=d.parentNode)if(\"A\"===d.tagName&&d.hash&&d.hash===\"#\"+a.targets.offcanvas.id){b.detail&&b.detail.gesture&&b.detail.gesture.preventDefault(),a(a.targets._container).offCanvas().toggle(a.targets.offcanvas),a.targets.offcanvas=a.targets._container=null;break}}),a.fn.offCanvas=function(b){var c=[];return this.each(function(){var d=null,e=this;e.classList.contains(h)||(e=n(e));var f=e.getAttribute(\"data-offCanvas\");f?d=a.data[f]:(f=++a.uuid,a.data[f]=d=new m(e,b),e.setAttribute(\"data-offCanvas\",f)),(\"show\"===b||\"close\"===b||\"toggle\"===b)&&d.toggle(),c.push(d)}),1===c.length?c[0]:c},a.ready(function(){a(\".mui-off-canvas-wrap\").offCanvas()})}(mui,window,document,\"offcanvas\"),function(a,b){var c=\"mui-action\",d=function(a,b){var d=b.className||\"\";return\"string\"!=typeof d&&(d=\"\"),d&&~d.indexOf(c)?(b.classList.contains(\"mui-action-back\")&&a.preventDefault(),b):!1};a.registerTarget({name:b,index:50,handle:d,target:!1,isContinue:!0})}(mui,\"action\"),function(a,b,c,d){var e=\"mui-modal\",f=function(a,b){if(\"A\"===b.tagName&&b.hash){var d=c.getElementById(b.hash.replace(\"#\",\"\"));if(d&&d.classList.contains(e))return d}return!1};a.registerTarget({name:d,index:50,handle:f,target:!1,isReset:!1,isContinue:!0}),b.addEventListener(\"tap\",function(b){a.targets.modal&&(b.detail.gesture.preventDefault(),a.targets.modal.classList.toggle(\"mui-active\"))})}(mui,window,document,\"modal\"),function(a,b,c,d){var e=\"mui-popover\",f=\"mui-popover-arrow\",g=\"mui-popover-action\",h=\"mui-backdrop\",i=\"mui-bar-popover\",j=\"mui-bar-backdrop\",k=\"mui-backdrop-action\",l=\"mui-active\",m=\"mui-bottom\",n=function(b,d){if(\"A\"===d.tagName&&d.hash){if(a.targets._popover=c.getElementById(d.hash.replace(\"#\",\"\")),a.targets._popover&&a.targets._popover.classList.contains(e))return d;a.targets._popover=null}return!1};a.registerTarget({name:d,index:60,handle:n,target:!1,isReset:!1,isContinue:!0});var o,p=function(b){this.removeEventListener(\"webkitTransitionEnd\",p),this.addEventListener(a.EVENT_MOVE,a.preventDefault),a.trigger(this,\"shown\",this)},q=function(b){u(this,\"none\"),this.removeEventListener(\"webkitTransitionEnd\",q),this.removeEventListener(a.EVENT_MOVE,a.preventDefault),a.trigger(this,\"hidden\",this)},r=function(){var b=c.createElement(\"div\");return b.classList.add(h),b.addEventListener(a.EVENT_MOVE,a.preventDefault),b.addEventListener(\"tap\",function(b){var c=a.targets._popover;c&&(c.addEventListener(\"webkitTransitionEnd\",q),c.classList.remove(l),s(c))}),b}(),s=function(b){r.setAttribute(\"style\",\"opacity:0\"),a.targets.popover=a.targets._popover=null,o=a.later(function(){!b.classList.contains(l)&&r.parentNode&&r.parentNode===c.body&&c.body.removeChild(r)},350)};b.addEventListener(\"tap\",function(b){if(a.targets.popover){for(var d=!1,e=b.target;e&&e!==c;e=e.parentNode)e===a.targets.popover&&(d=!0);d&&(b.detail.gesture.preventDefault(),t(a.targets._popover,a.targets.popover))}});var t=function(a,b,d){if(!(\"show\"===d&&a.classList.contains(l)||\"hide\"===d&&!a.classList.contains(l))){o&&o.cancel(),a.removeEventListener(\"webkitTransitionEnd\",p),a.removeEventListener(\"webkitTransitionEnd\",q),r.classList.remove(j),r.classList.remove(k);var e=c.querySelector(\".mui-popover.mui-active\");if(e&&(e.addEventListener(\"webkitTransitionEnd\",q),e.classList.remove(l),a===e))return void s(e);var f=!1;(a.classList.contains(i)||a.classList.contains(g))&&(a.classList.contains(g)?(f=!0,r.classList.add(k)):r.classList.add(j)),u(a,\"block\"),a.offsetHeight,a.classList.add(l),r.setAttribute(\"style\",\"\"),c.body.appendChild(r),v(a,b,f),r.classList.add(l),a.addEventListener(\"webkitTransitionEnd\",p)}},u=function(a,b,c,d){var e=a.style;\"undefined\"!=typeof b&&(e.display=b),\"undefined\"!=typeof c&&(e.top=c+\"px\"),\"undefined\"!=typeof d&&(e.left=d+\"px\")},v=function(d,e,h){if(d&&e){if(h)return void u(d,\"block\");var i=b.innerWidth,j=b.innerHeight,k=d.offsetWidth,l=d.offsetHeight,n=e.offsetWidth,o=e.offsetHeight,p=a.offset(e),q=d.querySelector(\".\"+f);q||(q=c.createElement(\"div\"),q.className=f,d.appendChild(q));var r=q&&q.offsetWidth/2||0,s=0,t=0,v=0,w=0,x=d.classList.contains(g)?0:5,y=\"top\";l+r<p.top-b.pageYOffset?s=p.top-l-r:l+r<j-(p.top-b.pageYOffset)-o?(y=\"bottom\",s=p.top+o+r):(y=\"middle\",s=Math.max((j-l)/2+b.pageYOffset,0),t=Math.max((i-k)/2+b.pageXOffset,0)),\"top\"===y||\"bottom\"===y?(t=n/2+p.left-k/2,v=t,x>t&&(t=x),t+k>i&&(t=i-k-x),q&&(\"top\"===y?q.classList.add(m):q.classList.remove(m),v-=t,w=k/2-r/2+v,w=Math.max(Math.min(w,k-2*r-6),6),q.setAttribute(\"style\",\"left:\"+w+\"px\"))):\"middle\"===y&&q.setAttribute(\"style\",\"display:none\"),u(d,\"block\",s,t)}};a.createMask=function(b){var d=c.createElement(\"div\");d.classList.add(h),d.addEventListener(a.EVENT_MOVE,a.preventDefault),d.addEventListener(\"tap\",function(){e.close()});var e=[d];return e._show=!1,e.show=function(){return e._show=!0,d.setAttribute(\"style\",\"opacity:1\"),c.body.appendChild(d),e},e._remove=function(){return e._show&&(e._show=!1,d.setAttribute(\"style\",\"opacity:0\"),a.later(function(){var a=c.body;d.parentNode===a&&a.removeChild(d)},350)),e},e.close=function(){b?b()!==!1&&e._remove():e._remove()},e},a.fn.popover=function(){var b=arguments;this.each(function(){a.targets._popover=this,(\"show\"===b[0]||\"hide\"===b[0]||\"toggle\"===b[0])&&t(this,b[1],b[0])})}}(mui,window,document,\"popover\"),function(a,b,c,d,e){var f=\"mui-control-item\",g=\"mui-segmented-control\",h=\"mui-segmented-control-vertical\",i=\"mui-control-content\",j=\"mui-bar-tab\",k=\"mui-tab-item\",l=function(a,b){return b.classList&&(b.classList.contains(f)||b.classList.contains(k))?(b.parentNode&&b.parentNode.classList&&b.parentNode.classList.contains(h)||a.preventDefault(),b):!1};a.registerTarget({name:d,index:80,handle:l,target:!1}),b.addEventListener(\"tap\",function(b){var e=a.targets.tab;if(e){for(var h,l,m,n=\"mui-active\",o=\".\"+n,p=e.parentNode;p&&p!==c;p=p.parentNode){if(p.classList.contains(g)){h=p.querySelector(o+\".\"+f);break}p.classList.contains(j)&&(h=p.querySelector(o+\".\"+k))}h&&h.classList.remove(n);var q=e===h;if(e&&e.classList.add(n),e.hash&&(m=c.getElementById(e.hash.replace(\"#\",\"\")))){if(!m.classList.contains(i))return void e.classList[q?\"remove\":\"add\"](n);if(!q){var r=m.parentNode;l=r.querySelectorAll(\".\"+i+o);for(var s=0;s<l.length;s++){var t=l[s];t.parentNode===r&&t.classList.remove(n)}m.classList.add(n);for(var u=[],v=r.querySelectorAll(\".\"+i),s=0;s<v.length;s++)v[s].parentNode===r&&u.push(v[s]);a.trigger(m,a.eventName(\"shown\",d),{tabNumber:Array.prototype.indexOf.call(u,m)}),b.detail&&b.detail.gesture.preventDefault()}}}})}(mui,window,document,\"tab\"),function(a,b,c){var d=\"mui-switch\",e=\"mui-switch-handle\",f=\"mui-active\",g=\"mui-dragging\",h=\"mui-disabled\",i=\".\"+e,j=function(a,b){return b.classList&&b.classList.contains(d)?b:!1};a.registerTarget({name:c,index:100,handle:j,target:!1});var k=function(a){this.element=a,this.classList=this.element.classList,this.handle=this.element.querySelector(i),this.init(),this.initEvent()};k.prototype.init=function(){this.toggleWidth=this.element.offsetWidth,this.handleWidth=this.handle.offsetWidth,this.handleX=this.toggleWidth-this.handleWidth-3},k.prototype.initEvent=function(){this.element.addEventListener(a.EVENT_START,this),this.element.addEventListener(\"drag\",this),this.element.addEventListener(\"swiperight\",this),this.element.addEventListener(a.EVENT_END,this),this.element.addEventListener(a.EVENT_CANCEL,this)},k.prototype.handleEvent=function(b){if(!this.classList.contains(h))switch(b.type){case a.EVENT_START:this.start(b);break;case\"drag\":this.drag(b);break;case\"swiperight\":this.swiperight();break;case a.EVENT_END:case a.EVENT_CANCEL:this.end(b)}},k.prototype.start=function(a){this.handle.style.webkitTransitionDuration=this.element.style.webkitTransitionDuration=\".2s\",this.classList.add(g),(0===this.toggleWidth||0===this.handleWidth)&&this.init()},k.prototype.drag=function(a){var b=a.detail;this.isDragging||(\"left\"===b.direction||\"right\"===b.direction)&&(this.isDragging=!0,this.lastChanged=void 0,this.initialState=this.classList.contains(f)),this.isDragging&&(this.setTranslateX(b.deltaX),a.stopPropagation(),b.gesture.preventDefault())},k.prototype.swiperight=function(a){this.isDragging&&a.stopPropagation()},k.prototype.end=function(b){this.classList.remove(g),this.isDragging?(this.isDragging=!1,b.stopPropagation(),a.trigger(this.element,\"toggle\",{isActive:this.classList.contains(f)})):this.toggle()},k.prototype.toggle=function(b){\nvar c=this.classList;b===!1?this.handle.style.webkitTransitionDuration=this.element.style.webkitTransitionDuration=\"0s\":this.handle.style.webkitTransitionDuration=this.element.style.webkitTransitionDuration=\".2s\",c.contains(f)?(c.remove(f),this.handle.style.webkitTransform=\"translate(0,0)\"):(c.add(f),this.handle.style.webkitTransform=\"translate(\"+this.handleX+\"px,0)\"),a.trigger(this.element,\"toggle\",{isActive:this.classList.contains(f)})},k.prototype.setTranslateX=a.animationFrame(function(a){if(this.isDragging){var b=!1;(this.initialState&&-a>this.handleX/2||!this.initialState&&a>this.handleX/2)&&(b=!0),this.lastChanged!==b&&(b?(this.handle.style.webkitTransform=\"translate(\"+(this.initialState?0:this.handleX)+\"px,0)\",this.classList[this.initialState?\"remove\":\"add\"](f)):(this.handle.style.webkitTransform=\"translate(\"+(this.initialState?this.handleX:0)+\"px,0)\",this.classList[this.initialState?\"add\":\"remove\"](f)),this.lastChanged=b)}}),a.fn[\"switch\"]=function(b){var c=[];return this.each(function(){var b=null,d=this.getAttribute(\"data-switch\");d?b=a.data[d]:(d=++a.uuid,a.data[d]=new k(this),this.setAttribute(\"data-switch\",d)),c.push(b)}),c.length>1?c:c[0]},a.ready(function(){a(\".\"+d)[\"switch\"]()})}(mui,window,\"toggle\"),function(a,b,c){function d(a,b){var c=b?\"removeEventListener\":\"addEventListener\";a[c](\"drag\",F),a[c](\"dragend\",F),a[c](\"swiperight\",F),a[c](\"swipeleft\",F),a[c](\"flick\",F)}var e,f,g=\"mui-active\",h=\"mui-selected\",i=\"mui-grid-view\",j=\"mui-table-view-radio\",k=\"mui-table-view-cell\",l=\"mui-collapse-content\",m=\"mui-disabled\",n=\"mui-switch\",o=\"mui-btn\",p=\"mui-slider-handle\",q=\"mui-slider-left\",r=\"mui-slider-right\",s=\"mui-transitioning\",t=\".\"+p,u=\".\"+q,v=\".\"+r,w=\".\"+h,x=\".\"+o,y=.8,z=isOpened=openedActions=progress=!1,A=sliderActionLeft=sliderActionRight=buttonsLeft=buttonsRight=sliderDirection=sliderRequestAnimationFrame=!1,B=translateX=lastTranslateX=sliderActionLeftWidth=sliderActionRightWidth=0,C=function(a){a?f?f.classList.add(g):e&&e.classList.add(g):(B&&B.cancel(),f?f.classList.remove(g):e&&e.classList.remove(g))},D=function(){if(translateX!==lastTranslateX){if(buttonsRight&&buttonsRight.length>0){progress=translateX/sliderActionRightWidth,translateX<-sliderActionRightWidth&&(translateX=-sliderActionRightWidth-Math.pow(-translateX-sliderActionRightWidth,y));for(var a=0,b=buttonsRight.length;b>a;a++){var c=buttonsRight[a];\"undefined\"==typeof c._buttonOffset&&(c._buttonOffset=c.offsetLeft),buttonOffset=c._buttonOffset,E(c,translateX-buttonOffset*(1+Math.max(progress,-1)))}}if(buttonsLeft&&buttonsLeft.length>0){progress=translateX/sliderActionLeftWidth,translateX>sliderActionLeftWidth&&(translateX=sliderActionLeftWidth+Math.pow(translateX-sliderActionLeftWidth,y));for(var a=0,b=buttonsLeft.length;b>a;a++){var d=buttonsLeft[a];\"undefined\"==typeof d._buttonOffset&&(d._buttonOffset=sliderActionLeftWidth-d.offsetLeft-d.offsetWidth),buttonOffset=d._buttonOffset,buttonsLeft.length>1&&(d.style.zIndex=buttonsLeft.length-a),E(d,translateX+buttonOffset*(1-Math.min(progress,1)))}}E(A,translateX),lastTranslateX=translateX}sliderRequestAnimationFrame=requestAnimationFrame(function(){D()})},E=function(a,b){a&&(a.style.webkitTransform=\"translate(\"+b+\"px,0)\")};b.addEventListener(a.EVENT_START,function(b){e&&C(!1),e=f=!1,z=isOpened=openedActions=!1;for(var g=b.target,h=!1;g&&g!==c;g=g.parentNode)if(g.classList){var p=g.classList;if((\"INPUT\"===g.tagName&&\"radio\"!==g.type&&\"checkbox\"!==g.type||\"BUTTON\"===g.tagName||p.contains(n)||p.contains(o)||p.contains(m))&&(h=!0),p.contains(l))break;if(p.contains(k)){e=g;var q=e.parentNode.querySelector(w);if(!e.parentNode.classList.contains(j)&&q&&q!==e)return a.swipeoutClose(q),void(e=h=!1);if(!e.parentNode.classList.contains(i)){var r=e.querySelector(\"a\");r&&r.parentNode===e&&(f=r)}var s=e.querySelector(t);s&&(d(e),b.stopPropagation()),h||(s?(B&&B.cancel(),B=a.later(function(){C(!0)},100)):C(!0));break}}}),b.addEventListener(a.EVENT_MOVE,function(a){C(!1)});var F={handleEvent:function(a){switch(a.type){case\"drag\":this.drag(a);break;case\"dragend\":this.dragend(a);break;case\"flick\":this.flick(a);break;case\"swiperight\":this.swiperight(a);break;case\"swipeleft\":this.swipeleft(a)}},drag:function(a){if(e){z||(A=sliderActionLeft=sliderActionRight=buttonsLeft=buttonsRight=sliderDirection=sliderRequestAnimationFrame=!1,A=e.querySelector(t),A&&(sliderActionLeft=e.querySelector(u),sliderActionRight=e.querySelector(v),sliderActionLeft&&(sliderActionLeftWidth=sliderActionLeft.offsetWidth,buttonsLeft=sliderActionLeft.querySelectorAll(x)),sliderActionRight&&(sliderActionRightWidth=sliderActionRight.offsetWidth,buttonsRight=sliderActionRight.querySelectorAll(x)),e.classList.remove(s),isOpened=e.classList.contains(h),isOpened&&(openedActions=e.querySelector(u+w)?\"left\":\"right\")));var b=a.detail,c=b.direction,d=b.angle;if(\"left\"===c&&(d>150||-150>d)?(buttonsRight||buttonsLeft&&isOpened)&&(z=!0):\"right\"===c&&d>-30&&30>d&&(buttonsLeft||buttonsRight&&isOpened)&&(z=!0),z){a.stopPropagation(),a.detail.gesture.preventDefault();var f=a.detail.deltaX;if(isOpened&&(\"right\"===openedActions?f-=sliderActionRightWidth:f+=sliderActionLeftWidth),f>0&&!buttonsLeft||0>f&&!buttonsRight){if(!isOpened)return;f=0}0>f?sliderDirection=\"toLeft\":f>0?sliderDirection=\"toRight\":sliderDirection||(sliderDirection=\"toLeft\"),sliderRequestAnimationFrame||D(),translateX=f}}},flick:function(a){z&&a.stopPropagation()},swipeleft:function(a){z&&a.stopPropagation()},swiperight:function(a){z&&a.stopPropagation()},dragend:function(b){if(z){b.stopPropagation(),sliderRequestAnimationFrame&&(cancelAnimationFrame(sliderRequestAnimationFrame),sliderRequestAnimationFrame=null);var c=b.detail;z=!1;var d=\"close\",f=\"toLeft\"===sliderDirection?sliderActionRightWidth:sliderActionLeftWidth,g=c.swipe||Math.abs(translateX)>f/2;g&&(isOpened?\"left\"===c.direction&&\"right\"===openedActions?d=\"open\":\"right\"===c.direction&&\"left\"===openedActions&&(d=\"open\"):d=\"open\"),e.classList.add(s);var i;if(\"open\"===d){var j=\"toLeft\"===sliderDirection?-f:f;if(E(A,j),i=\"toLeft\"===sliderDirection?buttonsRight:buttonsLeft,\"undefined\"!=typeof i){for(var k=null,l=0;l<i.length;l++)k=i[l],E(k,j);k.parentNode.classList.add(h),e.classList.add(h),isOpened||a.trigger(e,\"toLeft\"===sliderDirection?\"slideleft\":\"slideright\")}}else E(A,0),sliderActionLeft&&sliderActionLeft.classList.remove(h),sliderActionRight&&sliderActionRight.classList.remove(h),e.classList.remove(h);var m;if(buttonsLeft&&buttonsLeft.length>0&&buttonsLeft!==i)for(var l=0,n=buttonsLeft.length;n>l;l++){var o=buttonsLeft[l];m=o._buttonOffset,\"undefined\"==typeof m&&(o._buttonOffset=sliderActionLeftWidth-o.offsetLeft-o.offsetWidth),E(o,m)}if(buttonsRight&&buttonsRight.length>0&&buttonsRight!==i)for(var l=0,n=buttonsRight.length;n>l;l++){var p=buttonsRight[l];m=p._buttonOffset,\"undefined\"==typeof m&&(p._buttonOffset=p.offsetLeft),E(p,-m)}}}};a.swipeoutOpen=function(b,c){if(b){var d=b.classList;if(!d.contains(h)){c||(c=b.querySelector(v)?\"right\":\"left\");var e=b.querySelector(a.classSelector(\".slider-\"+c));if(e){e.classList.add(h),d.add(h),d.remove(s);for(var f,g=e.querySelectorAll(x),i=e.offsetWidth,j=\"right\"===c?-i:i,k=g.length,l=0;k>l;l++)f=g[l],\"right\"===c?E(f,-f.offsetLeft):E(f,i-f.offsetWidth-f.offsetLeft);d.add(s);for(var l=0;k>l;l++)E(g[l],j);E(b.querySelector(t),j)}}}},a.swipeoutClose=function(b){if(b){var c=b.classList;if(c.contains(h)){var d=b.querySelector(v+w)?\"right\":\"left\",e=b.querySelector(a.classSelector(\".slider-\"+d));if(e){e.classList.remove(h),c.remove(h),c.add(s);var f,g=e.querySelectorAll(x),i=e.offsetWidth,j=g.length;E(b.querySelector(t),0);for(var k=0;j>k;k++)f=g[k],\"right\"===d?E(f,-f.offsetLeft):E(f,i-f.offsetWidth-f.offsetLeft)}}}},b.addEventListener(a.EVENT_END,function(a){e&&(C(!1),A&&d(e,!0))}),b.addEventListener(a.EVENT_CANCEL,function(a){e&&(C(!1),A&&d(e,!0))});var G=function(b){var c=b.target&&b.target.type||\"\";if(\"radio\"!==c&&\"checkbox\"!==c){var d=e.classList;if(d.contains(\"mui-radio\")){var f=e.querySelector(\"input[type=radio]\");f&&(f.disabled||f.readOnly||(f.checked=!f.checked,a.trigger(f,\"change\")))}else if(d.contains(\"mui-checkbox\")){var f=e.querySelector(\"input[type=checkbox]\");f&&(f.disabled||f.readOnly||(f.checked=!f.checked,a.trigger(f,\"change\")))}}};b.addEventListener(a.EVENT_CLICK,function(a){e&&e.classList.contains(\"mui-collapse\")&&a.preventDefault()}),b.addEventListener(\"doubletap\",function(a){e&&G(a)});var H=/^(INPUT|TEXTAREA|BUTTON|SELECT)$/;b.addEventListener(\"tap\",function(b){if(e){var c=!1,d=e.classList,f=e.parentNode;if(f&&f.classList.contains(j)){if(d.contains(h))return;var i=f.querySelector(\"li\"+w);return i&&i.classList.remove(h),d.add(h),void a.trigger(e,\"selected\",{el:e})}if(d.contains(\"mui-collapse\")&&!e.parentNode.classList.contains(\"mui-unfold\")){if(H.test(b.target.tagName)||b.detail.gesture.preventDefault(),!d.contains(g)){var k=e.parentNode.querySelector(\".mui-collapse.mui-active\");k&&k.classList.remove(g),c=!0}d.toggle(g),c&&a.trigger(e,\"expand\")}else G(b)}})}(mui,window,document),function(a,b){a.alert=function(c,d,e,f){if(a.os.plus){if(\"undefined\"==typeof c)return;\"function\"==typeof d?(f=d,d=null,e=\"确定\"):\"function\"==typeof e&&(f=e,e=null),a.plusReady(function(){plus.nativeUI.alert(c,f,d,e)})}else b.alert(c)}}(mui,window),function(a,b){a.confirm=function(c,d,e,f){if(a.os.plus){if(\"undefined\"==typeof c)return;\"function\"==typeof d?(f=d,d=null,e=null):\"function\"==typeof e&&(f=e,e=null),a.plusReady(function(){plus.nativeUI.confirm(c,f,d,e)})}else f(b.confirm(c)?{index:0}:{index:1})}}(mui,window),function(a,b){a.prompt=function(c,d,e,f,g){if(a.os.plus){if(\"undefined\"==typeof message)return;\"function\"==typeof d?(g=d,d=null,e=null,f=null):\"function\"==typeof e?(g=e,e=null,f=null):\"function\"==typeof f&&(g=f,f=null),a.plusReady(function(){plus.nativeUI.prompt(c,g,e,d,f)})}else{var h=b.prompt(c);g(h?{index:0,value:h}:{index:1,value:\"\"})}}}(mui,window),function(a,b){var c=\"mui-active\";a.toast=function(b,d){var e={\"long\":3500,\"short\":2e3};if(d=a.extend({duration:\"short\"},d||{}),!a.os.plus||\"div\"===d.type){\"number\"==typeof d.duration?duration=d.duration>0?d.duration:e[\"short\"]:duration=e[d.duration],duration||(duration=e[\"short\"]);var f=document.createElement(\"div\");return f.classList.add(\"mui-toast-container\"),f.innerHTML='<div class=\"mui-toast-message\">'+b+\"</div>\",f.addEventListener(\"webkitTransitionEnd\",function(){f.classList.contains(c)||(f.parentNode.removeChild(f),f=null)}),f.addEventListener(\"click\",function(){f.parentNode.removeChild(f),f=null}),document.body.appendChild(f),f.offsetHeight,f.classList.add(c),setTimeout(function(){f&&f.classList.remove(c)},duration),{isVisible:function(){return!!f}}}a.plusReady(function(){plus.nativeUI.toast(b,{verticalAlign:\"bottom\",duration:d.duration})})}}(mui,window),function(a,b,c){var d=\"mui-popup\",e=\"mui-popup-backdrop\",f=\"mui-popup-in\",g=\"mui-popup-out\",h=\"mui-popup-inner\",i=\"mui-popup-title\",j=\"mui-popup-text\",k=\"mui-popup-input\",l=\"mui-popup-buttons\",m=\"mui-popup-button\",n=\"mui-popup-button-bold\",e=\"mui-popup-backdrop\",o=\"mui-active\",p=[],q=function(){var b=c.createElement(\"div\");return b.classList.add(e),b.addEventListener(a.EVENT_MOVE,a.preventDefault),b.addEventListener(\"webkitTransitionEnd\",function(){this.classList.contains(o)||b.parentNode&&b.parentNode.removeChild(b)}),b}(),r=function(a){return'<div class=\"'+k+'\"><input type=\"text\" autofocus placeholder=\"'+(a||\"\")+'\"/></div>'},s=function(a,b,c){return'<div class=\"'+h+'\"><div class=\"'+i+'\">'+b+'</div><div class=\"'+j+'\">'+a.replace(/\\r\\n/g,\"<br/>\").replace(/\\n/g,\"<br/>\")+\"</div>\"+(c||\"\")+\"</div>\"},t=function(a){for(var b=a.length,c=[],d=0;b>d;d++)c.push('<span class=\"'+m+(d===b-1?\" \"+n:\"\")+'\">'+a[d]+\"</span>\");return'<div class=\"'+l+'\">'+c.join(\"\")+\"</div>\"},u=function(b,e){var h=c.createElement(\"div\");h.className=d,h.innerHTML=b;var i=function(){h.parentNode&&h.parentNode.removeChild(h),h=null};h.addEventListener(a.EVENT_MOVE,a.preventDefault),h.addEventListener(\"webkitTransitionEnd\",function(a){h&&a.target===h&&h.classList.contains(g)&&i()}),h.style.display=\"block\",c.body.appendChild(h),h.offsetHeight,h.classList.add(f),q.classList.contains(o)||(q.style.display=\"block\",c.body.appendChild(q),q.offsetHeight,q.classList.add(o));var j=a.qsa(\".\"+m,h),l=h.querySelector(\".\"+k+\" input\"),n={element:h,close:function(a,b){if(h){var c=e&&e({index:a||0,value:l&&l.value||\"\"});if(c===!1)return;b!==!1?(h.classList.remove(f),h.classList.add(g)):i(),p.pop(),p.length?p[p.length-1].show(b):q.classList.remove(o)}}},r=function(a){n.close(j.indexOf(a.target))};return a(h).on(\"tap\",\".\"+m,r),p.length&&p[p.length-1].hide(),p.push({close:n.close,show:function(a){h.style.display=\"block\",h.offsetHeight,h.classList.add(f)},hide:function(){h.style.display=\"none\",h.classList.remove(f)}}),n},v=function(b,c,d,e,f){return\"undefined\"!=typeof b?(\"function\"==typeof c?(e=c,f=d,c=null,d=null):\"function\"==typeof d&&(f=e,e=d,d=null),a.os.plus&&\"div\"!==f?plus.nativeUI.alert(b,e,c||\"提示\",d||\"确定\"):u(s(b,c||\"提示\")+t([d||\"确定\"]),e)):void 0},w=function(b,c,d,e,f){return\"undefined\"!=typeof b?(\"function\"==typeof c?(e=c,f=d,c=null,d=null):\"function\"==typeof d&&(f=e,e=d,d=null),a.os.plus&&\"div\"!==f?plus.nativeUI.confirm(b,e,c,d||[\"取消\",\"确认\"]):u(s(b,c||\"提示\")+t(d||[\"取消\",\"确认\"]),e)):void 0},x=function(b,c,d,e,f,g){return\"undefined\"!=typeof b?(\"function\"==typeof c?(f=c,g=d,c=null,d=null,e=null):\"function\"==typeof d?(f=d,g=e,d=null,e=null):\"function\"==typeof e&&(g=f,f=e,e=null),a.os.plus&&\"div\"!==g?plus.nativeUI.prompt(b,f,d||\"提示\",c,e||[\"取消\",\"确认\"]):u(s(b,d||\"提示\",r(c))+t(e||[\"取消\",\"确认\"]),f)):void 0},y=function(){return p.length?(p[p.length-1].close(),!0):!1},z=function(){for(;p.length;)p[p.length-1].close()};a.closePopup=y,a.closePopups=z,a.alert=v,a.confirm=w,a.prompt=x}(mui,window,document),function(a,b){var c=\"mui-progressbar\",d=\"mui-progressbar-in\",e=\"mui-progressbar-out\",f=\"mui-progressbar-infinite\",g=\".mui-progressbar\",h=function(b){if(b=a(b||\"body\"),0!==b.length){if(b=b[0],b.classList.contains(c))return b;var d=b.querySelectorAll(g);if(d)for(var e=0,f=d.length;f>e;e++){var h=d[e];if(h.parentNode===b)return h}}},i=function(h,i,j){if(\"number\"==typeof h&&(j=i,i=h,h=\"body\"),h=a(h||\"body\"),0!==h.length){h=h[0];var l;if(h.classList.contains(c))l=h;else{var m=h.querySelectorAll(g+\":not(.\"+e+\")\");if(m)for(var n=0,o=m.length;o>n;n++){var p=m[n];if(p.parentNode===h){l=p;break}}l?l.classList.add(d):(l=b.createElement(\"span\"),l.className=c+\" \"+d+(\"undefined\"!=typeof i?\"\":\" \"+f)+(j?\" \"+c+\"-\"+j:\"\"),\"undefined\"!=typeof i&&(l.innerHTML=\"<span></span>\"),h.appendChild(l))}return i&&k(h,i),l}},j=function(a){var b=h(a);if(b){var c=b.classList;c.contains(d)&&!c.contains(e)&&(c.remove(d),c.add(e),b.addEventListener(\"webkitAnimationEnd\",function(){b.parentNode&&b.parentNode.removeChild(b),b=null}))}},k=function(a,b,c){\"number\"==typeof a&&(c=b,b=a,a=!1);var d=h(a);if(d&&!d.classList.contains(f)){b&&(b=Math.min(Math.max(b,0),100)),d.offsetHeight;var e=d.querySelector(\"span\");if(e){var g=e.style;g.webkitTransform=\"translate3d(\"+(-100+b)+\"%,0,0)\",\"undefined\"!=typeof c?g.webkitTransitionDuration=c+\"ms\":g.webkitTransitionDuration=\"\"}return d}};a.fn.progressbar=function(a){var b=[];return a=a||{},this.each(function(){var c=this,d=c.mui_plugin_progressbar;d?a&&d.setOptions(a):c.mui_plugin_progressbar=d={options:a,setOptions:function(a){this.options=a},show:function(){return i(c,this.options.progress,this.options.color)},setProgress:function(a){return k(c,a)},hide:function(){return j(c)}},b.push(d)}),1===b.length?b[0]:b}}(mui,document),function(a,b,c){var d=\"mui-icon\",e=\"mui-icon-clear\",f=\"mui-icon-speech\",g=\"mui-icon-search\",h=\"mui-icon-eye\",i=\"mui-input-row\",j=\"mui-placeholder\",k=\"mui-tooltip\",l=\"mui-hidden\",m=\"mui-focusin\",n=\".\"+e,o=\".\"+f,p=\".\"+h,q=\".\"+j,r=\".\"+k,s=function(a){for(;a&&a!==c;a=a.parentNode)if(a.classList&&a.classList.contains(i))return a;return null},t=function(a,b){this.element=a,this.options=b||{actions:\"clear\"},~this.options.actions.indexOf(\"slider\")?(this.sliderActionClass=k+\" \"+l,this.sliderActionSelector=r):(~this.options.actions.indexOf(\"clear\")&&(this.clearActionClass=d+\" \"+e+\" \"+l,this.clearActionSelector=n),~this.options.actions.indexOf(\"speech\")&&(this.speechActionClass=d+\" \"+f,this.speechActionSelector=o),~this.options.actions.indexOf(\"search\")&&(this.searchActionClass=j,this.searchActionSelector=q),~this.options.actions.indexOf(\"password\")&&(this.passwordActionClass=d+\" \"+h,this.passwordActionSelector=p)),this.init()};t.prototype.init=function(){this.initAction(),this.initElementEvent()},t.prototype.initAction=function(){var b=this,c=b.element.parentNode;c&&(b.sliderActionClass?b.sliderAction=b.createAction(c,b.sliderActionClass,b.sliderActionSelector):(b.searchActionClass&&(b.searchAction=b.createAction(c,b.searchActionClass,b.searchActionSelector),b.searchAction.addEventListener(\"tap\",function(c){a.focus(b.element),c.stopPropagation()})),b.speechActionClass&&(b.speechAction=b.createAction(c,b.speechActionClass,b.speechActionSelector),b.speechAction.addEventListener(\"click\",a.stopPropagation),b.speechAction.addEventListener(\"tap\",function(a){b.speechActionClick(a)})),b.clearActionClass&&(b.clearAction=b.createAction(c,b.clearActionClass,b.clearActionSelector),b.clearAction.addEventListener(\"tap\",function(a){b.clearActionClick(a)})),b.passwordActionClass&&(b.passwordAction=b.createAction(c,b.passwordActionClass,b.passwordActionSelector),b.passwordAction.addEventListener(\"tap\",function(a){b.passwordActionClick(a)}))))},t.prototype.createAction=function(a,b,e){var f=a.querySelector(e);if(!f){var f=c.createElement(\"span\");f.className=b,b===this.searchActionClass&&(f.innerHTML='<span class=\"'+d+\" \"+g+'\"></span><span>'+this.element.getAttribute(\"placeholder\")+\"</span>\",this.element.setAttribute(\"placeholder\",\"\"),this.element.value.trim()&&a.classList.add(\"mui-active\")),a.insertBefore(f,this.element.nextSibling)}return f},t.prototype.initElementEvent=function(){var b=this.element;if(this.sliderActionClass){var c=this.sliderAction,d=null,e=function(){c.classList.remove(l);var a=b.offsetLeft,e=b.offsetWidth-28,f=c.offsetWidth,g=Math.abs(b.max-b.min),h=e/g*Math.abs(b.value-b.min);c.style.left=14+a+h-f/2+\"px\",c.innerText=b.value,d&&clearTimeout(d),d=setTimeout(function(){c.classList.add(l)},1e3)};b.addEventListener(\"input\",e),b.addEventListener(\"tap\",e),b.addEventListener(a.EVENT_MOVE,function(a){a.stopPropagation()})}else{if(this.clearActionClass){var f=this.clearAction;if(!f)return;a.each([\"keyup\",\"change\",\"input\",\"focus\",\"cut\",\"paste\"],function(a,c){!function(a){b.addEventListener(a,function(){f.classList[b.value.trim()?\"remove\":\"add\"](l)})}(c)}),b.addEventListener(\"blur\",function(){f.classList.add(l)})}this.searchActionClass&&(b.addEventListener(\"focus\",function(){b.parentNode.classList.add(\"mui-active\")}),b.addEventListener(\"blur\",function(){b.value.trim()||b.parentNode.classList.remove(\"mui-active\")}))}},t.prototype.setPlaceholder=function(a){if(this.searchActionClass){var b=this.element.parentNode.querySelector(q);b&&(b.getElementsByTagName(\"span\")[1].innerText=a)}else this.element.setAttribute(\"placeholder\",a)},t.prototype.passwordActionClick=function(a){\"text\"===this.element.type?this.element.type=\"password\":this.element.type=\"text\",this.passwordAction.classList.toggle(\"mui-active\"),a.preventDefault()},t.prototype.clearActionClick=function(b){var c=this;c.element.value=\"\",a.focus(c.element),c.clearAction.classList.add(l),b.preventDefault()},t.prototype.speechActionClick=function(d){if(b.plus){var e=this,f=e.element.value;e.element.value=\"\",c.body.classList.add(m),plus.speech.startRecognize({engine:\"iFly\"},function(b){e.element.value+=b,a.focus(e.element),plus.speech.stopRecognize(),a.trigger(e.element,\"recognized\",{value:e.element.value}),f!==e.element.value&&(a.trigger(e.element,\"change\"),a.trigger(e.element,\"input\"))},function(a){c.body.classList.remove(m)})}else alert(\"only for 5+\");d.preventDefault()},a.fn.input=function(b){var c=[];return this.each(function(){var b=null,d=[],e=s(this.parentNode);if(\"range\"===this.type&&e.classList.contains(\"mui-input-range\"))d.push(\"slider\");else{var f=this.classList;f.contains(\"mui-input-clear\")&&d.push(\"clear\"),a.os.android&&a.os.stream||!f.contains(\"mui-input-speech\")||d.push(\"speech\"),f.contains(\"mui-input-password\")&&d.push(\"password\"),\"search\"===this.type&&e.classList.contains(\"mui-search\")&&d.push(\"search\")}var g=this.getAttribute(\"data-input-\"+d[0]);if(g)b=a.data[g];else{g=++a.uuid,b=a.data[g]=new t(this,{actions:d.join(\",\")});for(var h=0,i=d.length;i>h;h++)this.setAttribute(\"data-input-\"+d[h],g)}c.push(b)}),1===c.length?c[0]:c},a.ready(function(){a(\".mui-input-row input\").input()})}(mui,window,document),function(a,b){var c=\"mui-active\",d=/^rgba\\((\\d{1,3}),\\s*(\\d{1,3}),\\s*(\\d{1,3}),\\s*(\\d*(?:\\.\\d+)?)\\)$/,e=function(a){var b=a.match(d);return b&&5===b.length?[b[1],b[2],b[3],b[4]]:[]},f=function(c,d){if(this.element=c,this.options=a.extend({top:0,offset:150,duration:16,scrollby:b},d||{}),this.scrollByElem=this.options.scrollby||b,!this.scrollByElem)throw new Error(\"监听滚动的元素不存在\");this.isNativeScroll=!1,this.scrollByElem===b?this.isNativeScroll=!0:~this.scrollByElem.className.indexOf(\"mui-scroll-wrapper\")||(this.isNativeScroll=!0),this._style=this.element.style,this._bgColor=this._style.backgroundColor;var f=e(mui.getStyles(this.element,\"backgroundColor\"));if(!f.length)throw new Error(\"元素背景颜色必须为RGBA\");this._R=f[0],this._G=f[1],this._B=f[2],this._A=parseFloat(f[3]),this.lastOpacity=this._A,this._bufferFn=a.buffer(this.handleScroll,this.options.duration,this),this.initEvent()};f.prototype.initEvent=function(){this.scrollByElem.addEventListener(\"scroll\",this._bufferFn),this.isNativeScroll&&this.scrollByElem.addEventListener(a.EVENT_MOVE,this._bufferFn)},f.prototype.handleScroll=function(d){var e=b.scrollY;!this.isNativeScroll&&d&&d.detail&&(e=-d.detail.y);var f=(e-this.options.top)/this.options.offset+this._A;f=Math.min(Math.max(this._A,f),1),this._style.backgroundColor=\"rgba(\"+this._R+\",\"+this._G+\",\"+this._B+\",\"+f+\")\",f>this._A?this.element.classList.add(c):this.element.classList.remove(c),this.lastOpacity!==f&&(a.trigger(this.element,\"alpha\",{alpha:f}),this.lastOpacity=f)},f.prototype.destory=function(){this.scrollByElem.removeEventListener(\"scroll\",this._bufferFn),this.scrollByElem.removeEventListener(a.EVENT_MOVE,this._bufferFn),this.element.style.backgroundColor=this._bgColor,this.element.mui_plugin_transparent=null},a.fn.transparent=function(a){a=a||{};var c=[];return this.each(function(){var d=this.mui_plugin_transparent;if(!d){var e=this.getAttribute(\"data-top\"),g=this.getAttribute(\"data-offset\"),h=this.getAttribute(\"data-duration\"),i=this.getAttribute(\"data-scrollby\");null!==e&&\"undefined\"==typeof a.top&&(a.top=e),null!==g&&\"undefined\"==typeof a.offset&&(a.offset=g),null!==h&&\"undefined\"==typeof a.duration&&(a.duration=h),null!==i&&\"undefined\"==typeof a.scrollby&&(a.scrollby=document.querySelector(i)||b),d=this.mui_plugin_transparent=new f(this,a)}c.push(d)}),1===c.length?c[0]:c},a.ready(function(){a(\".mui-bar-transparent\").transparent()})}(mui,window),function(a){var b=\"ontouchstart\"in document,c=b?\"tap\":\"click\",d=\"change\",e=\"mui-numbox\",f=\".mui-btn-numbox-plus,.mui-numbox-btn-plus\",g=\".mui-btn-numbox-minus,.mui-numbox-btn-minus\",h=\".mui-input-numbox,.mui-numbox-input\",i=a.Numbox=a.Class.extend({init:function(b,c){var d=this;if(!b)throw\"构造 numbox 时缺少容器元素\";d.holder=b,c=c||{},c.step=parseInt(c.step||1),d.options=c,d.input=a.qsa(h,d.holder)[0],d.plus=a.qsa(f,d.holder)[0],d.minus=a.qsa(g,d.holder)[0],d.checkValue(),d.initEvent()},initEvent:function(){var b=this;b.plus.addEventListener(c,function(c){var e=parseInt(b.input.value)+b.options.step;b.input.value=e.toString(),a.trigger(b.input,d,null)}),b.minus.addEventListener(c,function(c){var e=parseInt(b.input.value)-b.options.step;b.input.value=e.toString(),a.trigger(b.input,d,null)}),b.input.addEventListener(d,function(c){b.checkValue();var e=parseInt(b.input.value);a.trigger(b.holder,d,{value:e})})},getValue:function(){var a=this;return parseInt(a.input.value)},checkValue:function(){var a=this,b=a.input.value;if(null==b||\"\"==b||isNaN(b))a.input.value=a.options.min||0,a.minus.disabled=null!=a.options.min;else{var b=parseInt(b);null!=a.options.max&&!isNaN(a.options.max)&&b>=parseInt(a.options.max)?(b=a.options.max,a.plus.disabled=!0):a.plus.disabled=!1,null!=a.options.min&&!isNaN(a.options.min)&&b<=parseInt(a.options.min)?(b=a.options.min,a.minus.disabled=!0):a.minus.disabled=!1,a.input.value=b}},setOption:function(a,b){var c=this;c.options[a]=b},setValue:function(a){this.input.value=a,this.checkValue()}});a.fn.numbox=function(a){return this.each(function(a,b){if(!b.numbox)if(d)b.numbox=new i(b,d);else{var c=b.getAttribute(\"data-numbox-options\"),d=c?JSON.parse(c):{};d.step=b.getAttribute(\"data-numbox-step\")||d.step,d.min=b.getAttribute(\"data-numbox-min\")||d.min,d.max=b.getAttribute(\"data-numbox-max\")||d.max,b.numbox=new i(b,d)}}),this[0]?this[0].numbox:null},a.ready(function(){a(\".\"+e).numbox()})}(mui),function(a,b,c){var d=\"mui-disabled\",e=\"reset\",f=\"loading\",g={loadingText:\"Loading...\",loadingIcon:\"mui-spinner mui-spinner-white\",loadingIconPosition:\"left\"},h=function(b,c){this.element=b,this.options=a.extend({},g,c),this.options.loadingText||(this.options.loadingText=g.loadingText),null===this.options.loadingIcon&&(this.options.loadingIcon=\"mui-spinner\",\"rgb(255, 255, 255)\"===a.getStyles(this.element,\"color\")&&(this.options.loadingIcon+=\" mui-spinner-white\")),this.isInput=\"INPUT\"===this.element.tagName,this.resetHTML=this.isInput?this.element.value:this.element.innerHTML,this.state=\"\"};h.prototype.loading=function(){this.setState(f)},h.prototype.reset=function(){this.setState(e)},h.prototype.setState=function(a){if(this.state===a)return!1;if(this.state=a,a===e)this.element.disabled=!1,this.element.classList.remove(d),this.setHtml(this.resetHTML);else if(a===f){this.element.disabled=!0,this.element.classList.add(d);var b=this.isInput?this.options.loadingText:\"<span>\"+this.options.loadingText+\"</span>\";this.options.loadingIcon&&!this.isInput&&(\"right\"===this.options.loadingIconPosition?b+='&nbsp;<span class=\"'+this.options.loadingIcon+'\"></span>':b='<span class=\"'+this.options.loadingIcon+'\"></span>&nbsp;'+b),this.setHtml(b)}},h.prototype.setHtml=function(a){this.isInput?this.element.value=a:this.element.innerHTML=a},a.fn.button=function(a){var b=[];return this.each(function(){var c=this.mui_plugin_button;if(!c){var d=this.getAttribute(\"data-loading-text\"),g=this.getAttribute(\"data-loading-icon\"),i=this.getAttribute(\"data-loading-icon-position\");this.mui_plugin_button=c=new h(this,{loadingText:d,loadingIcon:g,loadingIconPosition:i})}(a===f||a===e)&&c.setState(a),b.push(c)}),1===b.length?b[0]:b}}(mui,window,document);"

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = __webpack_require__(3);
var Permission = __webpack_require__(46);
var Utils = __webpack_require__(1);

var Main = function (_Plugin) {
    _inherits(Main, _Plugin);

    function Main() {
        _classCallCheck(this, Main);

        var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this));

        _this.permission = new Permission();
        return _this;
    }

    _createClass(Main, [{
        key: 'needReady',
        value: function needReady() {
            if (Utils.getBrowserInfo().mobile != null) {
                return [this.permission.bridge];
            } else {
                return [];
            }
        }
    }]);

    return Main;
}(Plugin);

module.exports = Main;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * method.js
 * Version: 0.1
 * User: shz
 * Date: 2017-09-14
 * Copyright(c)  2017. U-GEN Tech.Co,Ltd. All Rights Reserved.
 * permission 调用bridge方法
 */
var Bridge = __webpack_require__(47);
var READ_FILE = "READ_EXTERNAL_STORAGE";
var SMS = "SEND_SMS";
var SENSORS = "SENSORS";
var PHONE = "PHONE";
var CALENDAR = "READ_CALENDAR";
var CONTACTS = "READ_CONTACTS";
var CAMERA = "CAMERA";
var LOCATION = "ACCESS_FINE_LOCATION";

/**
 * @class
 * Permission
 */

var PermissionMethod = function () {
    function PermissionMethod() {
        _classCallCheck(this, PermissionMethod);

        this.map = [];
        this.bridge = new Bridge();
    }

    /**
     * 申请Android权限
     * @param permission 由需要申请的权限组成的数组
     * @param success
     * @param error
     */


    _createClass(PermissionMethod, [{
        key: "checkPermission",
        value: function checkPermission(permission, success, error) {
            this.bridge.obj.checkPermission(permission, function (ret) {
                success(ret);
            }, function (err) {
                error(err);
            });
        }
    }]);

    return PermissionMethod;
}();

module.exports = PermissionMethod;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * index.js
 * Version: 0.1
 * User: shz
 * Date: 2017-11-15
 * Copyright(c)  2017. U-GEN Tech.Co,Ltd. All Rights Reserved.
 * index
 */
var Ready = __webpack_require__(2);

var PermissionBridge = function (_Ready) {
    _inherits(PermissionBridge, _Ready);

    function PermissionBridge() {
        _classCallCheck(this, PermissionBridge);

        var _this = _possibleConstructorReturn(this, (PermissionBridge.__proto__ || Object.getPrototypeOf(PermissionBridge)).call(this));

        document.addEventListener("plusready", function () {
            _this.onPlusready();
            _this.dispatch();
        }, false);
        return _this;
    }

    _createClass(PermissionBridge, [{
        key: 'onPlusready',
        value: function onPlusready() {
            var _PERMISSIONCODE = 'UgenPermission',
                B = window.plus.bridge,
                callbackID = void 0;
            var UgenPermission = {
                //开始扫描ble设备
                checkPermission: function checkPermission(permission, successCallback, errorCallback) {
                    // alert('api js function scan init');
                    var success = typeof successCallback !== 'function' ? null : function (args) {
                        successCallback(args);
                    },
                        fail = typeof errorCallback !== 'function' ? null : function (code) {
                        errorCallback(code);
                    };
                    callbackID = B.callbackId(success, fail);
                    return B.exec(_PERMISSIONCODE, "checkPermission", [callbackID, permission]);
                }
            };
            this.UgenPermission = UgenPermission;
        }
    }, {
        key: 'onReady',
        value: function onReady() {
            return this.UgenPermission;
        }
    }]);

    return PermissionBridge;
}(Ready);

module.exports = PermissionBridge;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(4);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * method.js
 * Version: 0.1
 * User: shz
 * Date: 2017-09-14
 * Copyright(c)  2017. U-GEN Tech.Co,Ltd. All Rights Reserved.
 * BLEMethod 蓝牙调用bridge方法
 */
var Bridge = __webpack_require__(50);

/**
 * BLE
 * @class
 */

var BLEMethod = function () {
    function BLEMethod() {
        _classCallCheck(this, BLEMethod);

        this.map = [];
        this.bridge = new Bridge();
    }

    /**
     * 开始扫描
     * @example iot.ble.startScan(10, (response) => {
     * }, (error) => {
     * }, []);
     * @param {number} seconds 扫描时间（秒）
     * @param {function} success 接口调用成功
     * @param {function} error - 接口调用失败
     * @param {Array} [filter] - 过滤产品型号
     * @param {Array} [uuids] - 搜索特定uuid数组
     */


    _createClass(BLEMethod, [{
        key: "startScan",
        value: function startScan(seconds, success, error, filter, uuids) {
            var deviceList = new Set();
            this.bridge.obj.startScan(seconds, function (ret) {
                if (ret.event === "find") {
                    var device = ret.device;
                    if (!deviceList.has(device.id)) {
                        deviceList.add(device.id);
                        if (filter instanceof Array && filter.length > 0) {
                            for (var i in filter) {
                                var item = filter[i];
                                if (device.name && device.name.indexOf(item) > -1) {
                                    success(ret);
                                }
                            }
                        } else success(ret);
                    }
                } else {
                    success(ret);
                }
            }, function (err) {
                error(err);
            }, uuids);
        }

        /**
         * 停止扫描
         */

    }, {
        key: "stopScan",
        value: function stopScan(success) {
            var res = this.bridge.obj.stopScan();
            if (success) {
                success(res);
            } else {
                return res;
            }
        }

        /**
         * 开始搜索
         *
         * @param {object} info - 搜索参数
         * @param {string} [info.id] - mac地址 or uuid
         * @param {object} successCallback - 成功回调
         * @param {object} errorCallback - 失败回调
         * @example connect({
         *      id:"12:34:56:78:90:AB"
         * },(res)=>{
         *      console.log(res);
         * },(error)=>{
         *      console.log(error);
         * });
         */

    }, {
        key: "connect",
        value: function connect(info, success, error) {
            var _this = this;

            var oSuccess = function oSuccess(ret) {
                if (ret.event === "connectSuccess" && info.iosPair) {
                    success(ret);
                    ret.event = "pair";
                    success(ret);
                    _this.write(info.iosPair.suuid, info.iosPair.wuuid, "11", function (r) {
                        ret.event = "bondSuccess";
                        success(ret);
                    }, error);
                } else {
                    success(ret);
                }
            };
            this.bridge.obj.connect(info, oSuccess, function (err) {
                error(err);
            });
        }

        /**
         * 断开连接
         */

    }, {
        key: "disconnect",
        value: function disconnect(info) {
            return this.bridge.obj.disconnect(info);
        }

        /**
         * 监听蓝牙状态改变
         *
         * @deprecated See {@link BLEMethod#setStateListener}
         */

    }, {
        key: "onBtStateChange",
        value: function onBtStateChange() {}

        /**
         * 监听蓝牙所有操作的所有返回内容
         * @param {BLEMethod~stateListener} listener
         */

    }, {
        key: "setStateListener",
        value: function setStateListener(listener) {
            this.bridge.obj.setStateListener(function (ret) {
                listener(ret);
            });
        }

        /**
         * 蓝牙事件监听返回
         * @callback BLEMethod~stateListener
         * @param {string} event - btEnble|btDisable|androidBug|startScan|scanTimeout|stopScan|connectError|connectSuccess|disconnect|disconnectSuccess
         * @param {Object} device
         */

        /**
         * 获取开关蓝牙状态
         *
         * @example let state = getBTState();
         * console.log(state);//true or false
         * @return {boolean}
         */

    }, {
        key: "getBTState",
        value: function getBTState(success) {
            var state;
            return _regenerator2.default.async(function getBTState$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return _regenerator2.default.awrap(this.bridge.obj.getBTState());

                        case 2:
                            state = _context.sent;

                            if (!success) {
                                _context.next = 7;
                                break;
                            }

                            success(state);
                            _context.next = 8;
                            break;

                        case 7:
                            return _context.abrupt("return", state);

                        case 8:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, this);
        }

        /**
         * 蓝牙是否连接设备
         */

    }, {
        key: "isConnected",
        value: function isConnected(success) {
            var isConnected = this.bridge.obj.isConnected();
            if (success) {
                success(isConnected);
            } else {
                return isConnected;
            }
        }

        /**
         * 写数据
         *
         * @param {string} suuid - service uuid
         * @param {string} wuuid - 特性值 uuid
         * @param {byteArray} data - byte数组
         * @param {object} successCallback - 写入成功的回调
         * @param {object} errorCallback - 写入失败的回调
         */

    }, {
        key: "write",
        value: function write(suuid, wuuid, value, success, error) {
            this.bridge.obj.write(suuid, wuuid, value, function (ret) {
                success(ret);
            }, function (err) {
                error(err);
            });
        }
    }, {
        key: "getState",
        value: function getState(success, error) {
            this.bridge.obj.getState(function (ret) {
                success(ret);
            }, function (err) {
                error(err);
            });
        }

        /**
         * 监听设备连接后的操作
         * @enum{ test }
         * @deprecated See {@link BLEMethod#setStateListener}
         */

    }, {
        key: "setUpdateState",
        value: function setUpdateState() {
            var _this2 = this;

            this.onBtStateChange();
            this.bridge.obj.setUpdateState(function (ret) {
                if (ret.type == 'msg') {
                    if (_this2.modelFunction instanceof Function) {
                        var size = _this2.modelFunction(ret.data);
                        var prevMapSize = _this2.map.length;
                        _this2.map = _this2.map.concat(ret.data);
                        if (size > 0) {
                            var data = _this2.map.slice(0, prevMapSize + size);
                            _this2.map = _this2.map.slice(data.length, _this2.map.length);
                            _this2.msgCallback(data);
                        }
                    } else {
                        _this2.msgCallback(ret.data);
                    }
                } else {
                    _this2.eventCallback(ret);
                }
            });
        }

        /**
         * 跳转到蓝牙开关界面
         *
         */

    }, {
        key: "toSetting",
        value: function toSetting(type) {
            this.bridge.obj.toSetting(type, function (ret) {
                success(ret);
            }, function (err) {
                error(err);
            });
        }

        /**
         * 设置数据的解析方法
         *
         */

    }, {
        key: "setModelFunction",
        value: function setModelFunction(fn) {
            this.setUpdateState();
            this.modelFunction = fn;
        }

        /**
         * 监听蓝牙事件
         *
         * @param {object} fn - 数据返回的回调
         * @deprecated See {@link BLEMethod#setStateListener}
         */

    }, {
        key: "onEvent",
        value: function onEvent(fn) {
            this.setUpdateState();
            this.eventCallback = fn;
        }

        /**
         * 数据返回的监听
         *
         * @param {object} fn - 数据返回的回调
         * @deprecated See {@link BLEMethod#notify}
         * 原本调用notify后数据会进入此方法的回调函数，现在调用notify后会进入自己的回调
         */

    }, {
        key: "onMsg",
        value: function onMsg(fn) {
            this.setUpdateState();
            this.msgCallback = fn;
        }

        /**
         * 读数据
         *
         * @param {string} suuid - service uuid
         * @param {string} ruuid - 特性值 uuid
         * @param {object} successCallback - 数据返回的回调
         * @param {object} errorCallback - 读取失败的回调
         */

    }, {
        key: "read",
        value: function read(suuid, wuuid, success, failure) {
            this.bridge.obj.read(suuid, wuuid, function (ret) {
                success(ret);
            }, function (err) {
                failure(err);
            });
        }

        /**
         * 监听特定特性值的数据
         *
         * @param {string} suuid - service uuid
         * @param {string} nuuid - 特性值 uuid
         * @param {object} successCallback - 数据返回的回调
         * @param {object} errorCallback - 监听失败的回调
         */

    }, {
        key: "notify",
        value: function notify(suuid, wuuid, success, failure) {
            this.bridge.obj.notify(suuid, wuuid, function (ret) {
                success(ret);
            }, function (err) {
                failure(err);
            });
        }

        /**
         * 连接后设置配对密码
         *
         * @param {string} id - 设备地址
         * @param {array} pin - pin值[0,0,1,2,3]
         */

    }, {
        key: "setPin",
        value: function setPin(id, pin) {
            return this.bridge.obj.setPin(id, pin);
        }
    }]);

    return BLEMethod;
}();
//枚举 event setStateListener
//onEvent过期

module.exports = BLEMethod;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = __webpack_require__(3);
var BLE = __webpack_require__(48);
var Utils = __webpack_require__(1);

var Main = function (_Plugin) {
    _inherits(Main, _Plugin);

    function Main() {
        _classCallCheck(this, Main);

        var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this));

        _this.ble = new BLE();
        return _this;
    }

    _createClass(Main, [{
        key: 'needReady',
        value: function needReady() {
            if (Utils.getBrowserInfo().mobile != null) {
                return [this.ble.bridge];
            } else {
                return [];
            }
        }
    }]);

    return Main;
}(Plugin);

module.exports = Main;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ready = __webpack_require__(2);
var bridge = __webpack_require__(51);

var BLEBridge = function (_Ready) {
    _inherits(BLEBridge, _Ready);

    function BLEBridge() {
        _classCallCheck(this, BLEBridge);

        var _this = _possibleConstructorReturn(this, (BLEBridge.__proto__ || Object.getPrototypeOf(BLEBridge)).call(this));

        document.addEventListener("plusready", function () {
            _this.onPlusready();
            _this.dispatch();
        }, false);
        return _this;
    }

    _createClass(BLEBridge, [{
        key: 'onPlusready',
        value: function onPlusready() {

            this.Ugen_BLEPlugin = new bridge();
        }
    }, {
        key: 'onReady',
        value: function onReady() {
            return this.Ugen_BLEPlugin;
        }
    }]);

    return BLEBridge;
}(Ready);

module.exports = BLEBridge;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(4);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * BLEBridge
 * @class
 */

var BLEBridge = function () {
    function BLEBridge() {
        _classCallCheck(this, BLEBridge);

        this.bridge = window.plus.bridge;
        this.code = "UgenBLEPlugin";
    }

    _createClass(BLEBridge, [{
        key: "formartCallback",
        value: function formartCallback(callback) {
            return typeof callback !== 'function' ? null : function (args) {
                callback(args);
            };
        }
    }, {
        key: "getCallbackID",
        value: function getCallbackID(successCallback, errorCallback) {
            var success = this.formartCallback(successCallback);
            var fail = this.formartCallback(errorCallback);
            return this.bridge.callbackId(success, fail);
        }
        /**
         * 开始搜索
         * @param {number} seconds - 超时时间.
         * @param {object} successCallback - 成功回调
         * @param {object} errorCallback - 失败回调
         * @param {array} uuids - uuid过滤
         * @example startScan(30,(res)=>{
         *      console.log(res);
         * },(error)=>{
         *      console.log(error);
         * },[]);
         */

    }, {
        key: "startScan",
        value: function startScan(seconds, successCallback, errorCallback, uuids) {
            var callbackID = this.getCallbackID(successCallback, errorCallback);
            this.bridge.exec(this.code, "startScan", [callbackID, seconds, uuids]);
        }

        /**
         * 停止搜索
         * @example stopScan();
         */

    }, {
        key: "stopScan",
        value: function stopScan() {
            return this.bridge.execSync(this.code, "stopScan", []);
        }

        /**
         * 开始搜索
         *
         * @param {object} 搜索参数
         * @param {string} [info.id] - mac地址 or uuid
         * @param {object} successCallback - 成功回调
         * @param {object} errorCallback - 失败回调
         * @example connect({
         *      id:"12:34:56:78:90:AB"
         * },(res)=>{
         *      console.log(res);
         * },(error)=>{
         *      console.log(error);
         * });
         */

    }, {
        key: "connect",
        value: function connect(info, successCallback, errorCallback) {
            var callbackID = this.getCallbackID(successCallback, errorCallback);
            return this.bridge.exec(this.code, "connect", [callbackID, info]);
        }

        /**
         * 停止搜索
         *
         * @example disconnect();
         */

    }, {
        key: "disconnect",
        value: function disconnect(info) {
            var data = [];
            if (info !== undefined) data.push(info);
            return this.bridge.execSync(this.code, "disconnect", data);
        }

        /**
         * 获取蓝牙状态
         *
         * @example let state = getBTState();
         * console.log(state);//true or false
         * @return {boolean}
         */

    }, {
        key: "getBTState",
        value: function getBTState() {
            var _this = this;

            return _regenerator2.default.async(function getBTState$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!('iOS' === plus.os.name)) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt("return", new Promise(function (r, j) {
                                var callbackId = _this.getCallbackID(function (res) {
                                    r(res);
                                }, function (err) {
                                    j(err);
                                });
                                _this.bridge.exec(_this.code, "getBTState", [callbackId]);
                            }));

                        case 2:
                            return _context.abrupt("return", this.bridge.execSync(this.code, "getBTState", []));

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, this);
        }

        /**
         * 蓝牙事件监听
         *
         * @param {object} successCallback - 监听后事件返回的回调
         * @param {object} errorCallback - 监听失败回调
         * @example setListener((event)=>{
         *      console.log(event);
         * },(error)=>{
         *      console.log(error);
         * });
         */

    }, {
        key: "setStateListener",
        value: function setStateListener(successCallback, errorCallback) {
            var callbackID = this.getCallbackID(successCallback, errorCallback);
            this.bridge.exec(this.code, "setStateListener", [callbackID]);
        }

        /**
         * 蓝牙是否连接设备
         *
         * @example let state = getBtState();
         * console.log(state);//true or false
         * @return {boolean}
         */

    }, {
        key: "isConnected",
        value: function isConnected() {
            return this.bridge.execSync(this.code, "isConnected", []);
        }

        /**
         * 写数据
         *
         * @param {string} suuid - service uuid
         * @param {string} wuuid - 特性值 uuid
         * @param {byteArray} data - byte数组
         * @param {object} successCallback - 写入成功的回调
         * @param {object} errorCallback - 写入失败的回调
         */

    }, {
        key: "write",
        value: function write(suuid, wuuid, data, successCallback, errorCallback) {
            var callbackID = this.getCallbackID(successCallback, errorCallback);
            this.bridge.exec(this.code, "write", [callbackID, suuid, wuuid, data]);
        }

        /**
         * 读数据
         *
         * @param {string} suuid - service uuid
         * @param {string} ruuid - 特性值 uuid
         * @param {object} successCallback - 数据返回的回调
         * @param {object} errorCallback - 读取失败的回调
         */

    }, {
        key: "read",
        value: function read(suuid, ruuid, successCallback, errorCallback) {
            var callbackID = this.getCallbackID(successCallback, errorCallback);
            this.bridge.exec(this.code, "read", [callbackID, suuid, ruuid]);
        }

        /**
         * 监听特定特性值
         *
         * @param {string} suuid - service uuid
         * @param {string} nuuid - 特性值 uuid
         * @param {object} successCallback - 数据返回的回调
         * @param {object} errorCallback - 监听失败的回调
         */

    }, {
        key: "notify",
        value: function notify(suuid, nuuid, successCallback, errorCallback, onMsg) {
            var callback = function callback(res) {
                if ((typeof res === "undefined" ? "undefined" : _typeof(res)) === Array) {
                    onMsg(res);
                } else {
                    successCallback(res);
                }
            };
            var callbackID = this.getCallbackID(callback, errorCallback);
            this.bridge.exec(this.code, "notify", [callbackID, suuid, nuuid]);
        }
    }, {
        key: "toSetting",
        value: function toSetting(type, successCallback, errorCallback) {
            var callbackID = this.getCallbackID(successCallback, errorCallback);
            this.bridge.exec(this.code, "toSetting", [callbackID, type]);
        }
    }, {
        key: "setPin",
        value: function setPin(id, pin) {
            return this.bridge.execSync(this.code, "setPin", [id, pin]);
        }
    }, {
        key: "onReady",
        value: function onReady() {
            return this.Ugen_BLEPlugin;
        }
    }]);

    return BLEBridge;
}();

module.exports = BLEBridge;

/***/ }),
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(60);


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IOTMain = __webpack_require__(15);
var Business = __webpack_require__(61);
var Ble = __webpack_require__(49);
var Permission = __webpack_require__(45);
var vueI18N = __webpack_require__(35);
var Navigator = __webpack_require__(36);

var IOT = function (_IOTMain) {
    _inherits(IOT, _IOTMain);

    function IOT(params) {
        _classCallCheck(this, IOT);

        // 组件加载
        var _this = _possibleConstructorReturn(this, (IOT.__proto__ || Object.getPrototypeOf(IOT)).call(this, params));

        var businessPlugin = new Business(params);
        _this.loadPlugin(businessPlugin);
        _this.business = businessPlugin.business;

        var blePlugin = new Ble();
        _this.loadPlugin(blePlugin);
        _this.ble = blePlugin.ble;

        var permissionPlugin = new Permission();
        _this.loadPlugin(permissionPlugin);
        _this.permission = permissionPlugin.permission;

        if (params.vue) {
            var i18n = new vueI18N(params.lang || ["zh"], params.vue, params.i18n);
            _this.loadPlugin(i18n);
        }

        // 无ready组件
        _this.navigator = new Navigator(Navigator.type.DEBUG);
        return _this;
    }

    return IOT;
}(IOTMain);

module.exports = IOT;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = __webpack_require__(3);
var Bridge = __webpack_require__(28);
var User = __webpack_require__(33);
var Device = __webpack_require__(34);

var Business = function (_Plugin) {
    _inherits(Business, _Plugin);

    function Business(params) {
        _classCallCheck(this, Business);

        var _this = _possibleConstructorReturn(this, (Business.__proto__ || Object.getPrototypeOf(Business)).call(this));

        _this.business = new Bridge(params);
        _this.business.user = new User(_this.business);
        _this.business.device = new Device(_this.business);
        _this.business.product = _this.business.api.product;
        _this.business.app = _this.business.api.app;
        return _this;
    }

    _createClass(Business, [{
        key: 'needReady',
        value: function needReady() {
            return new Array(this.business);
        }
    }]);

    return Business;
}(Plugin);

module.exports = Business;

/***/ })
/******/ ]);
});