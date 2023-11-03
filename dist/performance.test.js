/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ performance_test),
  handleSummary: () => (/* binding */ handleSummary),
  options: () => (/* binding */ options),
  setup: () => (/* binding */ setup)
});

;// CONCATENATED MODULE: external "https://jslib.k6.io/k6-summary/0.0.3/index.js"
const index_js_namespaceObject = require("https://jslib.k6.io/k6-summary/0.0.3/index.js");
;// CONCATENATED MODULE: external "k6/execution"
const execution_namespaceObject = require("k6/execution");
var execution_default = /*#__PURE__*/__webpack_require__.n(execution_namespaceObject);
;// CONCATENATED MODULE: external "k6/http"
const http_namespaceObject = require("k6/http");
var http_default = /*#__PURE__*/__webpack_require__.n(http_namespaceObject);
;// CONCATENATED MODULE: ./src/models.ts
var HTTP_METHOD = /*#__PURE__*/function (HTTP_METHOD) {
  HTTP_METHOD["GET"] = "GET";
  HTTP_METHOD["POST"] = "POST";
  return HTTP_METHOD;
}({});
;// CONCATENATED MODULE: external "k6"
const external_k6_namespaceObject = require("k6");
;// CONCATENATED MODULE: external "k6/data"
const data_namespaceObject = require("k6/data");
;// CONCATENATED MODULE: ./src/utils.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



var Utils = /*#__PURE__*/_createClass(function Utils() {
  _classCallCheck(this, Utils);
});

/////// Private methods ///////
_defineProperty(Utils, "loadConfig", function () {
  return {
    authInfo: getData("".concat(__ENV.AUTH_INFO)),
    baseUrl: "".concat(__ENV.API_URL),
    requests: getRequests("".concat(__ENV.DATA_FILE))
  };
});
_defineProperty(Utils, "getAuthToken", function (authInfo) {
  var loginRes = http_default().post(authInfo.url, authInfo.data, {
    responseType: 'text'
  });
  var authToken = loginRes.json(authInfo.tokenPath);
  (0,external_k6_namespaceObject.check)(authToken, {
    'logged in successfully': function loggedInSuccessfully() {
      return authToken !== '';
    }
  });
  return authToken;
});
_defineProperty(Utils, "getThresholdsAndTags", function (requests) {
  return requests.reduce(function (thresholdAndTags, request) {
    thresholdAndTags.thresholds["http_req_duration{name:".concat(request.tag, "}")] = ["min<=".concat(request.threshold)];
    thresholdAndTags.tags.push({
      name: request.tag
    });
    return thresholdAndTags;
  }, {
    thresholds: {},
    tags: []
  });
});
var getData = function getData(filePath) {
  return JSON.parse(open(filePath));
};
var getRequests = function getRequests(filePath) {
  return new data_namespaceObject.SharedArray('requests', function () {
    var loadedRequests = getData(filePath).requests;
    return loadedRequests.reduce(function (requestsToTest, request) {
      if (request.disable) return requestsToTest;
      if (request.body.name_of_the_file) {
        request.body = getData("".concat(request.body.name_of_the_file));
      }
      requestsToTest.push(request);
      return requestsToTest;
    }, []);
  });
};
;// CONCATENATED MODULE: ./src/tests/performance.test.ts
function performance_test_typeof(o) { "@babel/helpers - typeof"; return performance_test_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, performance_test_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { performance_test_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function performance_test_defineProperty(obj, key, value) { key = performance_test_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function performance_test_toPropertyKey(arg) { var key = performance_test_toPrimitive(arg, "string"); return performance_test_typeof(key) === "symbol" ? key : String(key); }
function performance_test_toPrimitive(input, hint) { if (performance_test_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (performance_test_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }





var config = Utils.loadConfig();
var thresholdAndTags = Utils.getThresholdsAndTags(config.requests);
http_default().setResponseCallback(http_default().expectedStatuses(200));

// Init code (Once per VU)
var options = {
  vus: 1,
  iterations: 3,
  discardResponseBodies: true,
  noCookiesReset: true,
  insecureSkipTLSVerify: true,
  thresholds: _objectSpread({
    'iteration_duration{group:::setup}': ["max>=0"],
    'iteration_duration{scenario:default}': ["max>=0"],
    'http_req_duration{group:::setup}': ["max>=0"],
    'http_req_duration{scenario:default}': ["max>=0"],
    http_req_failed: ['rate===0']
  }, thresholdAndTags.thresholds)
};

// Setup code (Once)
function setup() {
  var authToken = Utils.getAuthToken(config.authInfo);
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: "Bearer ".concat(authToken)
    }
  };
}

// VU code (Once per iteration, as many times as the test options require)
/* harmony default export */ function performance_test(params) {
  config.requests.forEach(function (request, index) {
    var url = "".concat(config.baseUrl).concat(request.path);
    params.tags = thresholdAndTags.tags[index];
    switch (request.method.toUpperCase()) {
      case HTTP_METHOD.GET:
        http_default().get(url, params);
        break;
      case HTTP_METHOD.POST:
        http_default().post(url, JSON.stringify(request.body), params);
        break;
      default:
        // will abort the test returning the exit code 108
        execution_default().test.abort("Request: '".concat(request.tag, "', Invalid method: '").concat(request.method, "'. Possible values: [GET, POST]."));
    }
  });
}

// After your test runs, k6 aggregates your metrics into a JavaScript object. The handleSummary() function takes this object as an argument
function handleSummary(data) {
  var manipulatedData = JSON.parse(JSON.stringify(data));
  delete manipulatedData.setup_data;
  return {
    stdout: (0,index_js_namespaceObject.textSummary)(manipulatedData, {
      indent: ' ',
      enableColors: true
    }),
    'summary.json': JSON.stringify(manipulatedData)
  };
}
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=performance.test.js.map