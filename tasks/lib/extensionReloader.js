(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("ws"), require("webpack"), require("webpack-sources"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "ws", "webpack", "webpack-sources"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("lodash"), require("ws"), require("webpack"), require("webpack-sources")) : factory(root["lodash"], root["ws"], root["webpack"], root["webpack-sources"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function(__WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__8__, __WEBPACK_EXTERNAL_MODULE__14__, __WEBPACK_EXTERNAL_MODULE__30__) {
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = ".";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 57);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug = exports.error = exports.warn = exports.info = exports.log = exports.setLogLevel = void 0;

var log_constants_1 = __webpack_require__(3);

var safe_1 = __webpack_require__(9);

var logLevel;

exports.setLogLevel = function (level) {
  return logLevel = level;
};

exports.log = function (message) {
  return logLevel >= log_constants_1.LOG && console.log(message);
};

exports.info = function (message) {
  return logLevel >= log_constants_1.INFO && console.info(safe_1.green(message));
};

exports.warn = function (message) {
  return logLevel >= log_constants_1.WARN && console.warn(safe_1.yellow(message));
};

exports.error = function (message) {
  return logLevel >= log_constants_1.ERROR && console.error(safe_1.red(message));
};

exports.debug = function (message) {
  return logLevel >= log_constants_1.DEBUG && console.debug(safe_1.white(exports.debug(message)));
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEBUG = exports.ERROR = exports.WARN = exports.INFO = exports.LOG = exports.NONE = void 0;
exports.NONE = 0;
exports.LOG = 1;
exports.INFO = 2;
exports.WARN = 3;
exports.ERROR = 4;
exports.DEBUG = 5;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = __webpack_require__(5);
var util = __webpack_require__(1);
var ArraySet = __webpack_require__(6).ArraySet;
var MappingList = __webpack_require__(19).MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = __webpack_require__(18);

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(1);
var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signLog = exports.signReloaded = exports.signReload = exports.signChange = exports.SIGN_CONNECT = exports.SIGN_LOG = exports.SIGN_RELOADED = exports.SIGN_RELOAD = exports.SIGN_CHANGE = void 0;
exports.SIGN_CHANGE = "SIGN_CHANGE";
exports.SIGN_RELOAD = "SIGN_RELOAD";
exports.SIGN_RELOADED = "SIGN_RELOADED";
exports.SIGN_LOG = "SIGN_LOG";
exports.SIGN_CONNECT = "SIGN_CONNECT";

exports.signChange = function (_ref) {
  var _ref$reloadPage = _ref.reloadPage,
      reloadPage = _ref$reloadPage === void 0 ? true : _ref$reloadPage;
  return {
    type: exports.SIGN_CHANGE,
    payload: {
      reloadPage: reloadPage
    }
  };
};

exports.signReload = function () {
  return {
    type: exports.SIGN_RELOAD
  };
};

exports.signReloaded = function (msg) {
  return {
    type: exports.SIGN_RELOADED,
    payload: msg
  };
};

exports.signLog = function (msg) {
  return {
    type: exports.SIGN_LOG,
    payload: msg
  };
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8__;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

//
// Remark: Requiring this file will use the "safe" colors API,
// which will not touch String.prototype.
//
//   var colors = require('colors/safe');
//   colors.red("foo")
//
//
var colors = __webpack_require__(37);
module['exports'] = colors;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.browserVerWrongFormatMsg = exports.onlyOnDevelopmentMsg = void 0;

var Message_1 = __webpack_require__(11);

var log_constants_1 = __webpack_require__(3);

exports.onlyOnDevelopmentMsg = new Message_1["default"](log_constants_1.WARN, 1, "Warning, Chrome Extension Reloader Plugin was not enabled! It runs only on webpack --mode=development (v4 or more) or with NODE_ENV=development (lower versions)");
exports.browserVerWrongFormatMsg = new Message_1["default"](log_constants_1.WARN, 2, "Warning, Chrome browser with unexpected version format. Expected x.x.x.x, Provided <%= version %>");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var log_constants_1 = __webpack_require__(3);

var reference_docs_constants_1 = __webpack_require__(52);

var safe_1 = __webpack_require__(9);

var lodash_1 = __webpack_require__(2);

var Message = /*#__PURE__*/function () {
  function Message(type, referenceNumber, message) {
    _classCallCheck(this, Message);

    this.type = type;
    this.referenceNumber = referenceNumber;
    this.message = message;
  }

  _createClass(Message, [{
    key: "getPrefix",
    value: function getPrefix() {
      switch (this.type) {
        case log_constants_1.INFO:
          return "I";

        case log_constants_1.WARN:
          return "W";

        case log_constants_1.ERROR:
          return "E";
      }
    }
  }, {
    key: "get",
    value: function get() {
      var additionalData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var code = "WCER-".concat(this.getPrefix()).concat(this.referenceNumber);
      var refLink = safe_1.bold(safe_1.white("".concat(reference_docs_constants_1.REF_URL, "#").concat(code)));
      return "[".concat(code, "] ").concat(lodash_1.template(this.message, additionalData), ".\nVisit ").concat(refLink, " for complete details\n");
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.get();
    }
  }]);

  return Message;
}();

exports["default"] = Message;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_BACKGROUND_ENTRY = exports.DEFAULT_CONTENT_SCRIPT_ENTRY = exports.DEFAULT_RELOAD_PAGE = exports.DEFAULT_CONFIG = exports.DEFAULT_PORT = void 0;
exports.DEFAULT_PORT = 9090;
exports.DEFAULT_CONFIG = "webpack.config.js";
exports.DEFAULT_RELOAD_PAGE = true;
exports.DEFAULT_CONTENT_SCRIPT_ENTRY = "content-script";
exports.DEFAULT_BACKGROUND_ENTRY = "background";

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__14__;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var SourceMapConsumer = __webpack_require__(17).SourceMapConsumer;
var path = __webpack_require__(13);

var fs;
try {
  fs = __webpack_require__(24);
  if (!fs.existsSync || !fs.readFileSync) {
    // fs doesn't have all methods we need
    fs = null;
  }
} catch (err) {
  /* nop */
}

var bufferFrom = __webpack_require__(25);

/**
 * Requires a module which is protected against bundler minification.
 *
 * @param {NodeModule} mod
 * @param {string} request
 */
function dynamicRequire(mod, request) {
  return mod.require(request);
}

// Only install once if called multiple times
var errorFormatterInstalled = false;
var uncaughtShimInstalled = false;

// If true, the caches are reset before a stack trace formatting operation
var emptyCacheBetweenOperations = false;

// Supports {browser, node, auto}
var environment = "auto";

// Maps a file path to a string containing the file contents
var fileContentsCache = {};

// Maps a file path to a source map for that file
var sourceMapCache = {};

// Regex for detecting source maps
var reSourceMap = /^data:application\/json[^,]+base64,/;

// Priority list of retrieve handlers
var retrieveFileHandlers = [];
var retrieveMapHandlers = [];

function isInBrowser() {
  if (environment === "browser")
    return true;
  if (environment === "node")
    return false;
  return ((typeof window !== 'undefined') && (typeof XMLHttpRequest === 'function') && !(window.require && window.module && window.process && window.process.type === "renderer"));
}

function hasGlobalProcessEventEmitter() {
  return ((typeof process === 'object') && (process !== null) && (typeof process.on === 'function'));
}

function handlerExec(list) {
  return function(arg) {
    for (var i = 0; i < list.length; i++) {
      var ret = list[i](arg);
      if (ret) {
        return ret;
      }
    }
    return null;
  };
}

var retrieveFile = handlerExec(retrieveFileHandlers);

retrieveFileHandlers.push(function(path) {
  // Trim the path to make sure there is no extra whitespace.
  path = path.trim();
  if (/^file:/.test(path)) {
    // existsSync/readFileSync can't handle file protocol, but once stripped, it works
    path = path.replace(/file:\/\/\/(\w:)?/, function(protocol, drive) {
      return drive ?
        '' : // file:///C:/dir/file -> C:/dir/file
        '/'; // file:///root-dir/file -> /root-dir/file
    });
  }
  if (path in fileContentsCache) {
    return fileContentsCache[path];
  }

  var contents = '';
  try {
    if (!fs) {
      // Use SJAX if we are in the browser
      var xhr = new XMLHttpRequest();
      xhr.open('GET', path, /** async */ false);
      xhr.send(null);
      if (xhr.readyState === 4 && xhr.status === 200) {
        contents = xhr.responseText;
      }
    } else if (fs.existsSync(path)) {
      // Otherwise, use the filesystem
      contents = fs.readFileSync(path, 'utf8');
    }
  } catch (er) {
    /* ignore any errors */
  }

  return fileContentsCache[path] = contents;
});

// Support URLs relative to a directory, but be careful about a protocol prefix
// in case we are in the browser (i.e. directories may start with "http://" or "file:///")
function supportRelativeURL(file, url) {
  if (!file) return url;
  var dir = path.dirname(file);
  var match = /^\w+:\/\/[^\/]*/.exec(dir);
  var protocol = match ? match[0] : '';
  var startPath = dir.slice(protocol.length);
  if (protocol && /^\/\w\:/.test(startPath)) {
    // handle file:///C:/ paths
    protocol += '/';
    return protocol + path.resolve(dir.slice(protocol.length), url).replace(/\\/g, '/');
  }
  return protocol + path.resolve(dir.slice(protocol.length), url);
}

function retrieveSourceMapURL(source) {
  var fileData;

  if (isInBrowser()) {
     try {
       var xhr = new XMLHttpRequest();
       xhr.open('GET', source, false);
       xhr.send(null);
       fileData = xhr.readyState === 4 ? xhr.responseText : null;

       // Support providing a sourceMappingURL via the SourceMap header
       var sourceMapHeader = xhr.getResponseHeader("SourceMap") ||
                             xhr.getResponseHeader("X-SourceMap");
       if (sourceMapHeader) {
         return sourceMapHeader;
       }
     } catch (e) {
     }
  }

  // Get the URL of the source map
  fileData = retrieveFile(source);
  var re = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/mg;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  var lastMatch, match;
  while (match = re.exec(fileData)) lastMatch = match;
  if (!lastMatch) return null;
  return lastMatch[1];
};

// Can be overridden by the retrieveSourceMap option to install. Takes a
// generated source filename; returns a {map, optional url} object, or null if
// there is no source map.  The map field may be either a string or the parsed
// JSON object (ie, it must be a valid argument to the SourceMapConsumer
// constructor).
var retrieveSourceMap = handlerExec(retrieveMapHandlers);
retrieveMapHandlers.push(function(source) {
  var sourceMappingURL = retrieveSourceMapURL(source);
  if (!sourceMappingURL) return null;

  // Read the contents of the source map
  var sourceMapData;
  if (reSourceMap.test(sourceMappingURL)) {
    // Support source map URL as a data url
    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
    sourceMapData = bufferFrom(rawData, "base64").toString();
    sourceMappingURL = source;
  } else {
    // Support source map URLs relative to the source URL
    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
    sourceMapData = retrieveFile(sourceMappingURL);
  }

  if (!sourceMapData) {
    return null;
  }

  return {
    url: sourceMappingURL,
    map: sourceMapData
  };
});

function mapSourcePosition(position) {
  var sourceMap = sourceMapCache[position.source];
  if (!sourceMap) {
    // Call the (overrideable) retrieveSourceMap function to get the source map.
    var urlAndMap = retrieveSourceMap(position.source);
    if (urlAndMap) {
      sourceMap = sourceMapCache[position.source] = {
        url: urlAndMap.url,
        map: new SourceMapConsumer(urlAndMap.map)
      };

      // Load all sources stored inline with the source map into the file cache
      // to pretend like they are already loaded. They may not exist on disk.
      if (sourceMap.map.sourcesContent) {
        sourceMap.map.sources.forEach(function(source, i) {
          var contents = sourceMap.map.sourcesContent[i];
          if (contents) {
            var url = supportRelativeURL(sourceMap.url, source);
            fileContentsCache[url] = contents;
          }
        });
      }
    } else {
      sourceMap = sourceMapCache[position.source] = {
        url: null,
        map: null
      };
    }
  }

  // Resolve the source URL relative to the URL of the source map
  if (sourceMap && sourceMap.map && typeof sourceMap.map.originalPositionFor === 'function') {
    var originalPosition = sourceMap.map.originalPositionFor(position);

    // Only return the original position if a matching line was found. If no
    // matching line is found then we return position instead, which will cause
    // the stack trace to print the path and line for the compiled file. It is
    // better to give a precise location in the compiled file than a vague
    // location in the original file.
    if (originalPosition.source !== null) {
      originalPosition.source = supportRelativeURL(
        sourceMap.url, originalPosition.source);
      return originalPosition;
    }
  }

  return position;
}

// Parses code generated by FormatEvalOrigin(), a function inside V8:
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
function mapEvalOrigin(origin) {
  // Most eval() calls are in this format
  var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
  if (match) {
    var position = mapSourcePosition({
      source: match[2],
      line: +match[3],
      column: match[4] - 1
    });
    return 'eval at ' + match[1] + ' (' + position.source + ':' +
      position.line + ':' + (position.column + 1) + ')';
  }

  // Parse nested eval() calls using recursion
  match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
  if (match) {
    return 'eval at ' + match[1] + ' (' + mapEvalOrigin(match[2]) + ')';
  }

  // Make sure we still return useful information if we didn't find anything
  return origin;
}

// This is copied almost verbatim from the V8 source code at
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js. The
// implementation of wrapCallSite() used to just forward to the actual source
// code of CallSite.prototype.toString but unfortunately a new release of V8
// did something to the prototype chain and broke the shim. The only fix I
// could find was copy/paste.
function CallSiteToString() {
  var fileName;
  var fileLocation = "";
  if (this.isNative()) {
    fileLocation = "native";
  } else {
    fileName = this.getScriptNameOrSourceURL();
    if (!fileName && this.isEval()) {
      fileLocation = this.getEvalOrigin();
      fileLocation += ", ";  // Expecting source position to follow.
    }

    if (fileName) {
      fileLocation += fileName;
    } else {
      // Source code does not originate from a file and is not native, but we
      // can still get the source position inside the source string, e.g. in
      // an eval string.
      fileLocation += "<anonymous>";
    }
    var lineNumber = this.getLineNumber();
    if (lineNumber != null) {
      fileLocation += ":" + lineNumber;
      var columnNumber = this.getColumnNumber();
      if (columnNumber) {
        fileLocation += ":" + columnNumber;
      }
    }
  }

  var line = "";
  var functionName = this.getFunctionName();
  var addSuffix = true;
  var isConstructor = this.isConstructor();
  var isMethodCall = !(this.isToplevel() || isConstructor);
  if (isMethodCall) {
    var typeName = this.getTypeName();
    // Fixes shim to be backward compatable with Node v0 to v4
    if (typeName === "[object Object]") {
      typeName = "null";
    }
    var methodName = this.getMethodName();
    if (functionName) {
      if (typeName && functionName.indexOf(typeName) != 0) {
        line += typeName + ".";
      }
      line += functionName;
      if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
        line += " [as " + methodName + "]";
      }
    } else {
      line += typeName + "." + (methodName || "<anonymous>");
    }
  } else if (isConstructor) {
    line += "new " + (functionName || "<anonymous>");
  } else if (functionName) {
    line += functionName;
  } else {
    line += fileLocation;
    addSuffix = false;
  }
  if (addSuffix) {
    line += " (" + fileLocation + ")";
  }
  return line;
}

function cloneCallSite(frame) {
  var object = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
    object[name] = /^(?:is|get)/.test(name) ? function() { return frame[name].call(frame); } : frame[name];
  });
  object.toString = CallSiteToString;
  return object;
}

function wrapCallSite(frame, state) {
  // provides interface backward compatibility
  if (state === undefined) {
    state = { nextPosition: null, curPosition: null }
  }
  if(frame.isNative()) {
    state.curPosition = null;
    return frame;
  }

  // Most call sites will return the source file from getFileName(), but code
  // passed to eval() ending in "//# sourceURL=..." will return the source file
  // from getScriptNameOrSourceURL() instead
  var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
  if (source) {
    var line = frame.getLineNumber();
    var column = frame.getColumnNumber() - 1;

    // Fix position in Node where some (internal) code is prepended.
    // See https://github.com/evanw/node-source-map-support/issues/36
    // Header removed in node at ^10.16 || >=11.11.0
    // v11 is not an LTS candidate, we can just test the one version with it.
    // Test node versions for: 10.16-19, 10.20+, 12-19, 20-99, 100+, or 11.11
    var noHeader = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/;
    var headerLength = noHeader.test(process.version) ? 0 : 62;
    if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
      column -= headerLength;
    }

    var position = mapSourcePosition({
      source: source,
      line: line,
      column: column
    });
    state.curPosition = position;
    frame = cloneCallSite(frame);
    var originalFunctionName = frame.getFunctionName;
    frame.getFunctionName = function() {
      if (state.nextPosition == null) {
        return originalFunctionName();
      }
      return state.nextPosition.name || originalFunctionName();
    };
    frame.getFileName = function() { return position.source; };
    frame.getLineNumber = function() { return position.line; };
    frame.getColumnNumber = function() { return position.column + 1; };
    frame.getScriptNameOrSourceURL = function() { return position.source; };
    return frame;
  }

  // Code called using eval() needs special handling
  var origin = frame.isEval() && frame.getEvalOrigin();
  if (origin) {
    origin = mapEvalOrigin(origin);
    frame = cloneCallSite(frame);
    frame.getEvalOrigin = function() { return origin; };
    return frame;
  }

  // If we get here then we were unable to change the source position
  return frame;
}

// This function is part of the V8 stack trace API, for more info see:
// https://v8.dev/docs/stack-trace-api
function prepareStackTrace(error, stack) {
  if (emptyCacheBetweenOperations) {
    fileContentsCache = {};
    sourceMapCache = {};
  }

  var name = error.name || 'Error';
  var message = error.message || '';
  var errorString = name + ": " + message;

  var state = { nextPosition: null, curPosition: null };
  var processedStack = [];
  for (var i = stack.length - 1; i >= 0; i--) {
    processedStack.push('\n    at ' + wrapCallSite(stack[i], state));
    state.nextPosition = state.curPosition;
  }
  state.curPosition = state.nextPosition = null;
  return errorString + processedStack.reverse().join('');
}

// Generate position and snippet of original source with pointer
function getErrorSource(error) {
  var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
  if (match) {
    var source = match[1];
    var line = +match[2];
    var column = +match[3];

    // Support the inline sourceContents inside the source map
    var contents = fileContentsCache[source];

    // Support files on disk
    if (!contents && fs && fs.existsSync(source)) {
      try {
        contents = fs.readFileSync(source, 'utf8');
      } catch (er) {
        contents = '';
      }
    }

    // Format the line from the original source code like node does
    if (contents) {
      var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
      if (code) {
        return source + ':' + line + '\n' + code + '\n' +
          new Array(column).join(' ') + '^';
      }
    }
  }
  return null;
}

function printErrorAndExit (error) {
  var source = getErrorSource(error);

  // Ensure error is printed synchronously and not truncated
  if (process.stderr._handle && process.stderr._handle.setBlocking) {
    process.stderr._handle.setBlocking(true);
  }

  if (source) {
    console.error();
    console.error(source);
  }

  console.error(error.stack);
  process.exit(1);
}

function shimEmitUncaughtException () {
  var origEmit = process.emit;

  process.emit = function (type) {
    if (type === 'uncaughtException') {
      var hasStack = (arguments[1] && arguments[1].stack);
      var hasListeners = (this.listeners(type).length > 0);

      if (hasStack && !hasListeners) {
        return printErrorAndExit(arguments[1]);
      }
    }

    return origEmit.apply(this, arguments);
  };
}

var originalRetrieveFileHandlers = retrieveFileHandlers.slice(0);
var originalRetrieveMapHandlers = retrieveMapHandlers.slice(0);

exports.wrapCallSite = wrapCallSite;
exports.getErrorSource = getErrorSource;
exports.mapSourcePosition = mapSourcePosition;
exports.retrieveSourceMap = retrieveSourceMap;

exports.install = function(options) {
  options = options || {};

  if (options.environment) {
    environment = options.environment;
    if (["node", "browser", "auto"].indexOf(environment) === -1) {
      throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}")
    }
  }

  // Allow sources to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveFile) {
    if (options.overrideRetrieveFile) {
      retrieveFileHandlers.length = 0;
    }

    retrieveFileHandlers.unshift(options.retrieveFile);
  }

  // Allow source maps to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveSourceMap) {
    if (options.overrideRetrieveSourceMap) {
      retrieveMapHandlers.length = 0;
    }

    retrieveMapHandlers.unshift(options.retrieveSourceMap);
  }

  // Support runtime transpilers that include inline source maps
  if (options.hookRequire && !isInBrowser()) {
    // Use dynamicRequire to avoid including in browser bundles
    var Module = dynamicRequire(module, 'module');
    var $compile = Module.prototype._compile;

    if (!$compile.__sourceMapSupport) {
      Module.prototype._compile = function(content, filename) {
        fileContentsCache[filename] = content;
        sourceMapCache[filename] = undefined;
        return $compile.call(this, content, filename);
      };

      Module.prototype._compile.__sourceMapSupport = true;
    }
  }

  // Configure options
  if (!emptyCacheBetweenOperations) {
    emptyCacheBetweenOperations = 'emptyCacheBetweenOperations' in options ?
      options.emptyCacheBetweenOperations : false;
  }

  // Install the error reformatter
  if (!errorFormatterInstalled) {
    errorFormatterInstalled = true;
    Error.prepareStackTrace = prepareStackTrace;
  }

  if (!uncaughtShimInstalled) {
    var installHandler = 'handleUncaughtExceptions' in options ?
      options.handleUncaughtExceptions : true;

    // Do not override 'uncaughtException' with our own handler in Node.js
    // Worker threads. Workers pass the error to the main thread as an event,
    // rather than printing something to stderr and exiting.
    try {
      // We need to use `dynamicRequire` because `require` on it's own will be optimized by WebPack/Browserify.
      var worker_threads = dynamicRequire(module, 'worker_threads');
      if (worker_threads.isMainThread === false) {
        installHandler = false;
      }
    } catch(e) {}

    // Provide the option to not install the uncaught exception handler. This is
    // to support other uncaught exception handlers (in test frameworks, for
    // example). If this handler is not installed and there are no other uncaught
    // exception handlers, uncaught exceptions will be caught by node's built-in
    // exception handler and the process will still be terminated. However, the
    // generated JavaScript code will be shown above the stack trace instead of
    // the original source code.
    if (installHandler && hasGlobalProcessEventEmitter()) {
      uncaughtShimInstalled = true;
      shimEmitUncaughtException();
    }
  }
};

exports.resetRetrieveHandlers = function() {
  retrieveFileHandlers.length = 0;
  retrieveMapHandlers.length = 0;

  retrieveFileHandlers = originalRetrieveFileHandlers.slice(0);
  retrieveMapHandlers = originalRetrieveMapHandlers.slice(0);

  retrieveSourceMap = handlerExec(retrieveMapHandlers);
  retrieveFile = handlerExec(retrieveFileHandlers);
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(16)(module)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = __webpack_require__(4).SourceMapGenerator;
exports.SourceMapConsumer = __webpack_require__(20).SourceMapConsumer;
exports.SourceNode = __webpack_require__(23).SourceNode;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(1);

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(1);
var binarySearch = __webpack_require__(21);
var ArraySet = __webpack_require__(6).ArraySet;
var base64VLQ = __webpack_require__(5);
var quickSort = __webpack_require__(22).quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = __webpack_require__(4).SourceMapGenerator;
var util = __webpack_require__(1);

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || '';
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || '';
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

var toString = Object.prototype.toString

var isModern = (
  typeof Buffer.alloc === 'function' &&
  typeof Buffer.allocUnsafe === 'function' &&
  typeof Buffer.from === 'function'
)

function isArrayBuffer (input) {
  return toString.call(input).slice(8, -1) === 'ArrayBuffer'
}

function fromArrayBuffer (obj, byteOffset, length) {
  byteOffset >>>= 0

  var maxLength = obj.byteLength - byteOffset

  if (maxLength < 0) {
    throw new RangeError("'offset' is out of bounds")
  }

  if (length === undefined) {
    length = maxLength
  } else {
    length >>>= 0

    if (length > maxLength) {
      throw new RangeError("'length' is out of bounds")
    }
  }

  return isModern
    ? Buffer.from(obj.slice(byteOffset, byteOffset + length))
    : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)))
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  return isModern
    ? Buffer.from(string, encoding)
    : new Buffer(string, encoding)
}

function bufferFrom (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return isModern
    ? Buffer.from(value)
    : new Buffer(value)
}

module.exports = bufferFrom


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lodash_1 = __webpack_require__(2);

var AbstractChromeExtensionReloader_1 = __webpack_require__(27);

var middleware_1 = __webpack_require__(28);

var hot_reload_1 = __webpack_require__(34);

var default_options_1 = __webpack_require__(53);

var CompilerEventsFacade_1 = __webpack_require__(54);

var warnings_1 = __webpack_require__(10);

var errors_1 = __webpack_require__(55);

var logger_1 = __webpack_require__(0);

var webpack_1 = __webpack_require__(14);

var ChromeExtensionReloaderImpl = /*#__PURE__*/function (_AbstractChromeExtens) {
  _inherits(ChromeExtensionReloaderImpl, _AbstractChromeExtens);

  var _super = _createSuper(ChromeExtensionReloaderImpl);

  function ChromeExtensionReloaderImpl(options) {
    var _this;

    _classCallCheck(this, ChromeExtensionReloaderImpl);

    _this = _super.call(this);
    _this._opts = options;
    _this._chunkVersions = {};
    return _this;
  }

  _createClass(ChromeExtensionReloaderImpl, [{
    key: "_isWebpackGToEV4",
    value: function _isWebpackGToEV4() {
      if (webpack_1.version) {
        var _webpack_1$version$sp = webpack_1.version.split("."),
            _webpack_1$version$sp2 = _slicedToArray(_webpack_1$version$sp, 1),
            major = _webpack_1$version$sp2[0];

        if (parseInt(major) >= 4) return true;
      }

      return false;
    }
  }, {
    key: "_contentOrBgChanged",
    value: function _contentOrBgChanged(chunks, _ref) {
      var _this2 = this;

      var background = _ref.background,
          contentScript = _ref.contentScript;
      return chunks.filter(function (_ref2) {
        var name = _ref2.name,
            hash = _ref2.hash;
        var oldVersion = _this2._chunkVersions[name];
        _this2._chunkVersions[name] = hash;
        return hash !== oldVersion;
      }).some(function (_ref3) {
        var name = _ref3.name;
        return name === background || name === contentScript;
      });
    }
  }, {
    key: "_registerPlugin",
    value: function _registerPlugin(compiler) {
      var _this3 = this;

      var _lodash_1$merge = lodash_1.merge(default_options_1["default"], this._opts),
          reloadPage = _lodash_1$merge.reloadPage,
          port = _lodash_1$merge.port,
          entries = _lodash_1$merge.entries;

      this._eventAPI = new CompilerEventsFacade_1["default"](compiler);
      this._injector = middleware_1.middlewareInjector(entries, {
        port: port,
        reloadPage: reloadPage
      });
      this._triggerer = hot_reload_1.changesTriggerer(port, reloadPage);

      this._eventAPI.afterOptimizeChunkAssets(function (comp, chunks) {
        if (!compiler.options.entry || !compiler.options.entry["background"]) {
          throw new TypeError(errors_1.bgScriptRequiredMsg.get());
        }

        comp.assets = Object.assign(Object.assign({}, comp.assets), _this3._injector(comp.assets, chunks));
      });

      this._eventAPI.afterEmit(function (comp, done) {
        if (_this3._contentOrBgChanged(comp.chunks, entries)) {
          _this3._triggerer().then(done)["catch"](done);
        }
      });
    }
  }, {
    key: "apply",
    value: function apply(compiler) {
      if ((this._isWebpackGToEV4() ? compiler.options.mode : process.env.NODE_ENV) === "development") {
        this._registerPlugin(compiler);
      } else {
        logger_1.warn(warnings_1.onlyOnDevelopmentMsg.get());
      }
    }
  }]);

  return ChromeExtensionReloaderImpl;
}(AbstractChromeExtensionReloader_1["default"]);

exports["default"] = ChromeExtensionReloaderImpl;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AbstractChromeExtensionReloader = function AbstractChromeExtensionReloader() {
  _classCallCheck(this, AbstractChromeExtensionReloader);
};

exports["default"] = AbstractChromeExtensionReloader;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.middlewareInjector = void 0;

var middleware_injector_1 = __webpack_require__(29);

exports.middlewareInjector = middleware_injector_1["default"];

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var webpack_sources_1 = __webpack_require__(30);

var middleware_source_builder_1 = __webpack_require__(31);

function middlewareInjector(_ref, _ref2) {
  var background = _ref.background,
      contentScript = _ref.contentScript;
  var port = _ref2.port,
      reloadPage = _ref2.reloadPage;
  var source = middleware_source_builder_1["default"]({
    port: port,
    reloadPage: reloadPage
  });

  var sourceFactory = function sourceFactory() {
    for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
      sources[_key] = arguments[_key];
    }

    return _construct(webpack_sources_1.ConcatSource, sources);
  };

  return function (assets, chunks) {
    return chunks.reduce(function (prev, _ref3) {
      var name = _ref3.name,
          files = _ref3.files;

      if (name === background || name === contentScript || contentScript.includes(name)) {
        files.forEach(function (entryPoint) {
          if (/\.js$/.test(entryPoint)) {
            prev[entryPoint] = sourceFactory(source, assets[entryPoint]);
          }
        });
      }

      return prev;
    }, {});
  };
}

exports["default"] = middlewareInjector;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__30__;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var lodash_1 = __webpack_require__(2);

var midleware_config_constants_1 = __webpack_require__(32);

var signals = __webpack_require__(7);

var wcer_middleware_raw_1 = __webpack_require__(33);

function middleWareSourceBuilder(_ref) {
  var port = _ref.port,
      reloadPage = _ref.reloadPage;
  var tmpl = lodash_1.template(wcer_middleware_raw_1["default"]);
  return tmpl({
    WSHost: "ws://localhost:".concat(port),
    reloadPage: "".concat(reloadPage),
    signals: JSON.stringify(signals),
    config: JSON.stringify({
      RECONNECT_INTERVAL: midleware_config_constants_1.RECONNECT_INTERVAL,
      SOCKET_ERR_CODE_REF: midleware_config_constants_1.SOCKET_ERR_CODE_REF
    })
  });
}

exports["default"] = middleWareSourceBuilder;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SOCKET_ERR_CODE_REF = exports.RECONNECT_INTERVAL = void 0;
exports.RECONNECT_INTERVAL = 2000;
exports.SOCKET_ERR_CODE_REF = "https://tools.ietf.org/html/rfc6455#section-7.4.1";

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("/* -------------------------------------------------- */\n\n/*  Start of Webpack Chrome Hot Extension Middleware  */\n\n/* ================================================== */\n\n/*  This will be converted into a lodash templ., any  */\n\n/*  external argument must be provided using it       */\n\n/* -------------------------------------------------- */\n(function (chrome, window) {\n  var signals = JSON.parse('<%= signals %>');\n  var config = JSON.parse('<%= config %>');\n  var reloadPage = \"<%= reloadPage %>\" === \"true\";\n  var wsHost = \"<%= WSHost %>\";\n  var SIGN_CHANGE = signals.SIGN_CHANGE,\n      SIGN_RELOAD = signals.SIGN_RELOAD,\n      SIGN_RELOADED = signals.SIGN_RELOADED,\n      SIGN_LOG = signals.SIGN_LOG,\n      SIGN_CONNECT = signals.SIGN_CONNECT;\n  var RECONNECT_INTERVAL = config.RECONNECT_INTERVAL,\n      SOCKET_ERR_CODE_REF = config.SOCKET_ERR_CODE_REF;\n  var runtime = chrome.runtime,\n      tabs = chrome.tabs;\n  var manifest = runtime.getManifest(); // =============================== Helper functions ======================================= //\n\n  var formatter = function formatter(msg) {\n    return \"[ WCER: \".concat(msg, \" ]\");\n  };\n\n  var logger = function logger(msg) {\n    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : \"info\";\n    return console[level](formatter(msg));\n  };\n\n  var timeFormatter = function timeFormatter(date) {\n    return date.toTimeString().replace(/.*(\\d{2}:\\d{2}:\\d{2}).*/, \"$1\");\n  }; // ========================== Called only on content scripts ============================== //\n\n\n  function contentScriptWorker() {\n    runtime.sendMessage({\n      type: SIGN_CONNECT\n    }, function (msg) {\n      return console.info(msg);\n    });\n    runtime.onMessage.addListener(function (_ref) {\n      var type = _ref.type,\n          payload = _ref.payload;\n\n      switch (type) {\n        case SIGN_RELOAD:\n          logger(\"Detected Changes. Reloading ...\");\n          reloadPage && window.location.reload();\n          break;\n\n        case SIGN_LOG:\n          console.info(payload);\n          break;\n      }\n    });\n  } // ======================== Called only on background scripts ============================= //\n\n\n  function backgroundWorker(socket) {\n    runtime.onMessage.addListener(function (action, sender, sendResponse) {\n      if (action.type === SIGN_CONNECT) {\n        sendResponse(formatter(\"Connected to Chrome Extension Hot Reloader\"));\n      }\n    });\n    socket.addEventListener(\"message\", function (_ref2) {\n      var data = _ref2.data;\n\n      var _JSON$parse = JSON.parse(data),\n          type = _JSON$parse.type,\n          payload = _JSON$parse.payload;\n\n      if (type === SIGN_CHANGE) {\n        tabs.query({\n          status: \"complete\"\n        }, function (loadedTabs) {\n          loadedTabs.forEach(function (tab) {\n            return tab.id && tabs.sendMessage(tab.id, {\n              type: SIGN_RELOAD\n            });\n          });\n          socket.send(JSON.stringify({\n            type: SIGN_RELOADED,\n            payload: formatter(\"\".concat(timeFormatter(new Date()), \" - \").concat(manifest.name, \" successfully reloaded\"))\n          }));\n          runtime.reload();\n        });\n      } else {\n        runtime.sendMessage({\n          type: type,\n          payload: payload\n        });\n      }\n    });\n    socket.addEventListener(\"close\", function (_ref3) {\n      var code = _ref3.code;\n      logger(\"Socket connection closed. Code \".concat(code, \". See more in \").concat(SOCKET_ERR_CODE_REF), \"warn\");\n      var intId = setInterval(function () {\n        logger(\"Attempting to reconnect (tip: Check if Webpack is running)\");\n        var ws = new WebSocket(wsHost);\n        ws.addEventListener(\"open\", function () {\n          clearInterval(intId);\n          logger(\"Reconnected. Reloading plugin\");\n          runtime.reload();\n        });\n      }, RECONNECT_INTERVAL);\n    });\n  } // ======================= Bootstraps the middleware =========================== //\n\n  /* @ts-ignore */\n\n\n  runtime.reload ? backgroundWorker(new WebSocket(wsHost)) : contentScriptWorker();\n})(chrome, window);\n/* ----------------------------------------------- */\n\n/* End of Webpack Chrome Hot Extension Middleware  */\n\n/* ----------------------------------------------- */");

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changesTriggerer = void 0;

var changes_triggerer_1 = __webpack_require__(35);

exports.changesTriggerer = changes_triggerer_1["default"];

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var HotReloaderServer_1 = __webpack_require__(36);

var logger_1 = __webpack_require__(0);

exports["default"] = function (port, reloadPage) {
  var server = new HotReloaderServer_1["default"](port);
  logger_1.info("[ Starting the Chrome Hot Plugin Reload Server... ]");
  server.listen();
  return function () {
    return server.signChange(reloadPage);
  };
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ws_1 = __webpack_require__(8);

var logger_1 = __webpack_require__(0);

var SignEmitter_1 = __webpack_require__(49);

var HotReloaderServer = /*#__PURE__*/function () {
  function HotReloaderServer(port) {
    _classCallCheck(this, HotReloaderServer);

    this._server = new ws_1.Server({
      port: port
    });
  }

  _createClass(HotReloaderServer, [{
    key: "listen",
    value: function listen() {
      var _this = this;

      this._server.on("connection", function (ws, msg) {
        var browserVersion = _this._getBrowserVersion(msg.headers["user-agent"]);

        _this._signEmiter = new SignEmitter_1["default"](_this._server, browserVersion);
        ws.on("message", function (data) {
          return logger_1.info("Message from the client: ".concat(JSON.parse(data).payload));
        });
        ws.on("error", function () {// NOOP - swallow socket errors due to http://git.io/vbhSN
        });
      });
    }
  }, {
    key: "signChange",
    value: function signChange(reloadPage) {
      if (this._signEmiter) {
        return this._signEmiter.safeSignChange(reloadPage);
      } else return Promise.resolve(null);
    }
  }, {
    key: "_getBrowserVersion",
    value: function _getBrowserVersion(userAgent) {
      var ver = userAgent.match(/\ Chrom(e|ium)\/([0-9\.]*)\ /);

      if (ver && ver.length === 3) {
        return ver[2];
      }

      return false;
    }
  }]);

  return HotReloaderServer;
}();

exports["default"] = HotReloaderServer;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/*

The MIT License (MIT)

Original Library
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var colors = {};
module['exports'] = colors;

colors.themes = {};

var util = __webpack_require__(38);
var ansiStyles = colors.styles = __webpack_require__(39);
var defineProps = Object.defineProperties;
var newLineRegex = new RegExp(/[\r\n]+/g);

colors.supportsColor = __webpack_require__(40).supportsColor;

if (typeof colors.enabled === 'undefined') {
  colors.enabled = colors.supportsColor() !== false;
}

colors.enable = function() {
  colors.enabled = true;
};

colors.disable = function() {
  colors.enabled = false;
};

colors.stripColors = colors.strip = function(str) {
  return ('' + str).replace(/\x1B\[\d+m/g, '');
};

// eslint-disable-next-line no-unused-vars
var stylize = colors.stylize = function stylize(str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  var styleMap = ansiStyles[style];

  // Stylize should work for non-ANSI styles, too
  if(!styleMap && style in colors){
    // Style maps like trap operate as functions on strings;
    // they don't have properties like open or close.
    return colors[style](str);
  }

  return styleMap.open + str + styleMap.close;
};

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe, '\\$&');
};

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles = (function() {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function(key) {
    ansiStyles[key].closeRe =
      new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function() {
        return build(this._styles.concat(key));
      },
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = Array.prototype.slice.call(arguments);

  var str = args.map(function(arg) {
    // Use weak equality check so we can colorize null/undefined in safe mode
    if (arg != null && arg.constructor === String) {
      return arg;
    } else {
      return util.inspect(arg);
    }
  }).join(' ');

  if (!colors.enabled || !str) {
    return str;
  }

  var newLinesPresent = str.indexOf('\n') != -1;

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
    if (newLinesPresent) {
      str = str.replace(newLineRegex, function(match) {
        return code.close + match + code.open;
      });
    }
  }

  return str;
}

colors.setTheme = function(theme) {
  if (typeof theme === 'string') {
    console.log('colors.setTheme now only accepts an object, not a string.  ' +
      'If you are trying to set a theme from a file, it is now your (the ' +
      'caller\'s) responsibility to require the file.  The old syntax ' +
      'looked like colors.setTheme(__dirname + ' +
      '\'/../themes/generic-logging.js\'); The new syntax looks like '+
      'colors.setTheme(require(__dirname + ' +
      '\'/../themes/generic-logging.js\'));');
    return;
  }
  for (var style in theme) {
    (function(style) {
      colors[style] = function(str) {
        if (typeof theme[style] === 'object') {
          var out = str;
          for (var i in theme[style]) {
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function(name) {
    ret[name] = {
      get: function() {
        return build([name]);
      },
    };
  });
  return ret;
}

var sequencer = function sequencer(map, str) {
  var exploded = str.split('');
  exploded = exploded.map(map);
  return exploded.join('');
};

// custom formatter methods
colors.trap = __webpack_require__(43);
colors.zalgo = __webpack_require__(44);

// maps
colors.maps = {};
colors.maps.america = __webpack_require__(45)(colors);
colors.maps.zebra = __webpack_require__(46)(colors);
colors.maps.rainbow = __webpack_require__(47)(colors);
colors.maps.random = __webpack_require__(48)(colors);

for (var map in colors.maps) {
  (function(map) {
    colors[map] = function(str) {
      return sequencer(colors.maps[map], str);
    };
  })(map);
}

defineProps(colors, init());


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  brightRed: [91, 39],
  brightGreen: [92, 39],
  brightYellow: [93, 39],
  brightBlue: [94, 39],
  brightMagenta: [95, 39],
  brightCyan: [96, 39],
  brightWhite: [97, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],

  bgBrightRed: [101, 49],
  bgBrightGreen: [102, 49],
  bgBrightYellow: [103, 49],
  bgBrightBlue: [104, 49],
  bgBrightMagenta: [105, 49],
  bgBrightCyan: [106, 49],
  bgBrightWhite: [107, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49],

};

Object.keys(codes).forEach(function(key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/



var os = __webpack_require__(41);
var hasFlag = __webpack_require__(42);

var env = process.env;

var forceColor = void 0;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
  forceColor = false;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true')
           || hasFlag('color=always')) {
  forceColor = true;
}
if ('FORCE_COLOR' in env) {
  forceColor = env.FORCE_COLOR.length === 0
    || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
  if (level === 0) {
    return false;
  }

  return {
    level: level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
}

function supportsColor(stream) {
  if (forceColor === false) {
    return 0;
  }

  if (hasFlag('color=16m') || hasFlag('color=full')
      || hasFlag('color=truecolor')) {
    return 3;
  }

  if (hasFlag('color=256')) {
    return 2;
  }

  if (stream && !stream.isTTY && forceColor !== true) {
    return 0;
  }

  var min = forceColor ? 1 : 0;

  if (process.platform === 'win32') {
    // Node.js 7.5.0 is the first version of Node.js to include a patch to
    // libuv that enables 256 color output on Windows. Anything earlier and it
    // won't work. However, here we target Node.js 8 at minimum as it is an LTS
    // release, and Node.js 7 is not. Windows 10 build 10586 is the first
    // Windows release that supports 256 colors. Windows 10 build 14931 is the
    // first release that supports 16m/TrueColor.
    var osRelease = os.release().split('.');
    if (Number(process.versions.node.split('.')[0]) >= 8
        && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }

    return 1;
  }

  if ('CI' in env) {
    if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(function(sign) {
      return sign in env;
    }) || env.CI_NAME === 'codeship') {
      return 1;
    }

    return min;
  }

  if ('TEAMCITY_VERSION' in env) {
    return (/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0
    );
  }

  if ('TERM_PROGRAM' in env) {
    var version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app':
        return version >= 3 ? 3 : 2;
      case 'Hyper':
        return 3;
      case 'Apple_Terminal':
        return 2;
      // No default
    }
  }

  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }

  if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }

  if ('COLORTERM' in env) {
    return 1;
  }

  if (env.TERM === 'dumb') {
    return min;
  }

  return min;
}

function getSupportLevel(stream) {
  var level = supportsColor(stream);
  return translateLevel(level);
}

module.exports = {
  supportsColor: getSupportLevel,
  stdout: getSupportLevel(process.stdout),
  stderr: getSupportLevel(process.stderr),
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/



module.exports = function(flag, argv) {
  argv = argv || process.argv;

  var terminatorPos = argv.indexOf('--');
  var prefix = /^-{1,2}/.test(flag) ? '' : '--';
  var pos = argv.indexOf(prefix + flag);

  return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

module['exports'] = function runTheTrap(text, options) {
  var result = '';
  text = text || 'Run the trap, drop the bass';
  text = text.split('');
  var trap = {
    a: ['\u0040', '\u0104', '\u023a', '\u0245', '\u0394', '\u039b', '\u0414'],
    b: ['\u00df', '\u0181', '\u0243', '\u026e', '\u03b2', '\u0e3f'],
    c: ['\u00a9', '\u023b', '\u03fe'],
    d: ['\u00d0', '\u018a', '\u0500', '\u0501', '\u0502', '\u0503'],
    e: ['\u00cb', '\u0115', '\u018e', '\u0258', '\u03a3', '\u03be', '\u04bc',
      '\u0a6c'],
    f: ['\u04fa'],
    g: ['\u0262'],
    h: ['\u0126', '\u0195', '\u04a2', '\u04ba', '\u04c7', '\u050a'],
    i: ['\u0f0f'],
    j: ['\u0134'],
    k: ['\u0138', '\u04a0', '\u04c3', '\u051e'],
    l: ['\u0139'],
    m: ['\u028d', '\u04cd', '\u04ce', '\u0520', '\u0521', '\u0d69'],
    n: ['\u00d1', '\u014b', '\u019d', '\u0376', '\u03a0', '\u048a'],
    o: ['\u00d8', '\u00f5', '\u00f8', '\u01fe', '\u0298', '\u047a', '\u05dd',
      '\u06dd', '\u0e4f'],
    p: ['\u01f7', '\u048e'],
    q: ['\u09cd'],
    r: ['\u00ae', '\u01a6', '\u0210', '\u024c', '\u0280', '\u042f'],
    s: ['\u00a7', '\u03de', '\u03df', '\u03e8'],
    t: ['\u0141', '\u0166', '\u0373'],
    u: ['\u01b1', '\u054d'],
    v: ['\u05d8'],
    w: ['\u0428', '\u0460', '\u047c', '\u0d70'],
    x: ['\u04b2', '\u04fe', '\u04fc', '\u04fd'],
    y: ['\u00a5', '\u04b0', '\u04cb'],
    z: ['\u01b5', '\u0240'],
  };
  text.forEach(function(c) {
    c = c.toLowerCase();
    var chars = trap[c] || [' '];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== 'undefined') {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

// please no
module['exports'] = function zalgo(text, options) {
  text = text || '   he is here   ';
  var soul = {
    'up': [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚',
    ],
    'down': [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣',
    ],
    'mid': [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉',
    ],
  };
  var all = [].concat(soul.up, soul.down, soul.mid);

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function isChar(character) {
    var bool = false;
    all.filter(function(i) {
      bool = (i === character);
    });
    return bool;
  }


  function heComes(text, options) {
    var result = '';
    var counts;
    var l;
    options = options || {};
    options['up'] =
      typeof options['up'] !== 'undefined' ? options['up'] : true;
    options['mid'] =
      typeof options['mid'] !== 'undefined' ? options['mid'] : true;
    options['down'] =
      typeof options['down'] !== 'undefined' ? options['down'] : true;
    options['size'] =
      typeof options['size'] !== 'undefined' ? options['size'] : 'maxi';
    text = text.split('');
    for (l in text) {
      if (isChar(l)) {
        continue;
      }
      result = result + text[l];
      counts = {'up': 0, 'down': 0, 'mid': 0};
      switch (options.size) {
        case 'mini':
          counts.up = randomNumber(8);
          counts.mid = randomNumber(2);
          counts.down = randomNumber(8);
          break;
        case 'maxi':
          counts.up = randomNumber(16) + 3;
          counts.mid = randomNumber(4) + 1;
          counts.down = randomNumber(64) + 3;
          break;
        default:
          counts.up = randomNumber(8) + 1;
          counts.mid = randomNumber(6) / 2;
          counts.down = randomNumber(8) + 1;
          break;
      }

      var arr = ['up', 'mid', 'down'];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
};



/***/ }),
/* 45 */
/***/ (function(module, exports) {

module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    if (letter === ' ') return letter;
    switch (i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter);
      case 2: return colors.blue(letter);
    }
  };
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    return i % 2 === 0 ? letter : colors.inverse(letter);
  };
};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

module['exports'] = function(colors) {
  // RoY G BiV
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta'];
  return function(letter, i, exploded) {
    if (letter === ' ') {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
};



/***/ }),
/* 48 */
/***/ (function(module, exports) {

module['exports'] = function(colors) {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green',
    'blue', 'white', 'cyan', 'magenta', 'brightYellow', 'brightRed',
    'brightGreen', 'brightBlue', 'brightWhite', 'brightCyan', 'brightMagenta'];
  return function(letter, i, exploded) {
    return letter === ' ' ? letter :
      colors[
          available[Math.round(Math.random() * (available.length - 2))]
      ](letter);
  };
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ws_1 = __webpack_require__(8);

var lodash_1 = __webpack_require__(2);

var fast_reloading_constants_1 = __webpack_require__(50);

var signals_1 = __webpack_require__(7);

var block_protection_1 = __webpack_require__(51);

var logger_1 = __webpack_require__(0);

var warnings_1 = __webpack_require__(10);

var SignEmitter = /*#__PURE__*/function () {
  function SignEmitter(server) {
    var browserVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0.0.0.0";

    _classCallCheck(this, SignEmitter);

    this._server = server;

    var _ref = this._satisfies(browserVersion, fast_reloading_constants_1.NEW_FAST_RELOAD_CHROME_VERSION) ? [fast_reloading_constants_1.NEW_FAST_RELOAD_CALLS, fast_reloading_constants_1.NEW_FAST_RELOAD_DEBOUNCING_FRAME] : [fast_reloading_constants_1.FAST_RELOAD_CALLS, fast_reloading_constants_1.FAST_RELOAD_DEBOUNCING_FRAME],
        _ref2 = _slicedToArray(_ref, 2),
        reloadCalls = _ref2[0],
        reloadDeboucingFrame = _ref2[1];

    var debouncer = block_protection_1.debounceSignal(reloadDeboucingFrame, this);
    var blocker = block_protection_1.fastReloadBlocker(reloadCalls, fast_reloading_constants_1.FAST_RELOAD_WAIT, this);
    this._safeSignChange = debouncer(blocker(this._setupSafeSignChange()));
  }

  _createClass(SignEmitter, [{
    key: "safeSignChange",
    value: function safeSignChange(reloadPage) {
      var _this = this;

      return new Promise(function (res, rej) {
        _this._safeSignChange(reloadPage, res, rej);
      });
    }
  }, {
    key: "_setupSafeSignChange",
    value: function _setupSafeSignChange() {
      var _this2 = this;

      return function (reloadPage, onSuccess, onError) {
        try {
          _this2._sendMsg(signals_1.signChange({
            reloadPage: reloadPage
          }));

          onSuccess();
        } catch (err) {
          onError(err);
        }
      };
    }
  }, {
    key: "_sendMsg",
    value: function _sendMsg(msg) {
      this._server.clients.forEach(function (client) {
        if (client.readyState === ws_1.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
    }
  }, {
    key: "_satisfies",
    value: function _satisfies(browserVersion, targetVersion) {
      if (!/\d+\.\d+\.\d+\.\d+/.test(browserVersion)) {
        logger_1.warn(warnings_1.browserVerWrongFormatMsg.get({
          version: browserVersion
        }));
        return false;
      }

      var versionPairs = lodash_1.zip(browserVersion.split(".").map(function (n) {
        return parseInt(n);
      }), targetVersion.split(".").map(function (n) {
        return parseInt(n);
      }));

      var _iterator = _createForOfIteratorHelper(versionPairs),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              _step$value$ = _step$value[0],
              version = _step$value$ === void 0 ? 0 : _step$value$,
              _step$value$2 = _step$value[1],
              target = _step$value$2 === void 0 ? 0 : _step$value$2;

          if (version !== target) return version > target;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return true;
    }
  }]);

  return SignEmitter;
}();

exports["default"] = SignEmitter;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NEW_FAST_RELOAD_CALLS = exports.NEW_FAST_RELOAD_DEBOUNCING_FRAME = exports.NEW_FAST_RELOAD_CHROME_VERSION = exports.FAST_RELOAD_WAIT = exports.FAST_RELOAD_CALLS = exports.FAST_RELOAD_DEBOUNCING_FRAME = void 0;
/**
 * Chrome lets only a max number of calls in a time frame
 * before block the plugin for be reloading itself to much
 * @see https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader/issues/2
 */

exports.FAST_RELOAD_DEBOUNCING_FRAME = 2000;
exports.FAST_RELOAD_CALLS = 6;
exports.FAST_RELOAD_WAIT = 10 * 1000; // ======================================================================================================================== //

/**
 * A new reloading rate was createad after opening a bug ticket on
 * Chromium, and the revision was merged to master
 * @see https://chromium-review.googlesource.com/c/chromium/src/+/1340272
 */

/**
 * The Chrome/Chromium version number that includes the new rates
 * @see https://storage.googleapis.com/chromium-find-releases-static/d3b.html#d3b25e1380984b2f1f23d0e8dc1a337743c6caaf
 */

exports.NEW_FAST_RELOAD_CHROME_VERSION = "73.0.3637.0";
exports.NEW_FAST_RELOAD_DEBOUNCING_FRAME = 1000;
exports.NEW_FAST_RELOAD_CALLS = 30;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fastReloadBlocker = exports.debounceSignal = void 0;

var lodash_1 = __webpack_require__(2);

var logger_1 = __webpack_require__(0);

exports.debounceSignal = function (deboucingFrame, context) {
  return function (func) {
    if (context) {
      lodash_1.runInContext(context);
    }

    return lodash_1.debounce(function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return func.apply(context, args);
    }, deboucingFrame);
  };
};

exports.fastReloadBlocker = function (maxCalls, wait, context) {
  return function (func) {
    var calls = 0;
    var inWait = false;
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (inWait) {
        return;
      } else if (calls === maxCalls) {
        calls = 0;
        inWait = true;
        var interval = wait / 1000;
        logger_1.warn("Please wait ".concat(interval, " secs. for next reload to prevent your extension being blocked"));
        var logInterval = setInterval(function () {
          return logger_1.warn("".concat(--interval, " ..."));
        }, 1000);
        setTimeout(function () {
          clearInterval(logInterval);
          logger_1.info("Signing for reload now");
          func.apply(context, args);
          inWait = false;
        }, wait);
      } else {
        calls++;
        return func.apply(context, args);
      }
    };
  };
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REF_URL = void 0;
exports.REF_URL = "https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader/wiki/General-Information";

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var options_constants_1 = __webpack_require__(12);

exports["default"] = {
  reloadPage: options_constants_1.DEFAULT_RELOAD_PAGE,
  port: options_constants_1.DEFAULT_PORT,
  entries: {
    contentScript: options_constants_1.DEFAULT_CONTENT_SCRIPT_ENTRY,
    background: options_constants_1.DEFAULT_BACKGROUND_ENTRY
  }
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CompilerEventsFacade = /*#__PURE__*/function () {
  function CompilerEventsFacade(compiler) {
    _classCallCheck(this, CompilerEventsFacade);

    this._compiler = compiler;
    this._legacyTapable = !compiler.hooks;
  }

  _createClass(CompilerEventsFacade, [{
    key: "afterOptimizeChunkAssets",
    value: function afterOptimizeChunkAssets(call) {
      return this._legacyTapable ? this._compiler.plugin("compilation", function (comp) {
        return comp.plugin("after-optimize-chunk-assets", function (chunks) {
          return call(comp, chunks);
        });
      }) : this._compiler.hooks.compilation.tap(CompilerEventsFacade.extensionName, function (comp) {
        return comp.hooks.afterOptimizeChunkAssets.tap(CompilerEventsFacade.extensionName, function (chunks) {
          return call(comp, chunks);
        });
      });
    }
  }, {
    key: "afterEmit",
    value: function afterEmit(call) {
      return this._legacyTapable ? this._compiler.plugin("after-emit", call) : this._compiler.hooks.afterEmit.tap(CompilerEventsFacade.extensionName, call);
    }
  }]);

  return CompilerEventsFacade;
}();

exports["default"] = CompilerEventsFacade;
CompilerEventsFacade.extensionName = "chrome-extension-reloader";

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bgScriptRequiredMsg = void 0;

var Message_1 = __webpack_require__(11);

var log_constants_1 = __webpack_require__(3);

exports.bgScriptRequiredMsg = new Message_1["default"](log_constants_1.ERROR, 1, "Background script entry is required");

/***/ }),
/* 56 */,
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var source_map_support_1 = __webpack_require__(15);

var ChromeExtensionReloader_1 = __webpack_require__(26);

var log_constants_1 = __webpack_require__(3);

var logger_1 = __webpack_require__(0);

source_map_support_1.install();
var logLevel = process.env.NODE_ENV ? {
  production: log_constants_1.ERROR,
  development: log_constants_1.DEBUG,
  test: log_constants_1.NONE
}[process.env.NODE_ENV] : log_constants_1.ERROR;
logger_1.setLogLevel(logLevel);
module.exports = ChromeExtensionReloader_1["default"];

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvbG9nZ2VyLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwLXN1cHBvcnQvbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3V0aWwuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibG9kYXNoXCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy9sb2cuY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwLXN1cHBvcnQvbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3NvdXJjZS1tYXAtZ2VuZXJhdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwLXN1cHBvcnQvbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2Jhc2U2NC12bHEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAtc3VwcG9ydC9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvYXJyYXktc2V0LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9zaWduYWxzLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcIndzXCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvbG9ycy9zYWZlLmpzIiwid2VicGFjazovLy8uL3NyYy9tZXNzYWdlcy93YXJuaW5ncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZXMvTWVzc2FnZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzL29wdGlvbnMuY29uc3RhbnRzLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ3ZWJwYWNrXCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAtc3VwcG9ydC9zb3VyY2UtbWFwLXN1cHBvcnQuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc291cmNlLW1hcC1zdXBwb3J0L25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL3NvdXJjZS1tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAtc3VwcG9ydC9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwLXN1cHBvcnQvbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL21hcHBpbmctbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc291cmNlLW1hcC1zdXBwb3J0L25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9zb3VyY2UtbWFwLWNvbnN1bWVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwLXN1cHBvcnQvbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2JpbmFyeS1zZWFyY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAtc3VwcG9ydC9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc291cmNlLW1hcC1zdXBwb3J0L25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9zb3VyY2Utbm9kZS5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9idWZmZXItZnJvbS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2hyb21lRXh0ZW5zaW9uUmVsb2FkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dlYnBhY2svQWJzdHJhY3RDaHJvbWVFeHRlbnNpb25SZWxvYWRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZS9taWRkbGV3YXJlLWluamVjdG9yLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcIndlYnBhY2stc291cmNlc1wiIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlL21pZGRsZXdhcmUtc291cmNlLWJ1aWxkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy9taWRsZXdhcmUtY29uZmlnLmNvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZS93Y2VyLW1pZGRsZXdhcmUucmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9ob3QtcmVsb2FkL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9ob3QtcmVsb2FkL2NoYW5nZXMtdHJpZ2dlcmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9ob3QtcmVsb2FkL0hvdFJlbG9hZGVyU2VydmVyLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb2xvcnMvbGliL2NvbG9ycy5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvbG9ycy9saWIvc3R5bGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb2xvcnMvbGliL3N5c3RlbS9zdXBwb3J0cy1jb2xvcnMuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwib3NcIiIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29sb3JzL2xpYi9zeXN0ZW0vaGFzLWZsYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvbG9ycy9saWIvY3VzdG9tL3RyYXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvbG9ycy9saWIvY3VzdG9tL3phbGdvLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb2xvcnMvbGliL21hcHMvYW1lcmljYS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29sb3JzL2xpYi9tYXBzL3plYnJhLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb2xvcnMvbGliL21hcHMvcmFpbmJvdy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29sb3JzL2xpYi9tYXBzL3JhbmRvbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaG90LXJlbG9hZC9TaWduRW1pdHRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzL2Zhc3QtcmVsb2FkaW5nLmNvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvYmxvY2stcHJvdGVjdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzL3JlZmVyZW5jZS1kb2NzLmNvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZGVmYXVsdC1vcHRpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy93ZWJwYWNrL0NvbXBpbGVyRXZlbnRzRmFjYWRlLnRzIiwid2VicGFjazovLy8uL3NyYy9tZXNzYWdlcy9lcnJvcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztRQ1ZBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBOztBQUNBOztBQUVBLElBQUksUUFBSjs7QUFDYSxzQkFBYyxVQUFDLEtBQUQ7QUFBQSxTQUF1QixRQUFRLEdBQUcsS0FBbEM7QUFBQSxDQUFkOztBQUVBLGNBQU0sVUFBQyxPQUFEO0FBQUEsU0FBcUIsUUFBUSxJQUFJLG1CQUFaLElBQW1CLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWixDQUF4QztBQUFBLENBQU47O0FBQ0EsZUFBTyxVQUFDLE9BQUQ7QUFBQSxTQUNsQixRQUFRLElBQUksb0JBQVosSUFBb0IsT0FBTyxDQUFDLElBQVIsQ0FBYSxhQUFNLE9BQU4sQ0FBYixDQURGO0FBQUEsQ0FBUDs7QUFFQSxlQUFPLFVBQUMsT0FBRDtBQUFBLFNBQ2xCLFFBQVEsSUFBSSxvQkFBWixJQUFvQixPQUFPLENBQUMsSUFBUixDQUFhLGNBQU8sT0FBUCxDQUFiLENBREY7QUFBQSxDQUFQOztBQUVBLGdCQUFRLFVBQUMsT0FBRDtBQUFBLFNBQ25CLFFBQVEsSUFBSSxxQkFBWixJQUFxQixPQUFPLENBQUMsS0FBUixDQUFjLFdBQUksT0FBSixDQUFkLENBREY7QUFBQSxDQUFSOztBQUVBLGdCQUFRLFVBQUMsT0FBRDtBQUFBLFNBQ25CLFFBQVEsSUFBSSxxQkFBWixJQUFxQixPQUFPLENBQUMsS0FBUixDQUFjLGFBQU0sY0FBTSxPQUFOLENBQU4sQ0FBZCxDQURGO0FBQUEsQ0FBUixDOzs7Ozs7QUNiYixnQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLFFBQVE7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZlQSxnRDs7Ozs7Ozs7Ozs7OztBQ0FhLGVBQWlCLENBQWpCO0FBQ0EsY0FBZSxDQUFmO0FBQ0EsZUFBaUIsQ0FBakI7QUFDQSxlQUFpQixDQUFqQjtBQUNBLGdCQUFtQixDQUFuQjtBQUNBLGdCQUFtQixDQUFuQixDOzs7Ozs7QUNMYixnQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsQ0FBYztBQUN0QyxXQUFXLG1CQUFPLENBQUMsQ0FBUTtBQUMzQixlQUFlLG1CQUFPLENBQUMsQ0FBYTtBQUNwQyxrQkFBa0IsbUJBQU8sQ0FBQyxFQUFnQjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hhQSxnQkFBZ0Is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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLFlBQVksa0JBQWtCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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OztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXOztBQUVYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxrQ0FBa0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0RBQXNELFlBQVk7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixjQUFjO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsd0NBQXdDO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLG1CQUFtQixFQUFFO0FBQ3BFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixNQUFNO0FBQ25DO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyQkFBMkI7QUFDOUMscUJBQXFCLCtDQUErQztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkJBQTJCO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDJCQUEyQjtBQUM5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQSxxQkFBcUIsNEJBQTRCO0FBQ2pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxRQUFRO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxTQUFTO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsV0FBVztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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OztBQUVyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLEdBQUc7QUFDdkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0SkEsK0I7Ozs7Ozs7QUNBQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixJQUFJO0FBQ3ZCOztBQUVBO0FBQ0E7Ozs7Ozs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOzs7Ozs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsb0JBQW9CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVkE7O0FBQ0E7O0FBRUE7O0FBUUE7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QUFBLE9BRk4sQ0FOSjtBQWNEOzs7V0FFRCxtQkFBVSxJQUFWLEVBQXdCO0FBQ3RCLGFBQU8sS0FBSyxjQUFMLEdBQ0gsS0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixZQUF0QixFQUFvQyxJQUFwQyxDQURHLEdBRUgsS0FBSyxTQUFMLENBQWUsS0FBZixDQUFxQixTQUFyQixDQUErQixHQUEvQixDQUNFLG9CQUFvQixDQUFDLGFBRHZCLEVBRUUsSUFGRixDQUZKO0FBTUQ7Ozs7OztBQWxDSDtBQUNTLHFDQUFnQiwyQkFBaEIsQzs7Ozs7Ozs7Ozs7Ozs7QUNEVDs7QUFDQTs7QUFFYSw4QkFBc0IsSUFBSSxvQkFBSixDQUNqQyxxQkFEaUMsRUFFakMsQ0FGaUMsRUFHakMscUNBSGlDLENBQXRCLEM7Ozs7Ozs7Ozs7QUNIYjs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTtBQUVBLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixHQUNiO0FBQ0UsWUFBVSxFQUFFLHFCQURkO0FBRUUsYUFBVyxFQUFFLHFCQUZmO0FBR0UsTUFBSSxFQUFFO0FBSFIsRUFJRSxPQUFPLENBQUMsR0FBUixDQUFZLFFBSmQsQ0FEYSxHQU1iLHFCQU5KO0FBUUEscUJBQVksUUFBWjtBQUNBLGlCQUFTLG9DQUFULEMiLCJmaWxlIjoid2VicGFjay1jaHJvbWUtZXh0ZW5zaW9uLXJlbG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwibG9kYXNoXCIpLCByZXF1aXJlKFwid3NcIiksIHJlcXVpcmUoXCJ3ZWJwYWNrXCIpLCByZXF1aXJlKFwid2VicGFjay1zb3VyY2VzXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImxvZGFzaFwiLCBcIndzXCIsIFwid2VicGFja1wiLCBcIndlYnBhY2stc291cmNlc1wiXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZmFjdG9yeShyZXF1aXJlKFwibG9kYXNoXCIpLCByZXF1aXJlKFwid3NcIiksIHJlcXVpcmUoXCJ3ZWJwYWNrXCIpLCByZXF1aXJlKFwid2VicGFjay1zb3VyY2VzXCIpKSA6IGZhY3Rvcnkocm9vdFtcImxvZGFzaFwiXSwgcm9vdFtcIndzXCJdLCByb290W1wid2VicGFja1wiXSwgcm9vdFtcIndlYnBhY2stc291cmNlc1wiXSk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfXzJfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fOF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18xNF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18zMF9fKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1Nyk7XG4iLCJpbXBvcnQgeyBERUJVRywgRVJST1IsIElORk8sIExPRywgV0FSTiB9IGZyb20gXCIuLi9jb25zdGFudHMvbG9nLmNvbnN0YW50c1wiO1xuaW1wb3J0IHsgZ3JlZW4sIHJlZCwgd2hpdGUsIHllbGxvdyB9IGZyb20gXCJjb2xvcnMvc2FmZVwiO1xuXG5sZXQgbG9nTGV2ZWw7XG5leHBvcnQgY29uc3Qgc2V0TG9nTGV2ZWwgPSAobGV2ZWw6IExPR19MRVZFTCkgPT4gKGxvZ0xldmVsID0gbGV2ZWwpO1xuXG5leHBvcnQgY29uc3QgbG9nID0gKG1lc3NhZ2U6IHN0cmluZykgPT4gbG9nTGV2ZWwgPj0gTE9HICYmIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuZXhwb3J0IGNvbnN0IGluZm8gPSAobWVzc2FnZTogc3RyaW5nKSA9PlxuICBsb2dMZXZlbCA+PSBJTkZPICYmIGNvbnNvbGUuaW5mbyhncmVlbihtZXNzYWdlKSk7XG5leHBvcnQgY29uc3Qgd2FybiA9IChtZXNzYWdlOiBzdHJpbmcpID0+XG4gIGxvZ0xldmVsID49IFdBUk4gJiYgY29uc29sZS53YXJuKHllbGxvdyhtZXNzYWdlKSk7XG5leHBvcnQgY29uc3QgZXJyb3IgPSAobWVzc2FnZTogc3RyaW5nKSA9PlxuICBsb2dMZXZlbCA+PSBFUlJPUiAmJiBjb25zb2xlLmVycm9yKHJlZChtZXNzYWdlKSk7XG5leHBvcnQgY29uc3QgZGVidWcgPSAobWVzc2FnZTogc3RyaW5nKSA9PlxuICBsb2dMZXZlbCA+PSBERUJVRyAmJiBjb25zb2xlLmRlYnVnKHdoaXRlKGRlYnVnKG1lc3NhZ2UpKSk7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbi8qKlxuICogVGhpcyBpcyBhIGhlbHBlciBmdW5jdGlvbiBmb3IgZ2V0dGluZyB2YWx1ZXMgZnJvbSBwYXJhbWV0ZXIvb3B0aW9uc1xuICogb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gYXJncyBUaGUgb2JqZWN0IHdlIGFyZSBleHRyYWN0aW5nIHZhbHVlcyBmcm9tXG4gKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgd2UgYXJlIGdldHRpbmcuXG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlIEFuIG9wdGlvbmFsIHZhbHVlIHRvIHJldHVybiBpZiB0aGUgcHJvcGVydHkgaXMgbWlzc2luZ1xuICogZnJvbSB0aGUgb2JqZWN0LiBJZiB0aGlzIGlzIG5vdCBzcGVjaWZpZWQgYW5kIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nLCBhblxuICogZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKi9cbmZ1bmN0aW9uIGdldEFyZyhhQXJncywgYU5hbWUsIGFEZWZhdWx0VmFsdWUpIHtcbiAgaWYgKGFOYW1lIGluIGFBcmdzKSB7XG4gICAgcmV0dXJuIGFBcmdzW2FOYW1lXTtcbiAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgcmV0dXJuIGFEZWZhdWx0VmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhTmFtZSArICdcIiBpcyBhIHJlcXVpcmVkIGFyZ3VtZW50LicpO1xuICB9XG59XG5leHBvcnRzLmdldEFyZyA9IGdldEFyZztcblxudmFyIHVybFJlZ2V4cCA9IC9eKD86KFtcXHcrXFwtLl0rKTopP1xcL1xcLyg/OihcXHcrOlxcdyspQCk/KFtcXHcuLV0qKSg/OjooXFxkKykpPyguKikkLztcbnZhciBkYXRhVXJsUmVnZXhwID0gL15kYXRhOi4rXFwsLiskLztcblxuZnVuY3Rpb24gdXJsUGFyc2UoYVVybCkge1xuICB2YXIgbWF0Y2ggPSBhVXJsLm1hdGNoKHVybFJlZ2V4cCk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHNjaGVtZTogbWF0Y2hbMV0sXG4gICAgYXV0aDogbWF0Y2hbMl0sXG4gICAgaG9zdDogbWF0Y2hbM10sXG4gICAgcG9ydDogbWF0Y2hbNF0sXG4gICAgcGF0aDogbWF0Y2hbNV1cbiAgfTtcbn1cbmV4cG9ydHMudXJsUGFyc2UgPSB1cmxQYXJzZTtcblxuZnVuY3Rpb24gdXJsR2VuZXJhdGUoYVBhcnNlZFVybCkge1xuICB2YXIgdXJsID0gJyc7XG4gIGlmIChhUGFyc2VkVXJsLnNjaGVtZSkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLnNjaGVtZSArICc6JztcbiAgfVxuICB1cmwgKz0gJy8vJztcbiAgaWYgKGFQYXJzZWRVcmwuYXV0aCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLmF1dGggKyAnQCc7XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwuaG9zdCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLmhvc3Q7XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwucG9ydCkge1xuICAgIHVybCArPSBcIjpcIiArIGFQYXJzZWRVcmwucG9ydFxuICB9XG4gIGlmIChhUGFyc2VkVXJsLnBhdGgpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5wYXRoO1xuICB9XG4gIHJldHVybiB1cmw7XG59XG5leHBvcnRzLnVybEdlbmVyYXRlID0gdXJsR2VuZXJhdGU7XG5cbi8qKlxuICogTm9ybWFsaXplcyBhIHBhdGgsIG9yIHRoZSBwYXRoIHBvcnRpb24gb2YgYSBVUkw6XG4gKlxuICogLSBSZXBsYWNlcyBjb25zZWN1dGl2ZSBzbGFzaGVzIHdpdGggb25lIHNsYXNoLlxuICogLSBSZW1vdmVzIHVubmVjZXNzYXJ5ICcuJyBwYXJ0cy5cbiAqIC0gUmVtb3ZlcyB1bm5lY2Vzc2FyeSAnPGRpcj4vLi4nIHBhcnRzLlxuICpcbiAqIEJhc2VkIG9uIGNvZGUgaW4gdGhlIE5vZGUuanMgJ3BhdGgnIGNvcmUgbW9kdWxlLlxuICpcbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciB1cmwgdG8gbm9ybWFsaXplLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemUoYVBhdGgpIHtcbiAgdmFyIHBhdGggPSBhUGF0aDtcbiAgdmFyIHVybCA9IHVybFBhcnNlKGFQYXRoKTtcbiAgaWYgKHVybCkge1xuICAgIGlmICghdXJsLnBhdGgpIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG4gICAgcGF0aCA9IHVybC5wYXRoO1xuICB9XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpO1xuXG4gIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoL1xcLysvKTtcbiAgZm9yICh2YXIgcGFydCwgdXAgPSAwLCBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBwYXJ0ID0gcGFydHNbaV07XG4gICAgaWYgKHBhcnQgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAocGFydCA9PT0gJy4uJykge1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwID4gMCkge1xuICAgICAgaWYgKHBhcnQgPT09ICcnKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBwYXJ0IGlzIGJsYW5rIGlmIHRoZSBwYXRoIGlzIGFic29sdXRlLiBUcnlpbmcgdG8gZ29cbiAgICAgICAgLy8gYWJvdmUgdGhlIHJvb3QgaXMgYSBuby1vcC4gVGhlcmVmb3JlIHdlIGNhbiByZW1vdmUgYWxsICcuLicgcGFydHNcbiAgICAgICAgLy8gZGlyZWN0bHkgYWZ0ZXIgdGhlIHJvb3QuXG4gICAgICAgIHBhcnRzLnNwbGljZShpICsgMSwgdXApO1xuICAgICAgICB1cCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMik7XG4gICAgICAgIHVwLS07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHBhdGggPSBwYXJ0cy5qb2luKCcvJyk7XG5cbiAgaWYgKHBhdGggPT09ICcnKSB7XG4gICAgcGF0aCA9IGlzQWJzb2x1dGUgPyAnLycgOiAnLic7XG4gIH1cblxuICBpZiAodXJsKSB7XG4gICAgdXJsLnBhdGggPSBwYXRoO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZSh1cmwpO1xuICB9XG4gIHJldHVybiBwYXRoO1xufVxuZXhwb3J0cy5ub3JtYWxpemUgPSBub3JtYWxpemU7XG5cbi8qKlxuICogSm9pbnMgdHdvIHBhdGhzL1VSTHMuXG4gKlxuICogQHBhcmFtIGFSb290IFRoZSByb290IHBhdGggb3IgVVJMLlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIFVSTCB0byBiZSBqb2luZWQgd2l0aCB0aGUgcm9vdC5cbiAqXG4gKiAtIElmIGFQYXRoIGlzIGEgVVJMIG9yIGEgZGF0YSBVUkksIGFQYXRoIGlzIHJldHVybmVkLCB1bmxlc3MgYVBhdGggaXMgYVxuICogICBzY2hlbWUtcmVsYXRpdmUgVVJMOiBUaGVuIHRoZSBzY2hlbWUgb2YgYVJvb3QsIGlmIGFueSwgaXMgcHJlcGVuZGVkXG4gKiAgIGZpcnN0LlxuICogLSBPdGhlcndpc2UgYVBhdGggaXMgYSBwYXRoLiBJZiBhUm9vdCBpcyBhIFVSTCwgdGhlbiBpdHMgcGF0aCBwb3J0aW9uXG4gKiAgIGlzIHVwZGF0ZWQgd2l0aCB0aGUgcmVzdWx0IGFuZCBhUm9vdCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlIHRoZSByZXN1bHRcbiAqICAgaXMgcmV0dXJuZWQuXG4gKiAgIC0gSWYgYVBhdGggaXMgYWJzb2x1dGUsIHRoZSByZXN1bHQgaXMgYVBhdGguXG4gKiAgIC0gT3RoZXJ3aXNlIHRoZSB0d28gcGF0aHMgYXJlIGpvaW5lZCB3aXRoIGEgc2xhc2guXG4gKiAtIEpvaW5pbmcgZm9yIGV4YW1wbGUgJ2h0dHA6Ly8nIGFuZCAnd3d3LmV4YW1wbGUuY29tJyBpcyBhbHNvIHN1cHBvcnRlZC5cbiAqL1xuZnVuY3Rpb24gam9pbihhUm9vdCwgYVBhdGgpIHtcbiAgaWYgKGFSb290ID09PSBcIlwiKSB7XG4gICAgYVJvb3QgPSBcIi5cIjtcbiAgfVxuICBpZiAoYVBhdGggPT09IFwiXCIpIHtcbiAgICBhUGF0aCA9IFwiLlwiO1xuICB9XG4gIHZhciBhUGF0aFVybCA9IHVybFBhcnNlKGFQYXRoKTtcbiAgdmFyIGFSb290VXJsID0gdXJsUGFyc2UoYVJvb3QpO1xuICBpZiAoYVJvb3RVcmwpIHtcbiAgICBhUm9vdCA9IGFSb290VXJsLnBhdGggfHwgJy8nO1xuICB9XG5cbiAgLy8gYGpvaW4oZm9vLCAnLy93d3cuZXhhbXBsZS5vcmcnKWBcbiAgaWYgKGFQYXRoVXJsICYmICFhUGF0aFVybC5zY2hlbWUpIHtcbiAgICBpZiAoYVJvb3RVcmwpIHtcbiAgICAgIGFQYXRoVXJsLnNjaGVtZSA9IGFSb290VXJsLnNjaGVtZTtcbiAgICB9XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFQYXRoVXJsKTtcbiAgfVxuXG4gIGlmIChhUGF0aFVybCB8fCBhUGF0aC5tYXRjaChkYXRhVXJsUmVnZXhwKSkge1xuICAgIHJldHVybiBhUGF0aDtcbiAgfVxuXG4gIC8vIGBqb2luKCdodHRwOi8vJywgJ3d3dy5leGFtcGxlLmNvbScpYFxuICBpZiAoYVJvb3RVcmwgJiYgIWFSb290VXJsLmhvc3QgJiYgIWFSb290VXJsLnBhdGgpIHtcbiAgICBhUm9vdFVybC5ob3N0ID0gYVBhdGg7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFSb290VXJsKTtcbiAgfVxuXG4gIHZhciBqb2luZWQgPSBhUGF0aC5jaGFyQXQoMCkgPT09ICcvJ1xuICAgID8gYVBhdGhcbiAgICA6IG5vcm1hbGl6ZShhUm9vdC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIGFQYXRoKTtcblxuICBpZiAoYVJvb3RVcmwpIHtcbiAgICBhUm9vdFVybC5wYXRoID0gam9pbmVkO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUm9vdFVybCk7XG4gIH1cbiAgcmV0dXJuIGpvaW5lZDtcbn1cbmV4cG9ydHMuam9pbiA9IGpvaW47XG5cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uIChhUGF0aCkge1xuICByZXR1cm4gYVBhdGguY2hhckF0KDApID09PSAnLycgfHwgdXJsUmVnZXhwLnRlc3QoYVBhdGgpO1xufTtcblxuLyoqXG4gKiBNYWtlIGEgcGF0aCByZWxhdGl2ZSB0byBhIFVSTCBvciBhbm90aGVyIHBhdGguXG4gKlxuICogQHBhcmFtIGFSb290IFRoZSByb290IHBhdGggb3IgVVJMLlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIFVSTCB0byBiZSBtYWRlIHJlbGF0aXZlIHRvIGFSb290LlxuICovXG5mdW5jdGlvbiByZWxhdGl2ZShhUm9vdCwgYVBhdGgpIHtcbiAgaWYgKGFSb290ID09PSBcIlwiKSB7XG4gICAgYVJvb3QgPSBcIi5cIjtcbiAgfVxuXG4gIGFSb290ID0gYVJvb3QucmVwbGFjZSgvXFwvJC8sICcnKTtcblxuICAvLyBJdCBpcyBwb3NzaWJsZSBmb3IgdGhlIHBhdGggdG8gYmUgYWJvdmUgdGhlIHJvb3QuIEluIHRoaXMgY2FzZSwgc2ltcGx5XG4gIC8vIGNoZWNraW5nIHdoZXRoZXIgdGhlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlIHBhdGggd29uJ3Qgd29yay4gSW5zdGVhZCwgd2VcbiAgLy8gbmVlZCB0byByZW1vdmUgY29tcG9uZW50cyBmcm9tIHRoZSByb290IG9uZSBieSBvbmUsIHVudGlsIGVpdGhlciB3ZSBmaW5kXG4gIC8vIGEgcHJlZml4IHRoYXQgZml0cywgb3Igd2UgcnVuIG91dCBvZiBjb21wb25lbnRzIHRvIHJlbW92ZS5cbiAgdmFyIGxldmVsID0gMDtcbiAgd2hpbGUgKGFQYXRoLmluZGV4T2YoYVJvb3QgKyAnLycpICE9PSAwKSB7XG4gICAgdmFyIGluZGV4ID0gYVJvb3QubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgb25seSBwYXJ0IG9mIHRoZSByb290IHRoYXQgaXMgbGVmdCBpcyB0aGUgc2NoZW1lIChpLmUuIGh0dHA6Ly8sXG4gICAgLy8gZmlsZTovLy8sIGV0Yy4pLCBvbmUgb3IgbW9yZSBzbGFzaGVzICgvKSwgb3Igc2ltcGx5IG5vdGhpbmcgYXQgYWxsLCB3ZVxuICAgIC8vIGhhdmUgZXhoYXVzdGVkIGFsbCBjb21wb25lbnRzLCBzbyB0aGUgcGF0aCBpcyBub3QgcmVsYXRpdmUgdG8gdGhlIHJvb3QuXG4gICAgYVJvb3QgPSBhUm9vdC5zbGljZSgwLCBpbmRleCk7XG4gICAgaWYgKGFSb290Lm1hdGNoKC9eKFteXFwvXSs6XFwvKT9cXC8qJC8pKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuXG4gICAgKytsZXZlbDtcbiAgfVxuXG4gIC8vIE1ha2Ugc3VyZSB3ZSBhZGQgYSBcIi4uL1wiIGZvciBlYWNoIGNvbXBvbmVudCB3ZSByZW1vdmVkIGZyb20gdGhlIHJvb3QuXG4gIHJldHVybiBBcnJheShsZXZlbCArIDEpLmpvaW4oXCIuLi9cIikgKyBhUGF0aC5zdWJzdHIoYVJvb3QubGVuZ3RoICsgMSk7XG59XG5leHBvcnRzLnJlbGF0aXZlID0gcmVsYXRpdmU7XG5cbnZhciBzdXBwb3J0c051bGxQcm90byA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICByZXR1cm4gISgnX19wcm90b19fJyBpbiBvYmopO1xufSgpKTtcblxuZnVuY3Rpb24gaWRlbnRpdHkgKHMpIHtcbiAgcmV0dXJuIHM7XG59XG5cbi8qKlxuICogQmVjYXVzZSBiZWhhdmlvciBnb2VzIHdhY2t5IHdoZW4geW91IHNldCBgX19wcm90b19fYCBvbiBvYmplY3RzLCB3ZVxuICogaGF2ZSB0byBwcmVmaXggYWxsIHRoZSBzdHJpbmdzIGluIG91ciBzZXQgd2l0aCBhbiBhcmJpdHJhcnkgY2hhcmFjdGVyLlxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL3B1bGwvMzEgYW5kXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL2lzc3Vlcy8zMFxuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5mdW5jdGlvbiB0b1NldFN0cmluZyhhU3RyKSB7XG4gIGlmIChpc1Byb3RvU3RyaW5nKGFTdHIpKSB7XG4gICAgcmV0dXJuICckJyArIGFTdHI7XG4gIH1cblxuICByZXR1cm4gYVN0cjtcbn1cbmV4cG9ydHMudG9TZXRTdHJpbmcgPSBzdXBwb3J0c051bGxQcm90byA/IGlkZW50aXR5IDogdG9TZXRTdHJpbmc7XG5cbmZ1bmN0aW9uIGZyb21TZXRTdHJpbmcoYVN0cikge1xuICBpZiAoaXNQcm90b1N0cmluZyhhU3RyKSkge1xuICAgIHJldHVybiBhU3RyLnNsaWNlKDEpO1xuICB9XG5cbiAgcmV0dXJuIGFTdHI7XG59XG5leHBvcnRzLmZyb21TZXRTdHJpbmcgPSBzdXBwb3J0c051bGxQcm90byA/IGlkZW50aXR5IDogZnJvbVNldFN0cmluZztcblxuZnVuY3Rpb24gaXNQcm90b1N0cmluZyhzKSB7XG4gIGlmICghcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBzLmxlbmd0aDtcblxuICBpZiAobGVuZ3RoIDwgOSAvKiBcIl9fcHJvdG9fX1wiLmxlbmd0aCAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMSkgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSAyKSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDMpICE9PSAxMTEgLyogJ28nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNCkgIT09IDExNiAvKiAndCcgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA1KSAhPT0gMTExIC8qICdvJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDYpICE9PSAxMTQgLyogJ3InICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNykgIT09IDExMiAvKiAncCcgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA4KSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDkpICE9PSA5NSAgLyogJ18nICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IGxlbmd0aCAtIDEwOyBpID49IDA7IGktLSkge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgIT09IDM2IC8qICckJyAqLykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2hlcmUgdGhlIG9yaWdpbmFsIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKlxuICogT3B0aW9uYWxseSBwYXNzIGluIGB0cnVlYCBhcyBgb25seUNvbXBhcmVHZW5lcmF0ZWRgIHRvIGNvbnNpZGVyIHR3b1xuICogbWFwcGluZ3Mgd2l0aCB0aGUgc2FtZSBvcmlnaW5hbCBzb3VyY2UvbGluZS9jb2x1bW4sIGJ1dCBkaWZmZXJlbnQgZ2VuZXJhdGVkXG4gKiBsaW5lIGFuZCBjb2x1bW4gdGhlIHNhbWUuIFVzZWZ1bCB3aGVuIHNlYXJjaGluZyBmb3IgYSBtYXBwaW5nIHdpdGggYVxuICogc3R1YmJlZCBvdXQgbWFwcGluZy5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMobWFwcGluZ0EsIG1hcHBpbmdCLCBvbmx5Q29tcGFyZU9yaWdpbmFsKSB7XG4gIHZhciBjbXAgPSBzdHJjbXAobWFwcGluZ0Euc291cmNlLCBtYXBwaW5nQi5zb3VyY2UpO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwIHx8IG9ubHlDb21wYXJlT3JpZ2luYWwpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBzdHJjbXAobWFwcGluZ0EubmFtZSwgbWFwcGluZ0IubmFtZSk7XG59XG5leHBvcnRzLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zID0gY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnM7XG5cbi8qKlxuICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aXRoIGRlZmxhdGVkIHNvdXJjZSBhbmQgbmFtZSBpbmRpY2VzIHdoZXJlXG4gKiB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKlxuICogT3B0aW9uYWxseSBwYXNzIGluIGB0cnVlYCBhcyBgb25seUNvbXBhcmVHZW5lcmF0ZWRgIHRvIGNvbnNpZGVyIHR3b1xuICogbWFwcGluZ3Mgd2l0aCB0aGUgc2FtZSBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uLCBidXQgZGlmZmVyZW50XG4gKiBzb3VyY2UvbmFtZS9vcmlnaW5hbCBsaW5lIGFuZCBjb2x1bW4gdGhlIHNhbWUuIFVzZWZ1bCB3aGVuIHNlYXJjaGluZyBmb3IgYVxuICogbWFwcGluZyB3aXRoIGEgc3R1YmJlZCBvdXQgbWFwcGluZy5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQobWFwcGluZ0EsIG1hcHBpbmdCLCBvbmx5Q29tcGFyZUdlbmVyYXRlZCkge1xuICB2YXIgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwIHx8IG9ubHlDb21wYXJlR2VuZXJhdGVkKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZDtcblxuZnVuY3Rpb24gc3RyY21wKGFTdHIxLCBhU3RyMikge1xuICBpZiAoYVN0cjEgPT09IGFTdHIyKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoYVN0cjEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gMTsgLy8gYVN0cjIgIT09IG51bGxcbiAgfVxuXG4gIGlmIChhU3RyMiA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMTsgLy8gYVN0cjEgIT09IG51bGxcbiAgfVxuXG4gIGlmIChhU3RyMSA+IGFTdHIyKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aXRoIGluZmxhdGVkIHNvdXJjZSBhbmQgbmFtZSBzdHJpbmdzIHdoZXJlXG4gKiB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQikge1xuICB2YXIgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZDtcblxuLyoqXG4gKiBTdHJpcCBhbnkgSlNPTiBYU1NJIGF2b2lkYW5jZSBwcmVmaXggZnJvbSB0aGUgc3RyaW5nIChhcyBkb2N1bWVudGVkXG4gKiBpbiB0aGUgc291cmNlIG1hcHMgc3BlY2lmaWNhdGlvbiksIGFuZCB0aGVuIHBhcnNlIHRoZSBzdHJpbmcgYXNcbiAqIEpTT04uXG4gKi9cbmZ1bmN0aW9uIHBhcnNlU291cmNlTWFwSW5wdXQoc3RyKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHN0ci5yZXBsYWNlKC9eXFwpXX0nW15cXG5dKlxcbi8sICcnKSk7XG59XG5leHBvcnRzLnBhcnNlU291cmNlTWFwSW5wdXQgPSBwYXJzZVNvdXJjZU1hcElucHV0O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIFVSTCBvZiBhIHNvdXJjZSBnaXZlbiB0aGUgdGhlIHNvdXJjZSByb290LCB0aGUgc291cmNlJ3NcbiAqIFVSTCwgYW5kIHRoZSBzb3VyY2UgbWFwJ3MgVVJMLlxuICovXG5mdW5jdGlvbiBjb21wdXRlU291cmNlVVJMKHNvdXJjZVJvb3QsIHNvdXJjZVVSTCwgc291cmNlTWFwVVJMKSB7XG4gIHNvdXJjZVVSTCA9IHNvdXJjZVVSTCB8fCAnJztcblxuICBpZiAoc291cmNlUm9vdCkge1xuICAgIC8vIFRoaXMgZm9sbG93cyB3aGF0IENocm9tZSBkb2VzLlxuICAgIGlmIChzb3VyY2VSb290W3NvdXJjZVJvb3QubGVuZ3RoIC0gMV0gIT09ICcvJyAmJiBzb3VyY2VVUkxbMF0gIT09ICcvJykge1xuICAgICAgc291cmNlUm9vdCArPSAnLyc7XG4gICAgfVxuICAgIC8vIFRoZSBzcGVjIHNheXM6XG4gICAgLy8gICBMaW5lIDQ6IEFuIG9wdGlvbmFsIHNvdXJjZSByb290LCB1c2VmdWwgZm9yIHJlbG9jYXRpbmcgc291cmNlXG4gICAgLy8gICBmaWxlcyBvbiBhIHNlcnZlciBvciByZW1vdmluZyByZXBlYXRlZCB2YWx1ZXMgaW4gdGhlXG4gICAgLy8gICDigJxzb3VyY2Vz4oCdIGVudHJ5LiAgVGhpcyB2YWx1ZSBpcyBwcmVwZW5kZWQgdG8gdGhlIGluZGl2aWR1YWxcbiAgICAvLyAgIGVudHJpZXMgaW4gdGhlIOKAnHNvdXJjZeKAnSBmaWVsZC5cbiAgICBzb3VyY2VVUkwgPSBzb3VyY2VSb290ICsgc291cmNlVVJMO1xuICB9XG5cbiAgLy8gSGlzdG9yaWNhbGx5LCBTb3VyY2VNYXBDb25zdW1lciBkaWQgbm90IHRha2UgdGhlIHNvdXJjZU1hcFVSTCBhc1xuICAvLyBhIHBhcmFtZXRlci4gIFRoaXMgbW9kZSBpcyBzdGlsbCBzb21ld2hhdCBzdXBwb3J0ZWQsIHdoaWNoIGlzIHdoeVxuICAvLyB0aGlzIGNvZGUgYmxvY2sgaXMgY29uZGl0aW9uYWwuICBIb3dldmVyLCBpdCdzIHByZWZlcmFibGUgdG8gcGFzc1xuICAvLyB0aGUgc291cmNlIG1hcCBVUkwgdG8gU291cmNlTWFwQ29uc3VtZXIsIHNvIHRoYXQgdGhpcyBmdW5jdGlvblxuICAvLyBjYW4gaW1wbGVtZW50IHRoZSBzb3VyY2UgVVJMIHJlc29sdXRpb24gYWxnb3JpdGhtIGFzIG91dGxpbmVkIGluXG4gIC8vIHRoZSBzcGVjLiAgVGhpcyBibG9jayBpcyBiYXNpY2FsbHkgdGhlIGVxdWl2YWxlbnQgb2Y6XG4gIC8vICAgIG5ldyBVUkwoc291cmNlVVJMLCBzb3VyY2VNYXBVUkwpLnRvU3RyaW5nKClcbiAgLy8gLi4uIGV4Y2VwdCBpdCBhdm9pZHMgdXNpbmcgVVJMLCB3aGljaCB3YXNuJ3QgYXZhaWxhYmxlIGluIHRoZVxuICAvLyBvbGRlciByZWxlYXNlcyBvZiBub2RlIHN0aWxsIHN1cHBvcnRlZCBieSB0aGlzIGxpYnJhcnkuXG4gIC8vXG4gIC8vIFRoZSBzcGVjIHNheXM6XG4gIC8vICAgSWYgdGhlIHNvdXJjZXMgYXJlIG5vdCBhYnNvbHV0ZSBVUkxzIGFmdGVyIHByZXBlbmRpbmcgb2YgdGhlXG4gIC8vICAg4oCcc291cmNlUm9vdOKAnSwgdGhlIHNvdXJjZXMgYXJlIHJlc29sdmVkIHJlbGF0aXZlIHRvIHRoZVxuICAvLyAgIFNvdXJjZU1hcCAobGlrZSByZXNvbHZpbmcgc2NyaXB0IHNyYyBpbiBhIGh0bWwgZG9jdW1lbnQpLlxuICBpZiAoc291cmNlTWFwVVJMKSB7XG4gICAgdmFyIHBhcnNlZCA9IHVybFBhcnNlKHNvdXJjZU1hcFVSTCk7XG4gICAgaWYgKCFwYXJzZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInNvdXJjZU1hcFVSTCBjb3VsZCBub3QgYmUgcGFyc2VkXCIpO1xuICAgIH1cbiAgICBpZiAocGFyc2VkLnBhdGgpIHtcbiAgICAgIC8vIFN0cmlwIHRoZSBsYXN0IHBhdGggY29tcG9uZW50LCBidXQga2VlcCB0aGUgXCIvXCIuXG4gICAgICB2YXIgaW5kZXggPSBwYXJzZWQucGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgcGFyc2VkLnBhdGggPSBwYXJzZWQucGF0aC5zdWJzdHJpbmcoMCwgaW5kZXggKyAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc291cmNlVVJMID0gam9pbih1cmxHZW5lcmF0ZShwYXJzZWQpLCBzb3VyY2VVUkwpO1xuICB9XG5cbiAgcmV0dXJuIG5vcm1hbGl6ZShzb3VyY2VVUkwpO1xufVxuZXhwb3J0cy5jb21wdXRlU291cmNlVVJMID0gY29tcHV0ZVNvdXJjZVVSTDtcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fMl9fOyIsImV4cG9ydCBjb25zdCBOT05FOiBMT0dfTk9ORSA9IDA7XG5leHBvcnQgY29uc3QgTE9HOiBMT0dfTE9HID0gMTtcbmV4cG9ydCBjb25zdCBJTkZPOiBMT0dfSU5GTyA9IDI7XG5leHBvcnQgY29uc3QgV0FSTjogTE9HX1dBUk4gPSAzO1xuZXhwb3J0IGNvbnN0IEVSUk9SOiBMT0dfRVJST1IgPSA0O1xuZXhwb3J0IGNvbnN0IERFQlVHOiBMT0dfREVCVUcgPSA1O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgYmFzZTY0VkxRID0gcmVxdWlyZSgnLi9iYXNlNjQtdmxxJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIEFycmF5U2V0ID0gcmVxdWlyZSgnLi9hcnJheS1zZXQnKS5BcnJheVNldDtcbnZhciBNYXBwaW5nTGlzdCA9IHJlcXVpcmUoJy4vbWFwcGluZy1saXN0JykuTWFwcGluZ0xpc3Q7XG5cbi8qKlxuICogQW4gaW5zdGFuY2Ugb2YgdGhlIFNvdXJjZU1hcEdlbmVyYXRvciByZXByZXNlbnRzIGEgc291cmNlIG1hcCB3aGljaCBpc1xuICogYmVpbmcgYnVpbHQgaW5jcmVtZW50YWxseS4gWW91IG1heSBwYXNzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmdcbiAqIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGZpbGU6IFRoZSBmaWxlbmFtZSBvZiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqICAgLSBzb3VyY2VSb290OiBBIHJvb3QgZm9yIGFsbCByZWxhdGl2ZSBVUkxzIGluIHRoaXMgc291cmNlIG1hcC5cbiAqL1xuZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yKGFBcmdzKSB7XG4gIGlmICghYUFyZ3MpIHtcbiAgICBhQXJncyA9IHt9O1xuICB9XG4gIHRoaXMuX2ZpbGUgPSB1dGlsLmdldEFyZyhhQXJncywgJ2ZpbGUnLCBudWxsKTtcbiAgdGhpcy5fc291cmNlUm9vdCA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlUm9vdCcsIG51bGwpO1xuICB0aGlzLl9za2lwVmFsaWRhdGlvbiA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc2tpcFZhbGlkYXRpb24nLCBmYWxzZSk7XG4gIHRoaXMuX3NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbWFwcGluZ3MgPSBuZXcgTWFwcGluZ0xpc3QoKTtcbiAgdGhpcy5fc291cmNlc0NvbnRlbnRzID0gbnVsbDtcbn1cblxuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IgYmFzZWQgb24gYSBTb3VyY2VNYXBDb25zdW1lclxuICpcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIFNvdXJjZU1hcC5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLmZyb21Tb3VyY2VNYXAgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfZnJvbVNvdXJjZU1hcChhU291cmNlTWFwQ29uc3VtZXIpIHtcbiAgICB2YXIgc291cmNlUm9vdCA9IGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VSb290O1xuICAgIHZhciBnZW5lcmF0b3IgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICAgIGZpbGU6IGFTb3VyY2VNYXBDb25zdW1lci5maWxlLFxuICAgICAgc291cmNlUm9vdDogc291cmNlUm9vdFxuICAgIH0pO1xuICAgIGFTb3VyY2VNYXBDb25zdW1lci5lYWNoTWFwcGluZyhmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgdmFyIG5ld01hcHBpbmcgPSB7XG4gICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgIGxpbmU6IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIG5ld01hcHBpbmcuc291cmNlID0gbWFwcGluZy5zb3VyY2U7XG4gICAgICAgIGlmIChzb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdNYXBwaW5nLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgbmV3TWFwcGluZy5zb3VyY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3TWFwcGluZy5vcmlnaW5hbCA9IHtcbiAgICAgICAgICBsaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAobWFwcGluZy5uYW1lICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdNYXBwaW5nLm5hbWUgPSBtYXBwaW5nLm5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2VuZXJhdG9yLmFkZE1hcHBpbmcobmV3TWFwcGluZyk7XG4gICAgfSk7XG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlRmlsZSkge1xuICAgICAgdmFyIHNvdXJjZVJlbGF0aXZlID0gc291cmNlRmlsZTtcbiAgICAgIGlmIChzb3VyY2VSb290ICE9PSBudWxsKSB7XG4gICAgICAgIHNvdXJjZVJlbGF0aXZlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBzb3VyY2VGaWxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFnZW5lcmF0b3IuX3NvdXJjZXMuaGFzKHNvdXJjZVJlbGF0aXZlKSkge1xuICAgICAgICBnZW5lcmF0b3IuX3NvdXJjZXMuYWRkKHNvdXJjZVJlbGF0aXZlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRlbnQgPSBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlQ29udGVudEZvcihzb3VyY2VGaWxlKTtcbiAgICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgZ2VuZXJhdG9yLnNldFNvdXJjZUNvbnRlbnQoc291cmNlRmlsZSwgY29udGVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfTtcblxuLyoqXG4gKiBBZGQgYSBzaW5nbGUgbWFwcGluZyBmcm9tIG9yaWdpbmFsIHNvdXJjZSBsaW5lIGFuZCBjb2x1bW4gdG8gdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIGZvciB0aGlzIHNvdXJjZSBtYXAgYmVpbmcgY3JlYXRlZC4gVGhlIG1hcHBpbmdcbiAqIG9iamVjdCBzaG91bGQgaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGdlbmVyYXRlZDogQW4gb2JqZWN0IHdpdGggdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zLlxuICogICAtIG9yaWdpbmFsOiBBbiBvYmplY3Qgd2l0aCB0aGUgb3JpZ2luYWwgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucy5cbiAqICAgLSBzb3VyY2U6IFRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSAocmVsYXRpdmUgdG8gdGhlIHNvdXJjZVJvb3QpLlxuICogICAtIG5hbWU6IEFuIG9wdGlvbmFsIG9yaWdpbmFsIHRva2VuIG5hbWUgZm9yIHRoaXMgbWFwcGluZy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hZGRNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2FkZE1hcHBpbmcoYUFyZ3MpIHtcbiAgICB2YXIgZ2VuZXJhdGVkID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdnZW5lcmF0ZWQnKTtcbiAgICB2YXIgb3JpZ2luYWwgPSB1dGlsLmdldEFyZyhhQXJncywgJ29yaWdpbmFsJywgbnVsbCk7XG4gICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJywgbnVsbCk7XG4gICAgdmFyIG5hbWUgPSB1dGlsLmdldEFyZyhhQXJncywgJ25hbWUnLCBudWxsKTtcblxuICAgIGlmICghdGhpcy5fc2tpcFZhbGlkYXRpb24pIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlTWFwcGluZyhnZW5lcmF0ZWQsIG9yaWdpbmFsLCBzb3VyY2UsIG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChzb3VyY2UgIT0gbnVsbCkge1xuICAgICAgc291cmNlID0gU3RyaW5nKHNvdXJjZSk7XG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgdGhpcy5fc291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgICAgaWYgKCF0aGlzLl9uYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbmFtZXMuYWRkKG5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX21hcHBpbmdzLmFkZCh7XG4gICAgICBnZW5lcmF0ZWRMaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgIGdlbmVyYXRlZENvbHVtbjogZ2VuZXJhdGVkLmNvbHVtbixcbiAgICAgIG9yaWdpbmFsTGluZTogb3JpZ2luYWwgIT0gbnVsbCAmJiBvcmlnaW5hbC5saW5lLFxuICAgICAgb3JpZ2luYWxDb2x1bW46IG9yaWdpbmFsICE9IG51bGwgJiYgb3JpZ2luYWwuY29sdW1uLFxuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfSk7XG4gIH07XG5cbi8qKlxuICogU2V0IHRoZSBzb3VyY2UgY29udGVudCBmb3IgYSBzb3VyY2UgZmlsZS5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5zZXRTb3VyY2VDb250ZW50ID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3NldFNvdXJjZUNvbnRlbnQoYVNvdXJjZUZpbGUsIGFTb3VyY2VDb250ZW50KSB7XG4gICAgdmFyIHNvdXJjZSA9IGFTb3VyY2VGaWxlO1xuICAgIGlmICh0aGlzLl9zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIHNvdXJjZSA9IHV0aWwucmVsYXRpdmUodGhpcy5fc291cmNlUm9vdCwgc291cmNlKTtcbiAgICB9XG5cbiAgICBpZiAoYVNvdXJjZUNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgLy8gQWRkIHRoZSBzb3VyY2UgY29udGVudCB0byB0aGUgX3NvdXJjZXNDb250ZW50cyBtYXAuXG4gICAgICAvLyBDcmVhdGUgYSBuZXcgX3NvdXJjZXNDb250ZW50cyBtYXAgaWYgdGhlIHByb3BlcnR5IGlzIG51bGwuXG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgICB0aGlzLl9zb3VyY2VzQ29udGVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgfVxuICAgICAgdGhpcy5fc291cmNlc0NvbnRlbnRzW3V0aWwudG9TZXRTdHJpbmcoc291cmNlKV0gPSBhU291cmNlQ29udGVudDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBzb3VyY2UgZmlsZSBmcm9tIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcC5cbiAgICAgIC8vIElmIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcCBpcyBlbXB0eSwgc2V0IHRoZSBwcm9wZXJ0eSB0byBudWxsLlxuICAgICAgZGVsZXRlIHRoaXMuX3NvdXJjZXNDb250ZW50c1t1dGlsLnRvU2V0U3RyaW5nKHNvdXJjZSldO1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuX3NvdXJjZXNDb250ZW50cykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZXNDb250ZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEFwcGxpZXMgdGhlIG1hcHBpbmdzIG9mIGEgc3ViLXNvdXJjZS1tYXAgZm9yIGEgc3BlY2lmaWMgc291cmNlIGZpbGUgdG8gdGhlXG4gKiBzb3VyY2UgbWFwIGJlaW5nIGdlbmVyYXRlZC4gRWFjaCBtYXBwaW5nIHRvIHRoZSBzdXBwbGllZCBzb3VyY2UgZmlsZSBpc1xuICogcmV3cml0dGVuIHVzaW5nIHRoZSBzdXBwbGllZCBzb3VyY2UgbWFwLiBOb3RlOiBUaGUgcmVzb2x1dGlvbiBmb3IgdGhlXG4gKiByZXN1bHRpbmcgbWFwcGluZ3MgaXMgdGhlIG1pbmltaXVtIG9mIHRoaXMgbWFwIGFuZCB0aGUgc3VwcGxpZWQgbWFwLlxuICpcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIHNvdXJjZSBtYXAgdG8gYmUgYXBwbGllZC5cbiAqIEBwYXJhbSBhU291cmNlRmlsZSBPcHRpb25hbC4gVGhlIGZpbGVuYW1lIG9mIHRoZSBzb3VyY2UgZmlsZS5cbiAqICAgICAgICBJZiBvbWl0dGVkLCBTb3VyY2VNYXBDb25zdW1lcidzIGZpbGUgcHJvcGVydHkgd2lsbCBiZSB1c2VkLlxuICogQHBhcmFtIGFTb3VyY2VNYXBQYXRoIE9wdGlvbmFsLiBUaGUgZGlybmFtZSBvZiB0aGUgcGF0aCB0byB0aGUgc291cmNlIG1hcFxuICogICAgICAgIHRvIGJlIGFwcGxpZWQuIElmIHJlbGF0aXZlLCBpdCBpcyByZWxhdGl2ZSB0byB0aGUgU291cmNlTWFwQ29uc3VtZXIuXG4gKiAgICAgICAgVGhpcyBwYXJhbWV0ZXIgaXMgbmVlZGVkIHdoZW4gdGhlIHR3byBzb3VyY2UgbWFwcyBhcmVuJ3QgaW4gdGhlIHNhbWVcbiAqICAgICAgICBkaXJlY3RvcnksIGFuZCB0aGUgc291cmNlIG1hcCB0byBiZSBhcHBsaWVkIGNvbnRhaW5zIHJlbGF0aXZlIHNvdXJjZVxuICogICAgICAgIHBhdGhzLiBJZiBzbywgdGhvc2UgcmVsYXRpdmUgc291cmNlIHBhdGhzIG5lZWQgdG8gYmUgcmV3cml0dGVuXG4gKiAgICAgICAgcmVsYXRpdmUgdG8gdGhlIFNvdXJjZU1hcEdlbmVyYXRvci5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hcHBseVNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9hcHBseVNvdXJjZU1hcChhU291cmNlTWFwQ29uc3VtZXIsIGFTb3VyY2VGaWxlLCBhU291cmNlTWFwUGF0aCkge1xuICAgIHZhciBzb3VyY2VGaWxlID0gYVNvdXJjZUZpbGU7XG4gICAgLy8gSWYgYVNvdXJjZUZpbGUgaXMgb21pdHRlZCwgd2Ugd2lsbCB1c2UgdGhlIGZpbGUgcHJvcGVydHkgb2YgdGhlIFNvdXJjZU1hcFxuICAgIGlmIChhU291cmNlRmlsZSA9PSBudWxsKSB7XG4gICAgICBpZiAoYVNvdXJjZU1hcENvbnN1bWVyLmZpbGUgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1NvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUuYXBwbHlTb3VyY2VNYXAgcmVxdWlyZXMgZWl0aGVyIGFuIGV4cGxpY2l0IHNvdXJjZSBmaWxlLCAnICtcbiAgICAgICAgICAnb3IgdGhlIHNvdXJjZSBtYXBcXCdzIFwiZmlsZVwiIHByb3BlcnR5LiBCb3RoIHdlcmUgb21pdHRlZC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBzb3VyY2VGaWxlID0gYVNvdXJjZU1hcENvbnN1bWVyLmZpbGU7XG4gICAgfVxuICAgIHZhciBzb3VyY2VSb290ID0gdGhpcy5fc291cmNlUm9vdDtcbiAgICAvLyBNYWtlIFwic291cmNlRmlsZVwiIHJlbGF0aXZlIGlmIGFuIGFic29sdXRlIFVybCBpcyBwYXNzZWQuXG4gICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgc291cmNlRmlsZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlRmlsZSk7XG4gICAgfVxuICAgIC8vIEFwcGx5aW5nIHRoZSBTb3VyY2VNYXAgY2FuIGFkZCBhbmQgcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIHNvdXJjZXMgYW5kXG4gICAgLy8gdGhlIG5hbWVzIGFycmF5LlxuICAgIHZhciBuZXdTb3VyY2VzID0gbmV3IEFycmF5U2V0KCk7XG4gICAgdmFyIG5ld05hbWVzID0gbmV3IEFycmF5U2V0KCk7XG5cbiAgICAvLyBGaW5kIG1hcHBpbmdzIGZvciB0aGUgXCJzb3VyY2VGaWxlXCJcbiAgICB0aGlzLl9tYXBwaW5ncy51bnNvcnRlZEZvckVhY2goZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSA9PT0gc291cmNlRmlsZSAmJiBtYXBwaW5nLm9yaWdpbmFsTGluZSAhPSBudWxsKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGl0IGNhbiBiZSBtYXBwZWQgYnkgdGhlIHNvdXJjZSBtYXAsIHRoZW4gdXBkYXRlIHRoZSBtYXBwaW5nLlxuICAgICAgICB2YXIgb3JpZ2luYWwgPSBhU291cmNlTWFwQ29uc3VtZXIub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgICAgICAgbGluZTogbWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgICAgY29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3JpZ2luYWwuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBDb3B5IG1hcHBpbmdcbiAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IG9yaWdpbmFsLnNvdXJjZTtcbiAgICAgICAgICBpZiAoYVNvdXJjZU1hcFBhdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSB1dGlsLmpvaW4oYVNvdXJjZU1hcFBhdGgsIG1hcHBpbmcuc291cmNlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgbWFwcGluZy5zb3VyY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSA9IG9yaWdpbmFsLmxpbmU7XG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbENvbHVtbiA9IG9yaWdpbmFsLmNvbHVtbjtcbiAgICAgICAgICBpZiAob3JpZ2luYWwubmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLm5hbWUgPSBvcmlnaW5hbC5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlID0gbWFwcGluZy5zb3VyY2U7XG4gICAgICBpZiAoc291cmNlICE9IG51bGwgJiYgIW5ld1NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgbmV3U291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5hbWUgPSBtYXBwaW5nLm5hbWU7XG4gICAgICBpZiAobmFtZSAhPSBudWxsICYmICFuZXdOYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgICAgbmV3TmFtZXMuYWRkKG5hbWUpO1xuICAgICAgfVxuXG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5fc291cmNlcyA9IG5ld1NvdXJjZXM7XG4gICAgdGhpcy5fbmFtZXMgPSBuZXdOYW1lcztcblxuICAgIC8vIENvcHkgc291cmNlc0NvbnRlbnRzIG9mIGFwcGxpZWQgbWFwLlxuICAgIGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZUZpbGUpIHtcbiAgICAgIHZhciBjb250ZW50ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlRmlsZSk7XG4gICAgICBpZiAoY29udGVudCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChhU291cmNlTWFwUGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHV0aWwuam9pbihhU291cmNlTWFwUGF0aCwgc291cmNlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZUZpbGUgPSB1dGlsLnJlbGF0aXZlKHNvdXJjZVJvb3QsIHNvdXJjZUZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuLyoqXG4gKiBBIG1hcHBpbmcgY2FuIGhhdmUgb25lIG9mIHRoZSB0aHJlZSBsZXZlbHMgb2YgZGF0YTpcbiAqXG4gKiAgIDEuIEp1c3QgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbi5cbiAqICAgMi4gVGhlIEdlbmVyYXRlZCBwb3NpdGlvbiwgb3JpZ2luYWwgcG9zaXRpb24sIGFuZCBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIDMuIEdlbmVyYXRlZCBhbmQgb3JpZ2luYWwgcG9zaXRpb24sIG9yaWdpbmFsIHNvdXJjZSwgYXMgd2VsbCBhcyBhIG5hbWVcbiAqICAgICAgdG9rZW4uXG4gKlxuICogVG8gbWFpbnRhaW4gY29uc2lzdGVuY3ksIHdlIHZhbGlkYXRlIHRoYXQgYW55IG5ldyBtYXBwaW5nIGJlaW5nIGFkZGVkIGZhbGxzXG4gKiBpbiB0byBvbmUgb2YgdGhlc2UgY2F0ZWdvcmllcy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGVNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3ZhbGlkYXRlTWFwcGluZyhhR2VuZXJhdGVkLCBhT3JpZ2luYWwsIGFTb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYU5hbWUpIHtcbiAgICAvLyBXaGVuIGFPcmlnaW5hbCBpcyB0cnV0aHkgYnV0IGhhcyBlbXB0eSB2YWx1ZXMgZm9yIC5saW5lIGFuZCAuY29sdW1uLFxuICAgIC8vIGl0IGlzIG1vc3QgbGlrZWx5IGEgcHJvZ3JhbW1lciBlcnJvci4gSW4gdGhpcyBjYXNlIHdlIHRocm93IGEgdmVyeVxuICAgIC8vIHNwZWNpZmljIGVycm9yIG1lc3NhZ2UgdG8gdHJ5IHRvIGd1aWRlIHRoZW0gdGhlIHJpZ2h0IHdheS5cbiAgICAvLyBGb3IgZXhhbXBsZTogaHR0cHM6Ly9naXRodWIuY29tL1BvbHltZXIvcG9seW1lci1idW5kbGVyL3B1bGwvNTE5XG4gICAgaWYgKGFPcmlnaW5hbCAmJiB0eXBlb2YgYU9yaWdpbmFsLmxpbmUgIT09ICdudW1iZXInICYmIHR5cGVvZiBhT3JpZ2luYWwuY29sdW1uICE9PSAnbnVtYmVyJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnb3JpZ2luYWwubGluZSBhbmQgb3JpZ2luYWwuY29sdW1uIGFyZSBub3QgbnVtYmVycyAtLSB5b3UgcHJvYmFibHkgbWVhbnQgdG8gb21pdCAnICtcbiAgICAgICAgICAgICd0aGUgb3JpZ2luYWwgbWFwcGluZyBlbnRpcmVseSBhbmQgb25seSBtYXAgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbi4gSWYgc28sIHBhc3MgJyArXG4gICAgICAgICAgICAnbnVsbCBmb3IgdGhlIG9yaWdpbmFsIG1hcHBpbmcgaW5zdGVhZCBvZiBhbiBvYmplY3Qgd2l0aCBlbXB0eSBvciBudWxsIHZhbHVlcy4nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGFHZW5lcmF0ZWQgJiYgJ2xpbmUnIGluIGFHZW5lcmF0ZWQgJiYgJ2NvbHVtbicgaW4gYUdlbmVyYXRlZFxuICAgICAgICAmJiBhR2VuZXJhdGVkLmxpbmUgPiAwICYmIGFHZW5lcmF0ZWQuY29sdW1uID49IDBcbiAgICAgICAgJiYgIWFPcmlnaW5hbCAmJiAhYVNvdXJjZSAmJiAhYU5hbWUpIHtcbiAgICAgIC8vIENhc2UgMS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxzZSBpZiAoYUdlbmVyYXRlZCAmJiAnbGluZScgaW4gYUdlbmVyYXRlZCAmJiAnY29sdW1uJyBpbiBhR2VuZXJhdGVkXG4gICAgICAgICAgICAgJiYgYU9yaWdpbmFsICYmICdsaW5lJyBpbiBhT3JpZ2luYWwgJiYgJ2NvbHVtbicgaW4gYU9yaWdpbmFsXG4gICAgICAgICAgICAgJiYgYUdlbmVyYXRlZC5saW5lID4gMCAmJiBhR2VuZXJhdGVkLmNvbHVtbiA+PSAwXG4gICAgICAgICAgICAgJiYgYU9yaWdpbmFsLmxpbmUgPiAwICYmIGFPcmlnaW5hbC5jb2x1bW4gPj0gMFxuICAgICAgICAgICAgICYmIGFTb3VyY2UpIHtcbiAgICAgIC8vIENhc2VzIDIgYW5kIDMuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1hcHBpbmc6ICcgKyBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGdlbmVyYXRlZDogYUdlbmVyYXRlZCxcbiAgICAgICAgc291cmNlOiBhU291cmNlLFxuICAgICAgICBvcmlnaW5hbDogYU9yaWdpbmFsLFxuICAgICAgICBuYW1lOiBhTmFtZVxuICAgICAgfSkpO1xuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGFjY3VtdWxhdGVkIG1hcHBpbmdzIGluIHRvIHRoZSBzdHJlYW0gb2YgYmFzZSA2NCBWTFFzXG4gKiBzcGVjaWZpZWQgYnkgdGhlIHNvdXJjZSBtYXAgZm9ybWF0LlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl9zZXJpYWxpemVNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9zZXJpYWxpemVNYXBwaW5ncygpIHtcbiAgICB2YXIgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICAgIHZhciBwcmV2aW91c0dlbmVyYXRlZExpbmUgPSAxO1xuICAgIHZhciBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbExpbmUgPSAwO1xuICAgIHZhciBwcmV2aW91c05hbWUgPSAwO1xuICAgIHZhciBwcmV2aW91c1NvdXJjZSA9IDA7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBuZXh0O1xuICAgIHZhciBtYXBwaW5nO1xuICAgIHZhciBuYW1lSWR4O1xuICAgIHZhciBzb3VyY2VJZHg7XG5cbiAgICB2YXIgbWFwcGluZ3MgPSB0aGlzLl9tYXBwaW5ncy50b0FycmF5KCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1hcHBpbmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtYXBwaW5nID0gbWFwcGluZ3NbaV07XG4gICAgICBuZXh0ID0gJydcblxuICAgICAgaWYgKG1hcHBpbmcuZ2VuZXJhdGVkTGluZSAhPT0gcHJldmlvdXNHZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICAgICAgd2hpbGUgKG1hcHBpbmcuZ2VuZXJhdGVkTGluZSAhPT0gcHJldmlvdXNHZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgICAgbmV4dCArPSAnOyc7XG4gICAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRMaW5lKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICBpZiAoIXV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQobWFwcGluZywgbWFwcGluZ3NbaSAtIDFdKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHQgKz0gJywnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShtYXBwaW5nLmdlbmVyYXRlZENvbHVtblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBwcmV2aW91c0dlbmVyYXRlZENvbHVtbik7XG4gICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICBpZiAobWFwcGluZy5zb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICBzb3VyY2VJZHggPSB0aGlzLl9zb3VyY2VzLmluZGV4T2YobWFwcGluZy5zb3VyY2UpO1xuICAgICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUoc291cmNlSWR4IC0gcHJldmlvdXNTb3VyY2UpO1xuICAgICAgICBwcmV2aW91c1NvdXJjZSA9IHNvdXJjZUlkeDtcblxuICAgICAgICAvLyBsaW5lcyBhcmUgc3RvcmVkIDAtYmFzZWQgaW4gU291cmNlTWFwIHNwZWMgdmVyc2lvbiAzXG4gICAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShtYXBwaW5nLm9yaWdpbmFsTGluZSAtIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBwcmV2aW91c09yaWdpbmFsTGluZSk7XG4gICAgICAgIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gbWFwcGluZy5vcmlnaW5hbExpbmUgLSAxO1xuXG4gICAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShtYXBwaW5nLm9yaWdpbmFsQ29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gcHJldmlvdXNPcmlnaW5hbENvbHVtbik7XG4gICAgICAgIHByZXZpb3VzT3JpZ2luYWxDb2x1bW4gPSBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uO1xuXG4gICAgICAgIGlmIChtYXBwaW5nLm5hbWUgIT0gbnVsbCkge1xuICAgICAgICAgIG5hbWVJZHggPSB0aGlzLl9uYW1lcy5pbmRleE9mKG1hcHBpbmcubmFtZSk7XG4gICAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG5hbWVJZHggLSBwcmV2aW91c05hbWUpO1xuICAgICAgICAgIHByZXZpb3VzTmFtZSA9IG5hbWVJZHg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVzdWx0ICs9IG5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fZ2VuZXJhdGVTb3VyY2VzQ29udGVudCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9nZW5lcmF0ZVNvdXJjZXNDb250ZW50KGFTb3VyY2VzLCBhU291cmNlUm9vdCkge1xuICAgIHJldHVybiBhU291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgaWYgKCF0aGlzLl9zb3VyY2VzQ29udGVudHMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoYVNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICBzb3VyY2UgPSB1dGlsLnJlbGF0aXZlKGFTb3VyY2VSb290LCBzb3VyY2UpO1xuICAgICAgfVxuICAgICAgdmFyIGtleSA9IHV0aWwudG9TZXRTdHJpbmcoc291cmNlKTtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5fc291cmNlc0NvbnRlbnRzLCBrZXkpXG4gICAgICAgID8gdGhpcy5fc291cmNlc0NvbnRlbnRzW2tleV1cbiAgICAgICAgOiBudWxsO1xuICAgIH0sIHRoaXMpO1xuICB9O1xuXG4vKipcbiAqIEV4dGVybmFsaXplIHRoZSBzb3VyY2UgbWFwLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLnRvSlNPTiA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl90b0pTT04oKSB7XG4gICAgdmFyIG1hcCA9IHtcbiAgICAgIHZlcnNpb246IHRoaXMuX3ZlcnNpb24sXG4gICAgICBzb3VyY2VzOiB0aGlzLl9zb3VyY2VzLnRvQXJyYXkoKSxcbiAgICAgIG5hbWVzOiB0aGlzLl9uYW1lcy50b0FycmF5KCksXG4gICAgICBtYXBwaW5nczogdGhpcy5fc2VyaWFsaXplTWFwcGluZ3MoKVxuICAgIH07XG4gICAgaWYgKHRoaXMuX2ZpbGUgIT0gbnVsbCkge1xuICAgICAgbWFwLmZpbGUgPSB0aGlzLl9maWxlO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBtYXAuc291cmNlUm9vdCA9IHRoaXMuX3NvdXJjZVJvb3Q7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zb3VyY2VzQ29udGVudHMpIHtcbiAgICAgIG1hcC5zb3VyY2VzQ29udGVudCA9IHRoaXMuX2dlbmVyYXRlU291cmNlc0NvbnRlbnQobWFwLnNvdXJjZXMsIG1hcC5zb3VyY2VSb290KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFwO1xuICB9O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgc291cmNlIG1hcCBiZWluZyBnZW5lcmF0ZWQgdG8gYSBzdHJpbmcuXG4gKi9cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUudG9TdHJpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMudG9KU09OKCkpO1xuICB9O1xuXG5leHBvcnRzLlNvdXJjZU1hcEdlbmVyYXRvciA9IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKlxuICogQmFzZWQgb24gdGhlIEJhc2UgNjQgVkxRIGltcGxlbWVudGF0aW9uIGluIENsb3N1cmUgQ29tcGlsZXI6XG4gKiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nsb3N1cmUtY29tcGlsZXIvc291cmNlL2Jyb3dzZS90cnVuay9zcmMvY29tL2dvb2dsZS9kZWJ1Z2dpbmcvc291cmNlbWFwL0Jhc2U2NFZMUS5qYXZhXG4gKlxuICogQ29weXJpZ2h0IDIwMTEgVGhlIENsb3N1cmUgQ29tcGlsZXIgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZVxuICogbWV0OlxuICpcbiAqICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlXG4gKiAgICBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZ1xuICogICAgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkXG4gKiAgICB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKiAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIEdvb2dsZSBJbmMuIG5vciB0aGUgbmFtZXMgb2YgaXRzXG4gKiAgICBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWRcbiAqICAgIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUXG4gKiBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCxcbiAqIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLFxuICogREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZXG4gKiBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0VcbiAqIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJy4vYmFzZTY0Jyk7XG5cbi8vIEEgc2luZ2xlIGJhc2UgNjQgZGlnaXQgY2FuIGNvbnRhaW4gNiBiaXRzIG9mIGRhdGEuIEZvciB0aGUgYmFzZSA2NCB2YXJpYWJsZVxuLy8gbGVuZ3RoIHF1YW50aXRpZXMgd2UgdXNlIGluIHRoZSBzb3VyY2UgbWFwIHNwZWMsIHRoZSBmaXJzdCBiaXQgaXMgdGhlIHNpZ24sXG4vLyB0aGUgbmV4dCBmb3VyIGJpdHMgYXJlIHRoZSBhY3R1YWwgdmFsdWUsIGFuZCB0aGUgNnRoIGJpdCBpcyB0aGVcbi8vIGNvbnRpbnVhdGlvbiBiaXQuIFRoZSBjb250aW51YXRpb24gYml0IHRlbGxzIHVzIHdoZXRoZXIgdGhlcmUgYXJlIG1vcmVcbi8vIGRpZ2l0cyBpbiB0aGlzIHZhbHVlIGZvbGxvd2luZyB0aGlzIGRpZ2l0LlxuLy9cbi8vICAgQ29udGludWF0aW9uXG4vLyAgIHwgICAgU2lnblxuLy8gICB8ICAgIHxcbi8vICAgViAgICBWXG4vLyAgIDEwMTAxMVxuXG52YXIgVkxRX0JBU0VfU0hJRlQgPSA1O1xuXG4vLyBiaW5hcnk6IDEwMDAwMFxudmFyIFZMUV9CQVNFID0gMSA8PCBWTFFfQkFTRV9TSElGVDtcblxuLy8gYmluYXJ5OiAwMTExMTFcbnZhciBWTFFfQkFTRV9NQVNLID0gVkxRX0JBU0UgLSAxO1xuXG4vLyBiaW5hcnk6IDEwMDAwMFxudmFyIFZMUV9DT05USU5VQVRJT05fQklUID0gVkxRX0JBU0U7XG5cbi8qKlxuICogQ29udmVydHMgZnJvbSBhIHR3by1jb21wbGVtZW50IHZhbHVlIHRvIGEgdmFsdWUgd2hlcmUgdGhlIHNpZ24gYml0IGlzXG4gKiBwbGFjZWQgaW4gdGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdC4gIEZvciBleGFtcGxlLCBhcyBkZWNpbWFsczpcbiAqICAgMSBiZWNvbWVzIDIgKDEwIGJpbmFyeSksIC0xIGJlY29tZXMgMyAoMTEgYmluYXJ5KVxuICogICAyIGJlY29tZXMgNCAoMTAwIGJpbmFyeSksIC0yIGJlY29tZXMgNSAoMTAxIGJpbmFyeSlcbiAqL1xuZnVuY3Rpb24gdG9WTFFTaWduZWQoYVZhbHVlKSB7XG4gIHJldHVybiBhVmFsdWUgPCAwXG4gICAgPyAoKC1hVmFsdWUpIDw8IDEpICsgMVxuICAgIDogKGFWYWx1ZSA8PCAxKSArIDA7XG59XG5cbi8qKlxuICogQ29udmVydHMgdG8gYSB0d28tY29tcGxlbWVudCB2YWx1ZSBmcm9tIGEgdmFsdWUgd2hlcmUgdGhlIHNpZ24gYml0IGlzXG4gKiBwbGFjZWQgaW4gdGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdC4gIEZvciBleGFtcGxlLCBhcyBkZWNpbWFsczpcbiAqICAgMiAoMTAgYmluYXJ5KSBiZWNvbWVzIDEsIDMgKDExIGJpbmFyeSkgYmVjb21lcyAtMVxuICogICA0ICgxMDAgYmluYXJ5KSBiZWNvbWVzIDIsIDUgKDEwMSBiaW5hcnkpIGJlY29tZXMgLTJcbiAqL1xuZnVuY3Rpb24gZnJvbVZMUVNpZ25lZChhVmFsdWUpIHtcbiAgdmFyIGlzTmVnYXRpdmUgPSAoYVZhbHVlICYgMSkgPT09IDE7XG4gIHZhciBzaGlmdGVkID0gYVZhbHVlID4+IDE7XG4gIHJldHVybiBpc05lZ2F0aXZlXG4gICAgPyAtc2hpZnRlZFxuICAgIDogc2hpZnRlZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBiYXNlIDY0IFZMUSBlbmNvZGVkIHZhbHVlLlxuICovXG5leHBvcnRzLmVuY29kZSA9IGZ1bmN0aW9uIGJhc2U2NFZMUV9lbmNvZGUoYVZhbHVlKSB7XG4gIHZhciBlbmNvZGVkID0gXCJcIjtcbiAgdmFyIGRpZ2l0O1xuXG4gIHZhciB2bHEgPSB0b1ZMUVNpZ25lZChhVmFsdWUpO1xuXG4gIGRvIHtcbiAgICBkaWdpdCA9IHZscSAmIFZMUV9CQVNFX01BU0s7XG4gICAgdmxxID4+Pj0gVkxRX0JBU0VfU0hJRlQ7XG4gICAgaWYgKHZscSA+IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZSBzdGlsbCBtb3JlIGRpZ2l0cyBpbiB0aGlzIHZhbHVlLCBzbyB3ZSBtdXN0IG1ha2Ugc3VyZSB0aGVcbiAgICAgIC8vIGNvbnRpbnVhdGlvbiBiaXQgaXMgbWFya2VkLlxuICAgICAgZGlnaXQgfD0gVkxRX0NPTlRJTlVBVElPTl9CSVQ7XG4gICAgfVxuICAgIGVuY29kZWQgKz0gYmFzZTY0LmVuY29kZShkaWdpdCk7XG4gIH0gd2hpbGUgKHZscSA+IDApO1xuXG4gIHJldHVybiBlbmNvZGVkO1xufTtcblxuLyoqXG4gKiBEZWNvZGVzIHRoZSBuZXh0IGJhc2UgNjQgVkxRIHZhbHVlIGZyb20gdGhlIGdpdmVuIHN0cmluZyBhbmQgcmV0dXJucyB0aGVcbiAqIHZhbHVlIGFuZCB0aGUgcmVzdCBvZiB0aGUgc3RyaW5nIHZpYSB0aGUgb3V0IHBhcmFtZXRlci5cbiAqL1xuZXhwb3J0cy5kZWNvZGUgPSBmdW5jdGlvbiBiYXNlNjRWTFFfZGVjb2RlKGFTdHIsIGFJbmRleCwgYU91dFBhcmFtKSB7XG4gIHZhciBzdHJMZW4gPSBhU3RyLmxlbmd0aDtcbiAgdmFyIHJlc3VsdCA9IDA7XG4gIHZhciBzaGlmdCA9IDA7XG4gIHZhciBjb250aW51YXRpb24sIGRpZ2l0O1xuXG4gIGRvIHtcbiAgICBpZiAoYUluZGV4ID49IHN0ckxlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgbW9yZSBkaWdpdHMgaW4gYmFzZSA2NCBWTFEgdmFsdWUuXCIpO1xuICAgIH1cblxuICAgIGRpZ2l0ID0gYmFzZTY0LmRlY29kZShhU3RyLmNoYXJDb2RlQXQoYUluZGV4KyspKTtcbiAgICBpZiAoZGlnaXQgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJhc2U2NCBkaWdpdDogXCIgKyBhU3RyLmNoYXJBdChhSW5kZXggLSAxKSk7XG4gICAgfVxuXG4gICAgY29udGludWF0aW9uID0gISEoZGlnaXQgJiBWTFFfQ09OVElOVUFUSU9OX0JJVCk7XG4gICAgZGlnaXQgJj0gVkxRX0JBU0VfTUFTSztcbiAgICByZXN1bHQgPSByZXN1bHQgKyAoZGlnaXQgPDwgc2hpZnQpO1xuICAgIHNoaWZ0ICs9IFZMUV9CQVNFX1NISUZUO1xuICB9IHdoaWxlIChjb250aW51YXRpb24pO1xuXG4gIGFPdXRQYXJhbS52YWx1ZSA9IGZyb21WTFFTaWduZWQocmVzdWx0KTtcbiAgYU91dFBhcmFtLnJlc3QgPSBhSW5kZXg7XG59O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaGFzTmF0aXZlTWFwID0gdHlwZW9mIE1hcCAhPT0gXCJ1bmRlZmluZWRcIjtcblxuLyoqXG4gKiBBIGRhdGEgc3RydWN0dXJlIHdoaWNoIGlzIGEgY29tYmluYXRpb24gb2YgYW4gYXJyYXkgYW5kIGEgc2V0LiBBZGRpbmcgYSBuZXdcbiAqIG1lbWJlciBpcyBPKDEpLCB0ZXN0aW5nIGZvciBtZW1iZXJzaGlwIGlzIE8oMSksIGFuZCBmaW5kaW5nIHRoZSBpbmRleCBvZiBhblxuICogZWxlbWVudCBpcyBPKDEpLiBSZW1vdmluZyBlbGVtZW50cyBmcm9tIHRoZSBzZXQgaXMgbm90IHN1cHBvcnRlZC4gT25seVxuICogc3RyaW5ncyBhcmUgc3VwcG9ydGVkIGZvciBtZW1iZXJzaGlwLlxuICovXG5mdW5jdGlvbiBBcnJheVNldCgpIHtcbiAgdGhpcy5fYXJyYXkgPSBbXTtcbiAgdGhpcy5fc2V0ID0gaGFzTmF0aXZlTWFwID8gbmV3IE1hcCgpIDogT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cblxuLyoqXG4gKiBTdGF0aWMgbWV0aG9kIGZvciBjcmVhdGluZyBBcnJheVNldCBpbnN0YW5jZXMgZnJvbSBhbiBleGlzdGluZyBhcnJheS5cbiAqL1xuQXJyYXlTZXQuZnJvbUFycmF5ID0gZnVuY3Rpb24gQXJyYXlTZXRfZnJvbUFycmF5KGFBcnJheSwgYUFsbG93RHVwbGljYXRlcykge1xuICB2YXIgc2V0ID0gbmV3IEFycmF5U2V0KCk7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhQXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzZXQuYWRkKGFBcnJheVtpXSwgYUFsbG93RHVwbGljYXRlcyk7XG4gIH1cbiAgcmV0dXJuIHNldDtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhvdyBtYW55IHVuaXF1ZSBpdGVtcyBhcmUgaW4gdGhpcyBBcnJheVNldC4gSWYgZHVwbGljYXRlcyBoYXZlIGJlZW5cbiAqIGFkZGVkLCB0aGFuIHRob3NlIGRvIG5vdCBjb3VudCB0b3dhcmRzIHRoZSBzaXplLlxuICpcbiAqIEByZXR1cm5zIE51bWJlclxuICovXG5BcnJheVNldC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uIEFycmF5U2V0X3NpemUoKSB7XG4gIHJldHVybiBoYXNOYXRpdmVNYXAgPyB0aGlzLl9zZXQuc2l6ZSA6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuX3NldCkubGVuZ3RoO1xufTtcblxuLyoqXG4gKiBBZGQgdGhlIGdpdmVuIHN0cmluZyB0byB0aGlzIHNldC5cbiAqXG4gKiBAcGFyYW0gU3RyaW5nIGFTdHJcbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIEFycmF5U2V0X2FkZChhU3RyLCBhQWxsb3dEdXBsaWNhdGVzKSB7XG4gIHZhciBzU3RyID0gaGFzTmF0aXZlTWFwID8gYVN0ciA6IHV0aWwudG9TZXRTdHJpbmcoYVN0cik7XG4gIHZhciBpc0R1cGxpY2F0ZSA9IGhhc05hdGl2ZU1hcCA/IHRoaXMuaGFzKGFTdHIpIDogaGFzLmNhbGwodGhpcy5fc2V0LCBzU3RyKTtcbiAgdmFyIGlkeCA9IHRoaXMuX2FycmF5Lmxlbmd0aDtcbiAgaWYgKCFpc0R1cGxpY2F0ZSB8fCBhQWxsb3dEdXBsaWNhdGVzKSB7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhU3RyKTtcbiAgfVxuICBpZiAoIWlzRHVwbGljYXRlKSB7XG4gICAgaWYgKGhhc05hdGl2ZU1hcCkge1xuICAgICAgdGhpcy5fc2V0LnNldChhU3RyLCBpZHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZXRbc1N0cl0gPSBpZHg7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIElzIHRoZSBnaXZlbiBzdHJpbmcgYSBtZW1iZXIgb2YgdGhpcyBzZXQ/XG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiBBcnJheVNldF9oYXMoYVN0cikge1xuICBpZiAoaGFzTmF0aXZlTWFwKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NldC5oYXMoYVN0cik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNTdHIgPSB1dGlsLnRvU2V0U3RyaW5nKGFTdHIpO1xuICAgIHJldHVybiBoYXMuY2FsbCh0aGlzLl9zZXQsIHNTdHIpO1xuICB9XG59O1xuXG4vKipcbiAqIFdoYXQgaXMgdGhlIGluZGV4IG9mIHRoZSBnaXZlbiBzdHJpbmcgaW4gdGhlIGFycmF5P1xuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5BcnJheVNldC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIEFycmF5U2V0X2luZGV4T2YoYVN0cikge1xuICBpZiAoaGFzTmF0aXZlTWFwKSB7XG4gICAgdmFyIGlkeCA9IHRoaXMuX3NldC5nZXQoYVN0cik7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBzU3RyID0gdXRpbC50b1NldFN0cmluZyhhU3RyKTtcbiAgICBpZiAoaGFzLmNhbGwodGhpcy5fc2V0LCBzU3RyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldFtzU3RyXTtcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTdHIgKyAnXCIgaXMgbm90IGluIHRoZSBzZXQuJyk7XG59O1xuXG4vKipcbiAqIFdoYXQgaXMgdGhlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4P1xuICpcbiAqIEBwYXJhbSBOdW1iZXIgYUlkeFxuICovXG5BcnJheVNldC5wcm90b3R5cGUuYXQgPSBmdW5jdGlvbiBBcnJheVNldF9hdChhSWR4KSB7XG4gIGlmIChhSWR4ID49IDAgJiYgYUlkeCA8IHRoaXMuX2FycmF5Lmxlbmd0aCkge1xuICAgIHJldHVybiB0aGlzLl9hcnJheVthSWR4XTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVsZW1lbnQgaW5kZXhlZCBieSAnICsgYUlkeCk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgc2V0ICh3aGljaCBoYXMgdGhlIHByb3BlciBpbmRpY2VzXG4gKiBpbmRpY2F0ZWQgYnkgaW5kZXhPZikuIE5vdGUgdGhhdCB0aGlzIGlzIGEgY29weSBvZiB0aGUgaW50ZXJuYWwgYXJyYXkgdXNlZFxuICogZm9yIHN0b3JpbmcgdGhlIG1lbWJlcnMgc28gdGhhdCBubyBvbmUgY2FuIG1lc3Mgd2l0aCBpbnRlcm5hbCBzdGF0ZS5cbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiBBcnJheVNldF90b0FycmF5KCkge1xuICByZXR1cm4gdGhpcy5fYXJyYXkuc2xpY2UoKTtcbn07XG5cbmV4cG9ydHMuQXJyYXlTZXQgPSBBcnJheVNldDtcbiIsImV4cG9ydCBjb25zdCBTSUdOX0NIQU5HRTogQWN0aW9uVHlwZSA9IFwiU0lHTl9DSEFOR0VcIjtcbmV4cG9ydCBjb25zdCBTSUdOX1JFTE9BRDogQWN0aW9uVHlwZSA9IFwiU0lHTl9SRUxPQURcIjtcbmV4cG9ydCBjb25zdCBTSUdOX1JFTE9BREVEOiBBY3Rpb25UeXBlID0gXCJTSUdOX1JFTE9BREVEXCI7XG5leHBvcnQgY29uc3QgU0lHTl9MT0c6IEFjdGlvblR5cGUgPSBcIlNJR05fTE9HXCI7XG5leHBvcnQgY29uc3QgU0lHTl9DT05ORUNUOiBBY3Rpb25UeXBlID0gXCJTSUdOX0NPTk5FQ1RcIjtcblxuZXhwb3J0IGNvbnN0IHNpZ25DaGFuZ2U6IEFjdGlvbkZhY3RvcnkgPSAoeyByZWxvYWRQYWdlID0gdHJ1ZSB9KSA9PiAoe1xuICB0eXBlOiBTSUdOX0NIQU5HRSxcbiAgcGF5bG9hZDogeyByZWxvYWRQYWdlIH1cbn0pO1xuZXhwb3J0IGNvbnN0IHNpZ25SZWxvYWQ6IEFjdGlvbkZhY3RvcnkgPSAoKSA9PiAoeyB0eXBlOiBTSUdOX1JFTE9BRCB9KTtcbmV4cG9ydCBjb25zdCBzaWduUmVsb2FkZWQ6IEFjdGlvbkZhY3RvcnkgPSAobXNnOiBzdHJpbmcpID0+ICh7XG4gIHR5cGU6IFNJR05fUkVMT0FERUQsXG4gIHBheWxvYWQ6IG1zZ1xufSk7XG5leHBvcnQgY29uc3Qgc2lnbkxvZzogQWN0aW9uRmFjdG9yeSA9IChtc2c6IHN0cmluZykgPT4gKHtcbiAgdHlwZTogU0lHTl9MT0csXG4gIHBheWxvYWQ6IG1zZ1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfXzhfXzsiLCIvL1xuLy8gUmVtYXJrOiBSZXF1aXJpbmcgdGhpcyBmaWxlIHdpbGwgdXNlIHRoZSBcInNhZmVcIiBjb2xvcnMgQVBJLFxuLy8gd2hpY2ggd2lsbCBub3QgdG91Y2ggU3RyaW5nLnByb3RvdHlwZS5cbi8vXG4vLyAgIHZhciBjb2xvcnMgPSByZXF1aXJlKCdjb2xvcnMvc2FmZScpO1xuLy8gICBjb2xvcnMucmVkKFwiZm9vXCIpXG4vL1xuLy9cbnZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2xpYi9jb2xvcnMnKTtcbm1vZHVsZVsnZXhwb3J0cyddID0gY29sb3JzO1xuIiwiaW1wb3J0IE1lc3NhZ2UgZnJvbSBcIi4vTWVzc2FnZVwiO1xuaW1wb3J0IHsgV0FSTiB9IGZyb20gXCIuLi9jb25zdGFudHMvbG9nLmNvbnN0YW50c1wiO1xuXG5leHBvcnQgY29uc3Qgb25seU9uRGV2ZWxvcG1lbnRNc2cgPSBuZXcgTWVzc2FnZShcbiAgV0FSTixcbiAgMSxcbiAgXCJXYXJuaW5nLCBDaHJvbWUgRXh0ZW5zaW9uIFJlbG9hZGVyIFBsdWdpbiB3YXMgbm90IGVuYWJsZWQhIEl0IHJ1bnMgb25seSBvbiB3ZWJwYWNrIC0tbW9kZT1kZXZlbG9wbWVudCAodjQgb3IgbW9yZSkgb3Igd2l0aCBOT0RFX0VOVj1kZXZlbG9wbWVudCAobG93ZXIgdmVyc2lvbnMpXCJcbik7XG5cbmV4cG9ydCBjb25zdCBicm93c2VyVmVyV3JvbmdGb3JtYXRNc2cgPSBuZXcgTWVzc2FnZShcbiAgV0FSTixcbiAgMixcbiAgXCJXYXJuaW5nLCBDaHJvbWUgYnJvd3NlciB3aXRoIHVuZXhwZWN0ZWQgdmVyc2lvbiBmb3JtYXQuIEV4cGVjdGVkIHgueC54LngsIFByb3ZpZGVkIDwlPSB2ZXJzaW9uICU+XCJcbik7XG4iLCJpbXBvcnQgeyBJTkZPLCBXQVJOLCBFUlJPUiB9IGZyb20gXCIuLi9jb25zdGFudHMvbG9nLmNvbnN0YW50c1wiO1xuaW1wb3J0IHsgUkVGX1VSTCB9IGZyb20gXCIuLi9jb25zdGFudHMvcmVmZXJlbmNlLWRvY3MuY29uc3RhbnRzXCI7XG5pbXBvcnQgeyB3aGl0ZSwgYm9sZCB9IGZyb20gXCJjb2xvcnMvc2FmZVwiO1xuaW1wb3J0IHsgdGVtcGxhdGUgfSBmcm9tIFwibG9kYXNoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2Uge1xuICBwcml2YXRlIHJlZmVyZW5jZU51bWJlcjogbnVtYmVyO1xuICBwcml2YXRlIHR5cGU6IExPR19JTkZPIHwgTE9HX1dBUk4gfCBMT0dfRVJST1I7XG4gIHByaXZhdGUgbWVzc2FnZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHR5cGUsIHJlZmVyZW5jZU51bWJlciwgbWVzc2FnZSkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5yZWZlcmVuY2VOdW1iZXIgPSByZWZlcmVuY2VOdW1iZXI7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UHJlZml4KCkge1xuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlIElORk86XG4gICAgICAgIHJldHVybiBcIklcIjtcbiAgICAgIGNhc2UgV0FSTjpcbiAgICAgICAgcmV0dXJuIFwiV1wiO1xuICAgICAgY2FzZSBFUlJPUjpcbiAgICAgICAgcmV0dXJuIFwiRVwiO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXQoYWRkaXRpb25hbERhdGE6IG9iamVjdCA9IHt9KSB7XG4gICAgY29uc3QgY29kZSA9IGBXQ0VSLSR7dGhpcy5nZXRQcmVmaXgoKX0ke3RoaXMucmVmZXJlbmNlTnVtYmVyfWA7XG4gICAgY29uc3QgcmVmTGluayA9IGJvbGQod2hpdGUoYCR7UkVGX1VSTH0jJHtjb2RlfWApKTtcbiAgICByZXR1cm4gYFske2NvZGV9XSAke3RlbXBsYXRlKHRoaXMubWVzc2FnZSwgYWRkaXRpb25hbERhdGEpfS5cXG5WaXNpdCAke1xuICAgICAgcmVmTGlua1xuICAgIH0gZm9yIGNvbXBsZXRlIGRldGFpbHNcXG5gO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBERUZBVUxUX1BPUlQgPSA5MDkwO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09ORklHID0gXCJ3ZWJwYWNrLmNvbmZpZy5qc1wiO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUkVMT0FEX1BBR0UgPSB0cnVlO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09OVEVOVF9TQ1JJUFRfRU5UUlkgPSBcImNvbnRlbnQtc2NyaXB0XCI7XG5leHBvcnQgY29uc3QgREVGQVVMVF9CQUNLR1JPVU5EX0VOVFJZID0gXCJiYWNrZ3JvdW5kXCI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fMTRfXzsiLCJ2YXIgU291cmNlTWFwQ29uc3VtZXIgPSByZXF1aXJlKCdzb3VyY2UtbWFwJykuU291cmNlTWFwQ29uc3VtZXI7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxudmFyIGZzO1xudHJ5IHtcbiAgZnMgPSByZXF1aXJlKCdmcycpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMgfHwgIWZzLnJlYWRGaWxlU3luYykge1xuICAgIC8vIGZzIGRvZXNuJ3QgaGF2ZSBhbGwgbWV0aG9kcyB3ZSBuZWVkXG4gICAgZnMgPSBudWxsO1xuICB9XG59IGNhdGNoIChlcnIpIHtcbiAgLyogbm9wICovXG59XG5cbnZhciBidWZmZXJGcm9tID0gcmVxdWlyZSgnYnVmZmVyLWZyb20nKTtcblxuLyoqXG4gKiBSZXF1aXJlcyBhIG1vZHVsZSB3aGljaCBpcyBwcm90ZWN0ZWQgYWdhaW5zdCBidW5kbGVyIG1pbmlmaWNhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge05vZGVNb2R1bGV9IG1vZFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RcbiAqL1xuZnVuY3Rpb24gZHluYW1pY1JlcXVpcmUobW9kLCByZXF1ZXN0KSB7XG4gIHJldHVybiBtb2QucmVxdWlyZShyZXF1ZXN0KTtcbn1cblxuLy8gT25seSBpbnN0YWxsIG9uY2UgaWYgY2FsbGVkIG11bHRpcGxlIHRpbWVzXG52YXIgZXJyb3JGb3JtYXR0ZXJJbnN0YWxsZWQgPSBmYWxzZTtcbnZhciB1bmNhdWdodFNoaW1JbnN0YWxsZWQgPSBmYWxzZTtcblxuLy8gSWYgdHJ1ZSwgdGhlIGNhY2hlcyBhcmUgcmVzZXQgYmVmb3JlIGEgc3RhY2sgdHJhY2UgZm9ybWF0dGluZyBvcGVyYXRpb25cbnZhciBlbXB0eUNhY2hlQmV0d2Vlbk9wZXJhdGlvbnMgPSBmYWxzZTtcblxuLy8gU3VwcG9ydHMge2Jyb3dzZXIsIG5vZGUsIGF1dG99XG52YXIgZW52aXJvbm1lbnQgPSBcImF1dG9cIjtcblxuLy8gTWFwcyBhIGZpbGUgcGF0aCB0byBhIHN0cmluZyBjb250YWluaW5nIHRoZSBmaWxlIGNvbnRlbnRzXG52YXIgZmlsZUNvbnRlbnRzQ2FjaGUgPSB7fTtcblxuLy8gTWFwcyBhIGZpbGUgcGF0aCB0byBhIHNvdXJjZSBtYXAgZm9yIHRoYXQgZmlsZVxudmFyIHNvdXJjZU1hcENhY2hlID0ge307XG5cbi8vIFJlZ2V4IGZvciBkZXRlY3Rpbmcgc291cmNlIG1hcHNcbnZhciByZVNvdXJjZU1hcCA9IC9eZGF0YTphcHBsaWNhdGlvblxcL2pzb25bXixdK2Jhc2U2NCwvO1xuXG4vLyBQcmlvcml0eSBsaXN0IG9mIHJldHJpZXZlIGhhbmRsZXJzXG52YXIgcmV0cmlldmVGaWxlSGFuZGxlcnMgPSBbXTtcbnZhciByZXRyaWV2ZU1hcEhhbmRsZXJzID0gW107XG5cbmZ1bmN0aW9uIGlzSW5Ccm93c2VyKCkge1xuICBpZiAoZW52aXJvbm1lbnQgPT09IFwiYnJvd3NlclwiKVxuICAgIHJldHVybiB0cnVlO1xuICBpZiAoZW52aXJvbm1lbnQgPT09IFwibm9kZVwiKVxuICAgIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuICgodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpICYmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09ICdmdW5jdGlvbicpICYmICEod2luZG93LnJlcXVpcmUgJiYgd2luZG93Lm1vZHVsZSAmJiB3aW5kb3cucHJvY2VzcyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSBcInJlbmRlcmVyXCIpKTtcbn1cblxuZnVuY3Rpb24gaGFzR2xvYmFsUHJvY2Vzc0V2ZW50RW1pdHRlcigpIHtcbiAgcmV0dXJuICgodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnKSAmJiAocHJvY2VzcyAhPT0gbnVsbCkgJiYgKHR5cGVvZiBwcm9jZXNzLm9uID09PSAnZnVuY3Rpb24nKSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZXJFeGVjKGxpc3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJldCA9IGxpc3RbaV0oYXJnKTtcbiAgICAgIGlmIChyZXQpIHtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59XG5cbnZhciByZXRyaWV2ZUZpbGUgPSBoYW5kbGVyRXhlYyhyZXRyaWV2ZUZpbGVIYW5kbGVycyk7XG5cbnJldHJpZXZlRmlsZUhhbmRsZXJzLnB1c2goZnVuY3Rpb24ocGF0aCkge1xuICAvLyBUcmltIHRoZSBwYXRoIHRvIG1ha2Ugc3VyZSB0aGVyZSBpcyBubyBleHRyYSB3aGl0ZXNwYWNlLlxuICBwYXRoID0gcGF0aC50cmltKCk7XG4gIGlmICgvXmZpbGU6Ly50ZXN0KHBhdGgpKSB7XG4gICAgLy8gZXhpc3RzU3luYy9yZWFkRmlsZVN5bmMgY2FuJ3QgaGFuZGxlIGZpbGUgcHJvdG9jb2wsIGJ1dCBvbmNlIHN0cmlwcGVkLCBpdCB3b3Jrc1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL2ZpbGU6XFwvXFwvXFwvKFxcdzopPy8sIGZ1bmN0aW9uKHByb3RvY29sLCBkcml2ZSkge1xuICAgICAgcmV0dXJuIGRyaXZlID9cbiAgICAgICAgJycgOiAvLyBmaWxlOi8vL0M6L2Rpci9maWxlIC0+IEM6L2Rpci9maWxlXG4gICAgICAgICcvJzsgLy8gZmlsZTovLy9yb290LWRpci9maWxlIC0+IC9yb290LWRpci9maWxlXG4gICAgfSk7XG4gIH1cbiAgaWYgKHBhdGggaW4gZmlsZUNvbnRlbnRzQ2FjaGUpIHtcbiAgICByZXR1cm4gZmlsZUNvbnRlbnRzQ2FjaGVbcGF0aF07XG4gIH1cblxuICB2YXIgY29udGVudHMgPSAnJztcbiAgdHJ5IHtcbiAgICBpZiAoIWZzKSB7XG4gICAgICAvLyBVc2UgU0pBWCBpZiB3ZSBhcmUgaW4gdGhlIGJyb3dzZXJcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vcGVuKCdHRVQnLCBwYXRoLCAvKiogYXN5bmMgKi8gZmFsc2UpO1xuICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIGNvbnRlbnRzID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZzLmV4aXN0c1N5bmMocGF0aCkpIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgdXNlIHRoZSBmaWxlc3lzdGVtXG4gICAgICBjb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLCAndXRmOCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXIpIHtcbiAgICAvKiBpZ25vcmUgYW55IGVycm9ycyAqL1xuICB9XG5cbiAgcmV0dXJuIGZpbGVDb250ZW50c0NhY2hlW3BhdGhdID0gY29udGVudHM7XG59KTtcblxuLy8gU3VwcG9ydCBVUkxzIHJlbGF0aXZlIHRvIGEgZGlyZWN0b3J5LCBidXQgYmUgY2FyZWZ1bCBhYm91dCBhIHByb3RvY29sIHByZWZpeFxuLy8gaW4gY2FzZSB3ZSBhcmUgaW4gdGhlIGJyb3dzZXIgKGkuZS4gZGlyZWN0b3JpZXMgbWF5IHN0YXJ0IHdpdGggXCJodHRwOi8vXCIgb3IgXCJmaWxlOi8vL1wiKVxuZnVuY3Rpb24gc3VwcG9ydFJlbGF0aXZlVVJMKGZpbGUsIHVybCkge1xuICBpZiAoIWZpbGUpIHJldHVybiB1cmw7XG4gIHZhciBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZSk7XG4gIHZhciBtYXRjaCA9IC9eXFx3KzpcXC9cXC9bXlxcL10qLy5leGVjKGRpcik7XG4gIHZhciBwcm90b2NvbCA9IG1hdGNoID8gbWF0Y2hbMF0gOiAnJztcbiAgdmFyIHN0YXJ0UGF0aCA9IGRpci5zbGljZShwcm90b2NvbC5sZW5ndGgpO1xuICBpZiAocHJvdG9jb2wgJiYgL15cXC9cXHdcXDovLnRlc3Qoc3RhcnRQYXRoKSkge1xuICAgIC8vIGhhbmRsZSBmaWxlOi8vL0M6LyBwYXRoc1xuICAgIHByb3RvY29sICs9ICcvJztcbiAgICByZXR1cm4gcHJvdG9jb2wgKyBwYXRoLnJlc29sdmUoZGlyLnNsaWNlKHByb3RvY29sLmxlbmd0aCksIHVybCkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICB9XG4gIHJldHVybiBwcm90b2NvbCArIHBhdGgucmVzb2x2ZShkaXIuc2xpY2UocHJvdG9jb2wubGVuZ3RoKSwgdXJsKTtcbn1cblxuZnVuY3Rpb24gcmV0cmlldmVTb3VyY2VNYXBVUkwoc291cmNlKSB7XG4gIHZhciBmaWxlRGF0YTtcblxuICBpZiAoaXNJbkJyb3dzZXIoKSkge1xuICAgICB0cnkge1xuICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICB4aHIub3BlbignR0VUJywgc291cmNlLCBmYWxzZSk7XG4gICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICAgZmlsZURhdGEgPSB4aHIucmVhZHlTdGF0ZSA9PT0gNCA/IHhoci5yZXNwb25zZVRleHQgOiBudWxsO1xuXG4gICAgICAgLy8gU3VwcG9ydCBwcm92aWRpbmcgYSBzb3VyY2VNYXBwaW5nVVJMIHZpYSB0aGUgU291cmNlTWFwIGhlYWRlclxuICAgICAgIHZhciBzb3VyY2VNYXBIZWFkZXIgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJTb3VyY2VNYXBcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiWC1Tb3VyY2VNYXBcIik7XG4gICAgICAgaWYgKHNvdXJjZU1hcEhlYWRlcikge1xuICAgICAgICAgcmV0dXJuIHNvdXJjZU1hcEhlYWRlcjtcbiAgICAgICB9XG4gICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgfVxuICB9XG5cbiAgLy8gR2V0IHRoZSBVUkwgb2YgdGhlIHNvdXJjZSBtYXBcbiAgZmlsZURhdGEgPSByZXRyaWV2ZUZpbGUoc291cmNlKTtcbiAgdmFyIHJlID0gLyg/OlxcL1xcL1tAI11bXFxzXSpzb3VyY2VNYXBwaW5nVVJMPShbXlxccydcIl0rKVtcXHNdKiQpfCg/OlxcL1xcKltAI11bXFxzXSpzb3VyY2VNYXBwaW5nVVJMPShbXlxccyonXCJdKylbXFxzXSooPzpcXCpcXC8pW1xcc10qJCkvbWc7XG4gIC8vIEtlZXAgZXhlY3V0aW5nIHRoZSBzZWFyY2ggdG8gZmluZCB0aGUgKmxhc3QqIHNvdXJjZU1hcHBpbmdVUkwgdG8gYXZvaWRcbiAgLy8gcGlja2luZyB1cCBzb3VyY2VNYXBwaW5nVVJMcyBmcm9tIGNvbW1lbnRzLCBzdHJpbmdzLCBldGMuXG4gIHZhciBsYXN0TWF0Y2gsIG1hdGNoO1xuICB3aGlsZSAobWF0Y2ggPSByZS5leGVjKGZpbGVEYXRhKSkgbGFzdE1hdGNoID0gbWF0Y2g7XG4gIGlmICghbGFzdE1hdGNoKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGxhc3RNYXRjaFsxXTtcbn07XG5cbi8vIENhbiBiZSBvdmVycmlkZGVuIGJ5IHRoZSByZXRyaWV2ZVNvdXJjZU1hcCBvcHRpb24gdG8gaW5zdGFsbC4gVGFrZXMgYVxuLy8gZ2VuZXJhdGVkIHNvdXJjZSBmaWxlbmFtZTsgcmV0dXJucyBhIHttYXAsIG9wdGlvbmFsIHVybH0gb2JqZWN0LCBvciBudWxsIGlmXG4vLyB0aGVyZSBpcyBubyBzb3VyY2UgbWFwLiAgVGhlIG1hcCBmaWVsZCBtYXkgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIHRoZSBwYXJzZWRcbi8vIEpTT04gb2JqZWN0IChpZSwgaXQgbXVzdCBiZSBhIHZhbGlkIGFyZ3VtZW50IHRvIHRoZSBTb3VyY2VNYXBDb25zdW1lclxuLy8gY29uc3RydWN0b3IpLlxudmFyIHJldHJpZXZlU291cmNlTWFwID0gaGFuZGxlckV4ZWMocmV0cmlldmVNYXBIYW5kbGVycyk7XG5yZXRyaWV2ZU1hcEhhbmRsZXJzLnB1c2goZnVuY3Rpb24oc291cmNlKSB7XG4gIHZhciBzb3VyY2VNYXBwaW5nVVJMID0gcmV0cmlldmVTb3VyY2VNYXBVUkwoc291cmNlKTtcbiAgaWYgKCFzb3VyY2VNYXBwaW5nVVJMKSByZXR1cm4gbnVsbDtcblxuICAvLyBSZWFkIHRoZSBjb250ZW50cyBvZiB0aGUgc291cmNlIG1hcFxuICB2YXIgc291cmNlTWFwRGF0YTtcbiAgaWYgKHJlU291cmNlTWFwLnRlc3Qoc291cmNlTWFwcGluZ1VSTCkpIHtcbiAgICAvLyBTdXBwb3J0IHNvdXJjZSBtYXAgVVJMIGFzIGEgZGF0YSB1cmxcbiAgICB2YXIgcmF3RGF0YSA9IHNvdXJjZU1hcHBpbmdVUkwuc2xpY2Uoc291cmNlTWFwcGluZ1VSTC5pbmRleE9mKCcsJykgKyAxKTtcbiAgICBzb3VyY2VNYXBEYXRhID0gYnVmZmVyRnJvbShyYXdEYXRhLCBcImJhc2U2NFwiKS50b1N0cmluZygpO1xuICAgIHNvdXJjZU1hcHBpbmdVUkwgPSBzb3VyY2U7XG4gIH0gZWxzZSB7XG4gICAgLy8gU3VwcG9ydCBzb3VyY2UgbWFwIFVSTHMgcmVsYXRpdmUgdG8gdGhlIHNvdXJjZSBVUkxcbiAgICBzb3VyY2VNYXBwaW5nVVJMID0gc3VwcG9ydFJlbGF0aXZlVVJMKHNvdXJjZSwgc291cmNlTWFwcGluZ1VSTCk7XG4gICAgc291cmNlTWFwRGF0YSA9IHJldHJpZXZlRmlsZShzb3VyY2VNYXBwaW5nVVJMKTtcbiAgfVxuXG4gIGlmICghc291cmNlTWFwRGF0YSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB1cmw6IHNvdXJjZU1hcHBpbmdVUkwsXG4gICAgbWFwOiBzb3VyY2VNYXBEYXRhXG4gIH07XG59KTtcblxuZnVuY3Rpb24gbWFwU291cmNlUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgdmFyIHNvdXJjZU1hcCA9IHNvdXJjZU1hcENhY2hlW3Bvc2l0aW9uLnNvdXJjZV07XG4gIGlmICghc291cmNlTWFwKSB7XG4gICAgLy8gQ2FsbCB0aGUgKG92ZXJyaWRlYWJsZSkgcmV0cmlldmVTb3VyY2VNYXAgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzb3VyY2UgbWFwLlxuICAgIHZhciB1cmxBbmRNYXAgPSByZXRyaWV2ZVNvdXJjZU1hcChwb3NpdGlvbi5zb3VyY2UpO1xuICAgIGlmICh1cmxBbmRNYXApIHtcbiAgICAgIHNvdXJjZU1hcCA9IHNvdXJjZU1hcENhY2hlW3Bvc2l0aW9uLnNvdXJjZV0gPSB7XG4gICAgICAgIHVybDogdXJsQW5kTWFwLnVybCxcbiAgICAgICAgbWFwOiBuZXcgU291cmNlTWFwQ29uc3VtZXIodXJsQW5kTWFwLm1hcClcbiAgICAgIH07XG5cbiAgICAgIC8vIExvYWQgYWxsIHNvdXJjZXMgc3RvcmVkIGlubGluZSB3aXRoIHRoZSBzb3VyY2UgbWFwIGludG8gdGhlIGZpbGUgY2FjaGVcbiAgICAgIC8vIHRvIHByZXRlbmQgbGlrZSB0aGV5IGFyZSBhbHJlYWR5IGxvYWRlZC4gVGhleSBtYXkgbm90IGV4aXN0IG9uIGRpc2suXG4gICAgICBpZiAoc291cmNlTWFwLm1hcC5zb3VyY2VzQ29udGVudCkge1xuICAgICAgICBzb3VyY2VNYXAubWFwLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UsIGkpIHtcbiAgICAgICAgICB2YXIgY29udGVudHMgPSBzb3VyY2VNYXAubWFwLnNvdXJjZXNDb250ZW50W2ldO1xuICAgICAgICAgIGlmIChjb250ZW50cykge1xuICAgICAgICAgICAgdmFyIHVybCA9IHN1cHBvcnRSZWxhdGl2ZVVSTChzb3VyY2VNYXAudXJsLCBzb3VyY2UpO1xuICAgICAgICAgICAgZmlsZUNvbnRlbnRzQ2FjaGVbdXJsXSA9IGNvbnRlbnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvdXJjZU1hcCA9IHNvdXJjZU1hcENhY2hlW3Bvc2l0aW9uLnNvdXJjZV0gPSB7XG4gICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgbWFwOiBudWxsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlc29sdmUgdGhlIHNvdXJjZSBVUkwgcmVsYXRpdmUgdG8gdGhlIFVSTCBvZiB0aGUgc291cmNlIG1hcFxuICBpZiAoc291cmNlTWFwICYmIHNvdXJjZU1hcC5tYXAgJiYgdHlwZW9mIHNvdXJjZU1hcC5tYXAub3JpZ2luYWxQb3NpdGlvbkZvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBvcmlnaW5hbFBvc2l0aW9uID0gc291cmNlTWFwLm1hcC5vcmlnaW5hbFBvc2l0aW9uRm9yKHBvc2l0aW9uKTtcblxuICAgIC8vIE9ubHkgcmV0dXJuIHRoZSBvcmlnaW5hbCBwb3NpdGlvbiBpZiBhIG1hdGNoaW5nIGxpbmUgd2FzIGZvdW5kLiBJZiBub1xuICAgIC8vIG1hdGNoaW5nIGxpbmUgaXMgZm91bmQgdGhlbiB3ZSByZXR1cm4gcG9zaXRpb24gaW5zdGVhZCwgd2hpY2ggd2lsbCBjYXVzZVxuICAgIC8vIHRoZSBzdGFjayB0cmFjZSB0byBwcmludCB0aGUgcGF0aCBhbmQgbGluZSBmb3IgdGhlIGNvbXBpbGVkIGZpbGUuIEl0IGlzXG4gICAgLy8gYmV0dGVyIHRvIGdpdmUgYSBwcmVjaXNlIGxvY2F0aW9uIGluIHRoZSBjb21waWxlZCBmaWxlIHRoYW4gYSB2YWd1ZVxuICAgIC8vIGxvY2F0aW9uIGluIHRoZSBvcmlnaW5hbCBmaWxlLlxuICAgIGlmIChvcmlnaW5hbFBvc2l0aW9uLnNvdXJjZSAhPT0gbnVsbCkge1xuICAgICAgb3JpZ2luYWxQb3NpdGlvbi5zb3VyY2UgPSBzdXBwb3J0UmVsYXRpdmVVUkwoXG4gICAgICAgIHNvdXJjZU1hcC51cmwsIG9yaWdpbmFsUG9zaXRpb24uc291cmNlKTtcbiAgICAgIHJldHVybiBvcmlnaW5hbFBvc2l0aW9uO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwb3NpdGlvbjtcbn1cblxuLy8gUGFyc2VzIGNvZGUgZ2VuZXJhdGVkIGJ5IEZvcm1hdEV2YWxPcmlnaW4oKSwgYSBmdW5jdGlvbiBpbnNpZGUgVjg6XG4vLyBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L3NvdXJjZS9icm93c2UvdHJ1bmsvc3JjL21lc3NhZ2VzLmpzXG5mdW5jdGlvbiBtYXBFdmFsT3JpZ2luKG9yaWdpbikge1xuICAvLyBNb3N0IGV2YWwoKSBjYWxscyBhcmUgaW4gdGhpcyBmb3JtYXRcbiAgdmFyIG1hdGNoID0gL15ldmFsIGF0IChbXihdKykgXFwoKC4rKTooXFxkKyk6KFxcZCspXFwpJC8uZXhlYyhvcmlnaW4pO1xuICBpZiAobWF0Y2gpIHtcbiAgICB2YXIgcG9zaXRpb24gPSBtYXBTb3VyY2VQb3NpdGlvbih7XG4gICAgICBzb3VyY2U6IG1hdGNoWzJdLFxuICAgICAgbGluZTogK21hdGNoWzNdLFxuICAgICAgY29sdW1uOiBtYXRjaFs0XSAtIDFcbiAgICB9KTtcbiAgICByZXR1cm4gJ2V2YWwgYXQgJyArIG1hdGNoWzFdICsgJyAoJyArIHBvc2l0aW9uLnNvdXJjZSArICc6JyArXG4gICAgICBwb3NpdGlvbi5saW5lICsgJzonICsgKHBvc2l0aW9uLmNvbHVtbiArIDEpICsgJyknO1xuICB9XG5cbiAgLy8gUGFyc2UgbmVzdGVkIGV2YWwoKSBjYWxscyB1c2luZyByZWN1cnNpb25cbiAgbWF0Y2ggPSAvXmV2YWwgYXQgKFteKF0rKSBcXCgoLispXFwpJC8uZXhlYyhvcmlnaW4pO1xuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gJ2V2YWwgYXQgJyArIG1hdGNoWzFdICsgJyAoJyArIG1hcEV2YWxPcmlnaW4obWF0Y2hbMl0pICsgJyknO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIHdlIHN0aWxsIHJldHVybiB1c2VmdWwgaW5mb3JtYXRpb24gaWYgd2UgZGlkbid0IGZpbmQgYW55dGhpbmdcbiAgcmV0dXJuIG9yaWdpbjtcbn1cblxuLy8gVGhpcyBpcyBjb3BpZWQgYWxtb3N0IHZlcmJhdGltIGZyb20gdGhlIFY4IHNvdXJjZSBjb2RlIGF0XG4vLyBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L3NvdXJjZS9icm93c2UvdHJ1bmsvc3JjL21lc3NhZ2VzLmpzLiBUaGVcbi8vIGltcGxlbWVudGF0aW9uIG9mIHdyYXBDYWxsU2l0ZSgpIHVzZWQgdG8ganVzdCBmb3J3YXJkIHRvIHRoZSBhY3R1YWwgc291cmNlXG4vLyBjb2RlIG9mIENhbGxTaXRlLnByb3RvdHlwZS50b1N0cmluZyBidXQgdW5mb3J0dW5hdGVseSBhIG5ldyByZWxlYXNlIG9mIFY4XG4vLyBkaWQgc29tZXRoaW5nIHRvIHRoZSBwcm90b3R5cGUgY2hhaW4gYW5kIGJyb2tlIHRoZSBzaGltLiBUaGUgb25seSBmaXggSVxuLy8gY291bGQgZmluZCB3YXMgY29weS9wYXN0ZS5cbmZ1bmN0aW9uIENhbGxTaXRlVG9TdHJpbmcoKSB7XG4gIHZhciBmaWxlTmFtZTtcbiAgdmFyIGZpbGVMb2NhdGlvbiA9IFwiXCI7XG4gIGlmICh0aGlzLmlzTmF0aXZlKCkpIHtcbiAgICBmaWxlTG9jYXRpb24gPSBcIm5hdGl2ZVwiO1xuICB9IGVsc2Uge1xuICAgIGZpbGVOYW1lID0gdGhpcy5nZXRTY3JpcHROYW1lT3JTb3VyY2VVUkwoKTtcbiAgICBpZiAoIWZpbGVOYW1lICYmIHRoaXMuaXNFdmFsKCkpIHtcbiAgICAgIGZpbGVMb2NhdGlvbiA9IHRoaXMuZ2V0RXZhbE9yaWdpbigpO1xuICAgICAgZmlsZUxvY2F0aW9uICs9IFwiLCBcIjsgIC8vIEV4cGVjdGluZyBzb3VyY2UgcG9zaXRpb24gdG8gZm9sbG93LlxuICAgIH1cblxuICAgIGlmIChmaWxlTmFtZSkge1xuICAgICAgZmlsZUxvY2F0aW9uICs9IGZpbGVOYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb3VyY2UgY29kZSBkb2VzIG5vdCBvcmlnaW5hdGUgZnJvbSBhIGZpbGUgYW5kIGlzIG5vdCBuYXRpdmUsIGJ1dCB3ZVxuICAgICAgLy8gY2FuIHN0aWxsIGdldCB0aGUgc291cmNlIHBvc2l0aW9uIGluc2lkZSB0aGUgc291cmNlIHN0cmluZywgZS5nLiBpblxuICAgICAgLy8gYW4gZXZhbCBzdHJpbmcuXG4gICAgICBmaWxlTG9jYXRpb24gKz0gXCI8YW5vbnltb3VzPlwiO1xuICAgIH1cbiAgICB2YXIgbGluZU51bWJlciA9IHRoaXMuZ2V0TGluZU51bWJlcigpO1xuICAgIGlmIChsaW5lTnVtYmVyICE9IG51bGwpIHtcbiAgICAgIGZpbGVMb2NhdGlvbiArPSBcIjpcIiArIGxpbmVOdW1iZXI7XG4gICAgICB2YXIgY29sdW1uTnVtYmVyID0gdGhpcy5nZXRDb2x1bW5OdW1iZXIoKTtcbiAgICAgIGlmIChjb2x1bW5OdW1iZXIpIHtcbiAgICAgICAgZmlsZUxvY2F0aW9uICs9IFwiOlwiICsgY29sdW1uTnVtYmVyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBsaW5lID0gXCJcIjtcbiAgdmFyIGZ1bmN0aW9uTmFtZSA9IHRoaXMuZ2V0RnVuY3Rpb25OYW1lKCk7XG4gIHZhciBhZGRTdWZmaXggPSB0cnVlO1xuICB2YXIgaXNDb25zdHJ1Y3RvciA9IHRoaXMuaXNDb25zdHJ1Y3RvcigpO1xuICB2YXIgaXNNZXRob2RDYWxsID0gISh0aGlzLmlzVG9wbGV2ZWwoKSB8fCBpc0NvbnN0cnVjdG9yKTtcbiAgaWYgKGlzTWV0aG9kQ2FsbCkge1xuICAgIHZhciB0eXBlTmFtZSA9IHRoaXMuZ2V0VHlwZU5hbWUoKTtcbiAgICAvLyBGaXhlcyBzaGltIHRvIGJlIGJhY2t3YXJkIGNvbXBhdGFibGUgd2l0aCBOb2RlIHYwIHRvIHY0XG4gICAgaWYgKHR5cGVOYW1lID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICB0eXBlTmFtZSA9IFwibnVsbFwiO1xuICAgIH1cbiAgICB2YXIgbWV0aG9kTmFtZSA9IHRoaXMuZ2V0TWV0aG9kTmFtZSgpO1xuICAgIGlmIChmdW5jdGlvbk5hbWUpIHtcbiAgICAgIGlmICh0eXBlTmFtZSAmJiBmdW5jdGlvbk5hbWUuaW5kZXhPZih0eXBlTmFtZSkgIT0gMCkge1xuICAgICAgICBsaW5lICs9IHR5cGVOYW1lICsgXCIuXCI7XG4gICAgICB9XG4gICAgICBsaW5lICs9IGZ1bmN0aW9uTmFtZTtcbiAgICAgIGlmIChtZXRob2ROYW1lICYmIGZ1bmN0aW9uTmFtZS5pbmRleE9mKFwiLlwiICsgbWV0aG9kTmFtZSkgIT0gZnVuY3Rpb25OYW1lLmxlbmd0aCAtIG1ldGhvZE5hbWUubGVuZ3RoIC0gMSkge1xuICAgICAgICBsaW5lICs9IFwiIFthcyBcIiArIG1ldGhvZE5hbWUgKyBcIl1cIjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGluZSArPSB0eXBlTmFtZSArIFwiLlwiICsgKG1ldGhvZE5hbWUgfHwgXCI8YW5vbnltb3VzPlwiKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNDb25zdHJ1Y3Rvcikge1xuICAgIGxpbmUgKz0gXCJuZXcgXCIgKyAoZnVuY3Rpb25OYW1lIHx8IFwiPGFub255bW91cz5cIik7XG4gIH0gZWxzZSBpZiAoZnVuY3Rpb25OYW1lKSB7XG4gICAgbGluZSArPSBmdW5jdGlvbk5hbWU7XG4gIH0gZWxzZSB7XG4gICAgbGluZSArPSBmaWxlTG9jYXRpb247XG4gICAgYWRkU3VmZml4ID0gZmFsc2U7XG4gIH1cbiAgaWYgKGFkZFN1ZmZpeCkge1xuICAgIGxpbmUgKz0gXCIgKFwiICsgZmlsZUxvY2F0aW9uICsgXCIpXCI7XG4gIH1cbiAgcmV0dXJuIGxpbmU7XG59XG5cbmZ1bmN0aW9uIGNsb25lQ2FsbFNpdGUoZnJhbWUpIHtcbiAgdmFyIG9iamVjdCA9IHt9O1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPYmplY3QuZ2V0UHJvdG90eXBlT2YoZnJhbWUpKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBvYmplY3RbbmFtZV0gPSAvXig/OmlzfGdldCkvLnRlc3QobmFtZSkgPyBmdW5jdGlvbigpIHsgcmV0dXJuIGZyYW1lW25hbWVdLmNhbGwoZnJhbWUpOyB9IDogZnJhbWVbbmFtZV07XG4gIH0pO1xuICBvYmplY3QudG9TdHJpbmcgPSBDYWxsU2l0ZVRvU3RyaW5nO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbFNpdGUoZnJhbWUsIHN0YXRlKSB7XG4gIC8vIHByb3ZpZGVzIGludGVyZmFjZSBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhdGUgPSB7IG5leHRQb3NpdGlvbjogbnVsbCwgY3VyUG9zaXRpb246IG51bGwgfVxuICB9XG4gIGlmKGZyYW1lLmlzTmF0aXZlKCkpIHtcbiAgICBzdGF0ZS5jdXJQb3NpdGlvbiA9IG51bGw7XG4gICAgcmV0dXJuIGZyYW1lO1xuICB9XG5cbiAgLy8gTW9zdCBjYWxsIHNpdGVzIHdpbGwgcmV0dXJuIHRoZSBzb3VyY2UgZmlsZSBmcm9tIGdldEZpbGVOYW1lKCksIGJ1dCBjb2RlXG4gIC8vIHBhc3NlZCB0byBldmFsKCkgZW5kaW5nIGluIFwiLy8jIHNvdXJjZVVSTD0uLi5cIiB3aWxsIHJldHVybiB0aGUgc291cmNlIGZpbGVcbiAgLy8gZnJvbSBnZXRTY3JpcHROYW1lT3JTb3VyY2VVUkwoKSBpbnN0ZWFkXG4gIHZhciBzb3VyY2UgPSBmcmFtZS5nZXRGaWxlTmFtZSgpIHx8IGZyYW1lLmdldFNjcmlwdE5hbWVPclNvdXJjZVVSTCgpO1xuICBpZiAoc291cmNlKSB7XG4gICAgdmFyIGxpbmUgPSBmcmFtZS5nZXRMaW5lTnVtYmVyKCk7XG4gICAgdmFyIGNvbHVtbiA9IGZyYW1lLmdldENvbHVtbk51bWJlcigpIC0gMTtcblxuICAgIC8vIEZpeCBwb3NpdGlvbiBpbiBOb2RlIHdoZXJlIHNvbWUgKGludGVybmFsKSBjb2RlIGlzIHByZXBlbmRlZC5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2V2YW53L25vZGUtc291cmNlLW1hcC1zdXBwb3J0L2lzc3Vlcy8zNlxuICAgIC8vIEhlYWRlciByZW1vdmVkIGluIG5vZGUgYXQgXjEwLjE2IHx8ID49MTEuMTEuMFxuICAgIC8vIHYxMSBpcyBub3QgYW4gTFRTIGNhbmRpZGF0ZSwgd2UgY2FuIGp1c3QgdGVzdCB0aGUgb25lIHZlcnNpb24gd2l0aCBpdC5cbiAgICAvLyBUZXN0IG5vZGUgdmVyc2lvbnMgZm9yOiAxMC4xNi0xOSwgMTAuMjArLCAxMi0xOSwgMjAtOTksIDEwMCssIG9yIDExLjExXG4gICAgdmFyIG5vSGVhZGVyID0gL152KDEwXFwuMVs2LTldfDEwXFwuWzItOV1bMC05XXwxMFxcLlswLTldezMsfXwxWzItOV1cXGQqfFsyLTldXFxkfFxcZHszLH18MTFcXC4xMSkvO1xuICAgIHZhciBoZWFkZXJMZW5ndGggPSBub0hlYWRlci50ZXN0KHByb2Nlc3MudmVyc2lvbikgPyAwIDogNjI7XG4gICAgaWYgKGxpbmUgPT09IDEgJiYgY29sdW1uID4gaGVhZGVyTGVuZ3RoICYmICFpc0luQnJvd3NlcigpICYmICFmcmFtZS5pc0V2YWwoKSkge1xuICAgICAgY29sdW1uIC09IGhlYWRlckxlbmd0aDtcbiAgICB9XG5cbiAgICB2YXIgcG9zaXRpb24gPSBtYXBTb3VyY2VQb3NpdGlvbih7XG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIGxpbmU6IGxpbmUsXG4gICAgICBjb2x1bW46IGNvbHVtblxuICAgIH0pO1xuICAgIHN0YXRlLmN1clBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgZnJhbWUgPSBjbG9uZUNhbGxTaXRlKGZyYW1lKTtcbiAgICB2YXIgb3JpZ2luYWxGdW5jdGlvbk5hbWUgPSBmcmFtZS5nZXRGdW5jdGlvbk5hbWU7XG4gICAgZnJhbWUuZ2V0RnVuY3Rpb25OYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc3RhdGUubmV4dFBvc2l0aW9uID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb25OYW1lKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdGUubmV4dFBvc2l0aW9uLm5hbWUgfHwgb3JpZ2luYWxGdW5jdGlvbk5hbWUoKTtcbiAgICB9O1xuICAgIGZyYW1lLmdldEZpbGVOYW1lID0gZnVuY3Rpb24oKSB7IHJldHVybiBwb3NpdGlvbi5zb3VyY2U7IH07XG4gICAgZnJhbWUuZ2V0TGluZU51bWJlciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gcG9zaXRpb24ubGluZTsgfTtcbiAgICBmcmFtZS5nZXRDb2x1bW5OdW1iZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHBvc2l0aW9uLmNvbHVtbiArIDE7IH07XG4gICAgZnJhbWUuZ2V0U2NyaXB0TmFtZU9yU291cmNlVVJMID0gZnVuY3Rpb24oKSB7IHJldHVybiBwb3NpdGlvbi5zb3VyY2U7IH07XG4gICAgcmV0dXJuIGZyYW1lO1xuICB9XG5cbiAgLy8gQ29kZSBjYWxsZWQgdXNpbmcgZXZhbCgpIG5lZWRzIHNwZWNpYWwgaGFuZGxpbmdcbiAgdmFyIG9yaWdpbiA9IGZyYW1lLmlzRXZhbCgpICYmIGZyYW1lLmdldEV2YWxPcmlnaW4oKTtcbiAgaWYgKG9yaWdpbikge1xuICAgIG9yaWdpbiA9IG1hcEV2YWxPcmlnaW4ob3JpZ2luKTtcbiAgICBmcmFtZSA9IGNsb25lQ2FsbFNpdGUoZnJhbWUpO1xuICAgIGZyYW1lLmdldEV2YWxPcmlnaW4gPSBmdW5jdGlvbigpIHsgcmV0dXJuIG9yaWdpbjsgfTtcbiAgICByZXR1cm4gZnJhbWU7XG4gIH1cblxuICAvLyBJZiB3ZSBnZXQgaGVyZSB0aGVuIHdlIHdlcmUgdW5hYmxlIHRvIGNoYW5nZSB0aGUgc291cmNlIHBvc2l0aW9uXG4gIHJldHVybiBmcmFtZTtcbn1cblxuLy8gVGhpcyBmdW5jdGlvbiBpcyBwYXJ0IG9mIHRoZSBWOCBzdGFjayB0cmFjZSBBUEksIGZvciBtb3JlIGluZm8gc2VlOlxuLy8gaHR0cHM6Ly92OC5kZXYvZG9jcy9zdGFjay10cmFjZS1hcGlcbmZ1bmN0aW9uIHByZXBhcmVTdGFja1RyYWNlKGVycm9yLCBzdGFjaykge1xuICBpZiAoZW1wdHlDYWNoZUJldHdlZW5PcGVyYXRpb25zKSB7XG4gICAgZmlsZUNvbnRlbnRzQ2FjaGUgPSB7fTtcbiAgICBzb3VyY2VNYXBDYWNoZSA9IHt9O1xuICB9XG5cbiAgdmFyIG5hbWUgPSBlcnJvci5uYW1lIHx8ICdFcnJvcic7XG4gIHZhciBtZXNzYWdlID0gZXJyb3IubWVzc2FnZSB8fCAnJztcbiAgdmFyIGVycm9yU3RyaW5nID0gbmFtZSArIFwiOiBcIiArIG1lc3NhZ2U7XG5cbiAgdmFyIHN0YXRlID0geyBuZXh0UG9zaXRpb246IG51bGwsIGN1clBvc2l0aW9uOiBudWxsIH07XG4gIHZhciBwcm9jZXNzZWRTdGFjayA9IFtdO1xuICBmb3IgKHZhciBpID0gc3RhY2subGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBwcm9jZXNzZWRTdGFjay5wdXNoKCdcXG4gICAgYXQgJyArIHdyYXBDYWxsU2l0ZShzdGFja1tpXSwgc3RhdGUpKTtcbiAgICBzdGF0ZS5uZXh0UG9zaXRpb24gPSBzdGF0ZS5jdXJQb3NpdGlvbjtcbiAgfVxuICBzdGF0ZS5jdXJQb3NpdGlvbiA9IHN0YXRlLm5leHRQb3NpdGlvbiA9IG51bGw7XG4gIHJldHVybiBlcnJvclN0cmluZyArIHByb2Nlc3NlZFN0YWNrLnJldmVyc2UoKS5qb2luKCcnKTtcbn1cblxuLy8gR2VuZXJhdGUgcG9zaXRpb24gYW5kIHNuaXBwZXQgb2Ygb3JpZ2luYWwgc291cmNlIHdpdGggcG9pbnRlclxuZnVuY3Rpb24gZ2V0RXJyb3JTb3VyY2UoZXJyb3IpIHtcbiAgdmFyIG1hdGNoID0gL1xcbiAgICBhdCBbXihdKyBcXCgoLiopOihcXGQrKTooXFxkKylcXCkvLmV4ZWMoZXJyb3Iuc3RhY2spO1xuICBpZiAobWF0Y2gpIHtcbiAgICB2YXIgc291cmNlID0gbWF0Y2hbMV07XG4gICAgdmFyIGxpbmUgPSArbWF0Y2hbMl07XG4gICAgdmFyIGNvbHVtbiA9ICttYXRjaFszXTtcblxuICAgIC8vIFN1cHBvcnQgdGhlIGlubGluZSBzb3VyY2VDb250ZW50cyBpbnNpZGUgdGhlIHNvdXJjZSBtYXBcbiAgICB2YXIgY29udGVudHMgPSBmaWxlQ29udGVudHNDYWNoZVtzb3VyY2VdO1xuXG4gICAgLy8gU3VwcG9ydCBmaWxlcyBvbiBkaXNrXG4gICAgaWYgKCFjb250ZW50cyAmJiBmcyAmJiBmcy5leGlzdHNTeW5jKHNvdXJjZSkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZSwgJ3V0ZjgnKTtcbiAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgIGNvbnRlbnRzID0gJyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRm9ybWF0IHRoZSBsaW5lIGZyb20gdGhlIG9yaWdpbmFsIHNvdXJjZSBjb2RlIGxpa2Ugbm9kZSBkb2VzXG4gICAgaWYgKGNvbnRlbnRzKSB7XG4gICAgICB2YXIgY29kZSA9IGNvbnRlbnRzLnNwbGl0KC8oPzpcXHJcXG58XFxyfFxcbikvKVtsaW5lIC0gMV07XG4gICAgICBpZiAoY29kZSkge1xuICAgICAgICByZXR1cm4gc291cmNlICsgJzonICsgbGluZSArICdcXG4nICsgY29kZSArICdcXG4nICtcbiAgICAgICAgICBuZXcgQXJyYXkoY29sdW1uKS5qb2luKCcgJykgKyAnXic7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBwcmludEVycm9yQW5kRXhpdCAoZXJyb3IpIHtcbiAgdmFyIHNvdXJjZSA9IGdldEVycm9yU291cmNlKGVycm9yKTtcblxuICAvLyBFbnN1cmUgZXJyb3IgaXMgcHJpbnRlZCBzeW5jaHJvbm91c2x5IGFuZCBub3QgdHJ1bmNhdGVkXG4gIGlmIChwcm9jZXNzLnN0ZGVyci5faGFuZGxlICYmIHByb2Nlc3Muc3RkZXJyLl9oYW5kbGUuc2V0QmxvY2tpbmcpIHtcbiAgICBwcm9jZXNzLnN0ZGVyci5faGFuZGxlLnNldEJsb2NraW5nKHRydWUpO1xuICB9XG5cbiAgaWYgKHNvdXJjZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoKTtcbiAgICBjb25zb2xlLmVycm9yKHNvdXJjZSk7XG4gIH1cblxuICBjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufVxuXG5mdW5jdGlvbiBzaGltRW1pdFVuY2F1Z2h0RXhjZXB0aW9uICgpIHtcbiAgdmFyIG9yaWdFbWl0ID0gcHJvY2Vzcy5lbWl0O1xuXG4gIHByb2Nlc3MuZW1pdCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT09ICd1bmNhdWdodEV4Y2VwdGlvbicpIHtcbiAgICAgIHZhciBoYXNTdGFjayA9IChhcmd1bWVudHNbMV0gJiYgYXJndW1lbnRzWzFdLnN0YWNrKTtcbiAgICAgIHZhciBoYXNMaXN0ZW5lcnMgPSAodGhpcy5saXN0ZW5lcnModHlwZSkubGVuZ3RoID4gMCk7XG5cbiAgICAgIGlmIChoYXNTdGFjayAmJiAhaGFzTGlzdGVuZXJzKSB7XG4gICAgICAgIHJldHVybiBwcmludEVycm9yQW5kRXhpdChhcmd1bWVudHNbMV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvcmlnRW1pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG52YXIgb3JpZ2luYWxSZXRyaWV2ZUZpbGVIYW5kbGVycyA9IHJldHJpZXZlRmlsZUhhbmRsZXJzLnNsaWNlKDApO1xudmFyIG9yaWdpbmFsUmV0cmlldmVNYXBIYW5kbGVycyA9IHJldHJpZXZlTWFwSGFuZGxlcnMuc2xpY2UoMCk7XG5cbmV4cG9ydHMud3JhcENhbGxTaXRlID0gd3JhcENhbGxTaXRlO1xuZXhwb3J0cy5nZXRFcnJvclNvdXJjZSA9IGdldEVycm9yU291cmNlO1xuZXhwb3J0cy5tYXBTb3VyY2VQb3NpdGlvbiA9IG1hcFNvdXJjZVBvc2l0aW9uO1xuZXhwb3J0cy5yZXRyaWV2ZVNvdXJjZU1hcCA9IHJldHJpZXZlU291cmNlTWFwO1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChvcHRpb25zLmVudmlyb25tZW50KSB7XG4gICAgZW52aXJvbm1lbnQgPSBvcHRpb25zLmVudmlyb25tZW50O1xuICAgIGlmIChbXCJub2RlXCIsIFwiYnJvd3NlclwiLCBcImF1dG9cIl0uaW5kZXhPZihlbnZpcm9ubWVudCkgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJlbnZpcm9ubWVudCBcIiArIGVudmlyb25tZW50ICsgXCIgd2FzIHVua25vd24uIEF2YWlsYWJsZSBvcHRpb25zIGFyZSB7YXV0bywgYnJvd3Nlciwgbm9kZX1cIilcbiAgICB9XG4gIH1cblxuICAvLyBBbGxvdyBzb3VyY2VzIHRvIGJlIGZvdW5kIGJ5IG1ldGhvZHMgb3RoZXIgdGhhbiByZWFkaW5nIHRoZSBmaWxlc1xuICAvLyBkaXJlY3RseSBmcm9tIGRpc2suXG4gIGlmIChvcHRpb25zLnJldHJpZXZlRmlsZSkge1xuICAgIGlmIChvcHRpb25zLm92ZXJyaWRlUmV0cmlldmVGaWxlKSB7XG4gICAgICByZXRyaWV2ZUZpbGVIYW5kbGVycy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIHJldHJpZXZlRmlsZUhhbmRsZXJzLnVuc2hpZnQob3B0aW9ucy5yZXRyaWV2ZUZpbGUpO1xuICB9XG5cbiAgLy8gQWxsb3cgc291cmNlIG1hcHMgdG8gYmUgZm91bmQgYnkgbWV0aG9kcyBvdGhlciB0aGFuIHJlYWRpbmcgdGhlIGZpbGVzXG4gIC8vIGRpcmVjdGx5IGZyb20gZGlzay5cbiAgaWYgKG9wdGlvbnMucmV0cmlldmVTb3VyY2VNYXApIHtcbiAgICBpZiAob3B0aW9ucy5vdmVycmlkZVJldHJpZXZlU291cmNlTWFwKSB7XG4gICAgICByZXRyaWV2ZU1hcEhhbmRsZXJzLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgcmV0cmlldmVNYXBIYW5kbGVycy51bnNoaWZ0KG9wdGlvbnMucmV0cmlldmVTb3VyY2VNYXApO1xuICB9XG5cbiAgLy8gU3VwcG9ydCBydW50aW1lIHRyYW5zcGlsZXJzIHRoYXQgaW5jbHVkZSBpbmxpbmUgc291cmNlIG1hcHNcbiAgaWYgKG9wdGlvbnMuaG9va1JlcXVpcmUgJiYgIWlzSW5Ccm93c2VyKCkpIHtcbiAgICAvLyBVc2UgZHluYW1pY1JlcXVpcmUgdG8gYXZvaWQgaW5jbHVkaW5nIGluIGJyb3dzZXIgYnVuZGxlc1xuICAgIHZhciBNb2R1bGUgPSBkeW5hbWljUmVxdWlyZShtb2R1bGUsICdtb2R1bGUnKTtcbiAgICB2YXIgJGNvbXBpbGUgPSBNb2R1bGUucHJvdG90eXBlLl9jb21waWxlO1xuXG4gICAgaWYgKCEkY29tcGlsZS5fX3NvdXJjZU1hcFN1cHBvcnQpIHtcbiAgICAgIE1vZHVsZS5wcm90b3R5cGUuX2NvbXBpbGUgPSBmdW5jdGlvbihjb250ZW50LCBmaWxlbmFtZSkge1xuICAgICAgICBmaWxlQ29udGVudHNDYWNoZVtmaWxlbmFtZV0gPSBjb250ZW50O1xuICAgICAgICBzb3VyY2VNYXBDYWNoZVtmaWxlbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiAkY29tcGlsZS5jYWxsKHRoaXMsIGNvbnRlbnQsIGZpbGVuYW1lKTtcbiAgICAgIH07XG5cbiAgICAgIE1vZHVsZS5wcm90b3R5cGUuX2NvbXBpbGUuX19zb3VyY2VNYXBTdXBwb3J0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBDb25maWd1cmUgb3B0aW9uc1xuICBpZiAoIWVtcHR5Q2FjaGVCZXR3ZWVuT3BlcmF0aW9ucykge1xuICAgIGVtcHR5Q2FjaGVCZXR3ZWVuT3BlcmF0aW9ucyA9ICdlbXB0eUNhY2hlQmV0d2Vlbk9wZXJhdGlvbnMnIGluIG9wdGlvbnMgP1xuICAgICAgb3B0aW9ucy5lbXB0eUNhY2hlQmV0d2Vlbk9wZXJhdGlvbnMgOiBmYWxzZTtcbiAgfVxuXG4gIC8vIEluc3RhbGwgdGhlIGVycm9yIHJlZm9ybWF0dGVyXG4gIGlmICghZXJyb3JGb3JtYXR0ZXJJbnN0YWxsZWQpIHtcbiAgICBlcnJvckZvcm1hdHRlckluc3RhbGxlZCA9IHRydWU7XG4gICAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBwcmVwYXJlU3RhY2tUcmFjZTtcbiAgfVxuXG4gIGlmICghdW5jYXVnaHRTaGltSW5zdGFsbGVkKSB7XG4gICAgdmFyIGluc3RhbGxIYW5kbGVyID0gJ2hhbmRsZVVuY2F1Z2h0RXhjZXB0aW9ucycgaW4gb3B0aW9ucyA/XG4gICAgICBvcHRpb25zLmhhbmRsZVVuY2F1Z2h0RXhjZXB0aW9ucyA6IHRydWU7XG5cbiAgICAvLyBEbyBub3Qgb3ZlcnJpZGUgJ3VuY2F1Z2h0RXhjZXB0aW9uJyB3aXRoIG91ciBvd24gaGFuZGxlciBpbiBOb2RlLmpzXG4gICAgLy8gV29ya2VyIHRocmVhZHMuIFdvcmtlcnMgcGFzcyB0aGUgZXJyb3IgdG8gdGhlIG1haW4gdGhyZWFkIGFzIGFuIGV2ZW50LFxuICAgIC8vIHJhdGhlciB0aGFuIHByaW50aW5nIHNvbWV0aGluZyB0byBzdGRlcnIgYW5kIGV4aXRpbmcuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gdXNlIGBkeW5hbWljUmVxdWlyZWAgYmVjYXVzZSBgcmVxdWlyZWAgb24gaXQncyBvd24gd2lsbCBiZSBvcHRpbWl6ZWQgYnkgV2ViUGFjay9Ccm93c2VyaWZ5LlxuICAgICAgdmFyIHdvcmtlcl90aHJlYWRzID0gZHluYW1pY1JlcXVpcmUobW9kdWxlLCAnd29ya2VyX3RocmVhZHMnKTtcbiAgICAgIGlmICh3b3JrZXJfdGhyZWFkcy5pc01haW5UaHJlYWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGluc3RhbGxIYW5kbGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7fVxuXG4gICAgLy8gUHJvdmlkZSB0aGUgb3B0aW9uIHRvIG5vdCBpbnN0YWxsIHRoZSB1bmNhdWdodCBleGNlcHRpb24gaGFuZGxlci4gVGhpcyBpc1xuICAgIC8vIHRvIHN1cHBvcnQgb3RoZXIgdW5jYXVnaHQgZXhjZXB0aW9uIGhhbmRsZXJzIChpbiB0ZXN0IGZyYW1ld29ya3MsIGZvclxuICAgIC8vIGV4YW1wbGUpLiBJZiB0aGlzIGhhbmRsZXIgaXMgbm90IGluc3RhbGxlZCBhbmQgdGhlcmUgYXJlIG5vIG90aGVyIHVuY2F1Z2h0XG4gICAgLy8gZXhjZXB0aW9uIGhhbmRsZXJzLCB1bmNhdWdodCBleGNlcHRpb25zIHdpbGwgYmUgY2F1Z2h0IGJ5IG5vZGUncyBidWlsdC1pblxuICAgIC8vIGV4Y2VwdGlvbiBoYW5kbGVyIGFuZCB0aGUgcHJvY2VzcyB3aWxsIHN0aWxsIGJlIHRlcm1pbmF0ZWQuIEhvd2V2ZXIsIHRoZVxuICAgIC8vIGdlbmVyYXRlZCBKYXZhU2NyaXB0IGNvZGUgd2lsbCBiZSBzaG93biBhYm92ZSB0aGUgc3RhY2sgdHJhY2UgaW5zdGVhZCBvZlxuICAgIC8vIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29kZS5cbiAgICBpZiAoaW5zdGFsbEhhbmRsZXIgJiYgaGFzR2xvYmFsUHJvY2Vzc0V2ZW50RW1pdHRlcigpKSB7XG4gICAgICB1bmNhdWdodFNoaW1JbnN0YWxsZWQgPSB0cnVlO1xuICAgICAgc2hpbUVtaXRVbmNhdWdodEV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5yZXNldFJldHJpZXZlSGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcbiAgcmV0cmlldmVGaWxlSGFuZGxlcnMubGVuZ3RoID0gMDtcbiAgcmV0cmlldmVNYXBIYW5kbGVycy5sZW5ndGggPSAwO1xuXG4gIHJldHJpZXZlRmlsZUhhbmRsZXJzID0gb3JpZ2luYWxSZXRyaWV2ZUZpbGVIYW5kbGVycy5zbGljZSgwKTtcbiAgcmV0cmlldmVNYXBIYW5kbGVycyA9IG9yaWdpbmFsUmV0cmlldmVNYXBIYW5kbGVycy5zbGljZSgwKTtcblxuICByZXRyaWV2ZVNvdXJjZU1hcCA9IGhhbmRsZXJFeGVjKHJldHJpZXZlTWFwSGFuZGxlcnMpO1xuICByZXRyaWV2ZUZpbGUgPSBoYW5kbGVyRXhlYyhyZXRyaWV2ZUZpbGVIYW5kbGVycyk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHRpZiAoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblx0XHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDktMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0UudHh0IG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5leHBvcnRzLlNvdXJjZU1hcEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vbGliL3NvdXJjZS1tYXAtZ2VuZXJhdG9yJykuU291cmNlTWFwR2VuZXJhdG9yO1xuZXhwb3J0cy5Tb3VyY2VNYXBDb25zdW1lciA9IHJlcXVpcmUoJy4vbGliL3NvdXJjZS1tYXAtY29uc3VtZXInKS5Tb3VyY2VNYXBDb25zdW1lcjtcbmV4cG9ydHMuU291cmNlTm9kZSA9IHJlcXVpcmUoJy4vbGliL3NvdXJjZS1ub2RlJykuU291cmNlTm9kZTtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxudmFyIGludFRvQ2hhck1hcCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJy5zcGxpdCgnJyk7XG5cbi8qKlxuICogRW5jb2RlIGFuIGludGVnZXIgaW4gdGhlIHJhbmdlIG9mIDAgdG8gNjMgdG8gYSBzaW5nbGUgYmFzZSA2NCBkaWdpdC5cbiAqL1xuZXhwb3J0cy5lbmNvZGUgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gIGlmICgwIDw9IG51bWJlciAmJiBudW1iZXIgPCBpbnRUb0NoYXJNYXAubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGludFRvQ2hhck1hcFtudW1iZXJdO1xuICB9XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJNdXN0IGJlIGJldHdlZW4gMCBhbmQgNjM6IFwiICsgbnVtYmVyKTtcbn07XG5cbi8qKlxuICogRGVjb2RlIGEgc2luZ2xlIGJhc2UgNjQgY2hhcmFjdGVyIGNvZGUgZGlnaXQgdG8gYW4gaW50ZWdlci4gUmV0dXJucyAtMSBvblxuICogZmFpbHVyZS5cbiAqL1xuZXhwb3J0cy5kZWNvZGUgPSBmdW5jdGlvbiAoY2hhckNvZGUpIHtcbiAgdmFyIGJpZ0EgPSA2NTsgICAgIC8vICdBJ1xuICB2YXIgYmlnWiA9IDkwOyAgICAgLy8gJ1onXG5cbiAgdmFyIGxpdHRsZUEgPSA5NzsgIC8vICdhJ1xuICB2YXIgbGl0dGxlWiA9IDEyMjsgLy8gJ3onXG5cbiAgdmFyIHplcm8gPSA0ODsgICAgIC8vICcwJ1xuICB2YXIgbmluZSA9IDU3OyAgICAgLy8gJzknXG5cbiAgdmFyIHBsdXMgPSA0MzsgICAgIC8vICcrJ1xuICB2YXIgc2xhc2ggPSA0NzsgICAgLy8gJy8nXG5cbiAgdmFyIGxpdHRsZU9mZnNldCA9IDI2O1xuICB2YXIgbnVtYmVyT2Zmc2V0ID0gNTI7XG5cbiAgLy8gMCAtIDI1OiBBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlxuICBpZiAoYmlnQSA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSBiaWdaKSB7XG4gICAgcmV0dXJuIChjaGFyQ29kZSAtIGJpZ0EpO1xuICB9XG5cbiAgLy8gMjYgLSA1MTogYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcbiAgaWYgKGxpdHRsZUEgPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPD0gbGl0dGxlWikge1xuICAgIHJldHVybiAoY2hhckNvZGUgLSBsaXR0bGVBICsgbGl0dGxlT2Zmc2V0KTtcbiAgfVxuXG4gIC8vIDUyIC0gNjE6IDAxMjM0NTY3ODlcbiAgaWYgKHplcm8gPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPD0gbmluZSkge1xuICAgIHJldHVybiAoY2hhckNvZGUgLSB6ZXJvICsgbnVtYmVyT2Zmc2V0KTtcbiAgfVxuXG4gIC8vIDYyOiArXG4gIGlmIChjaGFyQ29kZSA9PSBwbHVzKSB7XG4gICAgcmV0dXJuIDYyO1xuICB9XG5cbiAgLy8gNjM6IC9cbiAgaWYgKGNoYXJDb2RlID09IHNsYXNoKSB7XG4gICAgcmV0dXJuIDYzO1xuICB9XG5cbiAgLy8gSW52YWxpZCBiYXNlNjQgZGlnaXQuXG4gIHJldHVybiAtMTtcbn07XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTQgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgbWFwcGluZ0IgaXMgYWZ0ZXIgbWFwcGluZ0Egd2l0aCByZXNwZWN0IHRvIGdlbmVyYXRlZFxuICogcG9zaXRpb24uXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlZFBvc2l0aW9uQWZ0ZXIobWFwcGluZ0EsIG1hcHBpbmdCKSB7XG4gIC8vIE9wdGltaXplZCBmb3IgbW9zdCBjb21tb24gY2FzZVxuICB2YXIgbGluZUEgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lO1xuICB2YXIgbGluZUIgPSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICB2YXIgY29sdW1uQSA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbjtcbiAgdmFyIGNvbHVtbkIgPSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIHJldHVybiBsaW5lQiA+IGxpbmVBIHx8IGxpbmVCID09IGxpbmVBICYmIGNvbHVtbkIgPj0gY29sdW1uQSB8fFxuICAgICAgICAgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IpIDw9IDA7XG59XG5cbi8qKlxuICogQSBkYXRhIHN0cnVjdHVyZSB0byBwcm92aWRlIGEgc29ydGVkIHZpZXcgb2YgYWNjdW11bGF0ZWQgbWFwcGluZ3MgaW4gYVxuICogcGVyZm9ybWFuY2UgY29uc2Npb3VzIG1hbm5lci4gSXQgdHJhZGVzIGEgbmVnbGliYWJsZSBvdmVyaGVhZCBpbiBnZW5lcmFsXG4gKiBjYXNlIGZvciBhIGxhcmdlIHNwZWVkdXAgaW4gY2FzZSBvZiBtYXBwaW5ncyBiZWluZyBhZGRlZCBpbiBvcmRlci5cbiAqL1xuZnVuY3Rpb24gTWFwcGluZ0xpc3QoKSB7XG4gIHRoaXMuX2FycmF5ID0gW107XG4gIHRoaXMuX3NvcnRlZCA9IHRydWU7XG4gIC8vIFNlcnZlcyBhcyBpbmZpbXVtXG4gIHRoaXMuX2xhc3QgPSB7Z2VuZXJhdGVkTGluZTogLTEsIGdlbmVyYXRlZENvbHVtbjogMH07XG59XG5cbi8qKlxuICogSXRlcmF0ZSB0aHJvdWdoIGludGVybmFsIGl0ZW1zLiBUaGlzIG1ldGhvZCB0YWtlcyB0aGUgc2FtZSBhcmd1bWVudHMgdGhhdFxuICogYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCB0YWtlcy5cbiAqXG4gKiBOT1RFOiBUaGUgb3JkZXIgb2YgdGhlIG1hcHBpbmdzIGlzIE5PVCBndWFyYW50ZWVkLlxuICovXG5NYXBwaW5nTGlzdC5wcm90b3R5cGUudW5zb3J0ZWRGb3JFYWNoID1cbiAgZnVuY3Rpb24gTWFwcGluZ0xpc3RfZm9yRWFjaChhQ2FsbGJhY2ssIGFUaGlzQXJnKSB7XG4gICAgdGhpcy5fYXJyYXkuZm9yRWFjaChhQ2FsbGJhY2ssIGFUaGlzQXJnKTtcbiAgfTtcblxuLyoqXG4gKiBBZGQgdGhlIGdpdmVuIHNvdXJjZSBtYXBwaW5nLlxuICpcbiAqIEBwYXJhbSBPYmplY3QgYU1hcHBpbmdcbiAqL1xuTWFwcGluZ0xpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIE1hcHBpbmdMaXN0X2FkZChhTWFwcGluZykge1xuICBpZiAoZ2VuZXJhdGVkUG9zaXRpb25BZnRlcih0aGlzLl9sYXN0LCBhTWFwcGluZykpIHtcbiAgICB0aGlzLl9sYXN0ID0gYU1hcHBpbmc7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhTWFwcGluZyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fc29ydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhTWFwcGluZyk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmxhdCwgc29ydGVkIGFycmF5IG9mIG1hcHBpbmdzLiBUaGUgbWFwcGluZ3MgYXJlIHNvcnRlZCBieVxuICogZ2VuZXJhdGVkIHBvc2l0aW9uLlxuICpcbiAqIFdBUk5JTkc6IFRoaXMgbWV0aG9kIHJldHVybnMgaW50ZXJuYWwgZGF0YSB3aXRob3V0IGNvcHlpbmcsIGZvclxuICogcGVyZm9ybWFuY2UuIFRoZSByZXR1cm4gdmFsdWUgbXVzdCBOT1QgYmUgbXV0YXRlZCwgYW5kIHNob3VsZCBiZSB0cmVhdGVkIGFzXG4gKiBhbiBpbW11dGFibGUgYm9ycm93LiBJZiB5b3Ugd2FudCB0byB0YWtlIG93bmVyc2hpcCwgeW91IG11c3QgbWFrZSB5b3VyIG93blxuICogY29weS5cbiAqL1xuTWFwcGluZ0xpc3QucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiBNYXBwaW5nTGlzdF90b0FycmF5KCkge1xuICBpZiAoIXRoaXMuX3NvcnRlZCkge1xuICAgIHRoaXMuX2FycmF5LnNvcnQodXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZCk7XG4gICAgdGhpcy5fc29ydGVkID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdGhpcy5fYXJyYXk7XG59O1xuXG5leHBvcnRzLk1hcHBpbmdMaXN0ID0gTWFwcGluZ0xpc3Q7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgYmluYXJ5U2VhcmNoID0gcmVxdWlyZSgnLi9iaW5hcnktc2VhcmNoJyk7XG52YXIgQXJyYXlTZXQgPSByZXF1aXJlKCcuL2FycmF5LXNldCcpLkFycmF5U2V0O1xudmFyIGJhc2U2NFZMUSA9IHJlcXVpcmUoJy4vYmFzZTY0LXZscScpO1xudmFyIHF1aWNrU29ydCA9IHJlcXVpcmUoJy4vcXVpY2stc29ydCcpLnF1aWNrU29ydDtcblxuZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCwgYVNvdXJjZU1hcFVSTCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IHV0aWwucGFyc2VTb3VyY2VNYXBJbnB1dChhU291cmNlTWFwKTtcbiAgfVxuXG4gIHJldHVybiBzb3VyY2VNYXAuc2VjdGlvbnMgIT0gbnVsbFxuICAgID8gbmV3IEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXAsIGFTb3VyY2VNYXBVUkwpXG4gICAgOiBuZXcgQmFzaWNTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXAsIGFTb3VyY2VNYXBVUkwpO1xufVxuXG5Tb3VyY2VNYXBDb25zdW1lci5mcm9tU291cmNlTWFwID0gZnVuY3Rpb24oYVNvdXJjZU1hcCwgYVNvdXJjZU1hcFVSTCkge1xuICByZXR1cm4gQmFzaWNTb3VyY2VNYXBDb25zdW1lci5mcm9tU291cmNlTWFwKGFTb3VyY2VNYXAsIGFTb3VyY2VNYXBVUkwpO1xufVxuXG4vKipcbiAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBzb3VyY2UgbWFwcGluZyBzcGVjIHRoYXQgd2UgYXJlIGNvbnN1bWluZy5cbiAqL1xuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLy8gYF9fZ2VuZXJhdGVkTWFwcGluZ3NgIGFuZCBgX19vcmlnaW5hbE1hcHBpbmdzYCBhcmUgYXJyYXlzIHRoYXQgaG9sZCB0aGVcbi8vIHBhcnNlZCBtYXBwaW5nIGNvb3JkaW5hdGVzIGZyb20gdGhlIHNvdXJjZSBtYXAncyBcIm1hcHBpbmdzXCIgYXR0cmlidXRlLiBUaGV5XG4vLyBhcmUgbGF6aWx5IGluc3RhbnRpYXRlZCwgYWNjZXNzZWQgdmlhIHRoZSBgX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmRcbi8vIGBfb3JpZ2luYWxNYXBwaW5nc2AgZ2V0dGVycyByZXNwZWN0aXZlbHksIGFuZCB3ZSBvbmx5IHBhcnNlIHRoZSBtYXBwaW5nc1xuLy8gYW5kIGNyZWF0ZSB0aGVzZSBhcnJheXMgb25jZSBxdWVyaWVkIGZvciBhIHNvdXJjZSBsb2NhdGlvbi4gV2UganVtcCB0aHJvdWdoXG4vLyB0aGVzZSBob29wcyBiZWNhdXNlIHRoZXJlIGNhbiBiZSBtYW55IHRob3VzYW5kcyBvZiBtYXBwaW5ncywgYW5kIHBhcnNpbmdcbi8vIHRoZW0gaXMgZXhwZW5zaXZlLCBzbyB3ZSBvbmx5IHdhbnQgdG8gZG8gaXQgaWYgd2UgbXVzdC5cbi8vXG4vLyBFYWNoIG9iamVjdCBpbiB0aGUgYXJyYXlzIGlzIG9mIHRoZSBmb3JtOlxuLy9cbi8vICAgICB7XG4vLyAgICAgICBnZW5lcmF0ZWRMaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBjb2RlLFxuLy8gICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIGNvZGUsXG4vLyAgICAgICBzb3VyY2U6IFRoZSBwYXRoIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSB0aGF0IGdlbmVyYXRlZCB0aGlzXG4vLyAgICAgICAgICAgICAgIGNodW5rIG9mIGNvZGUsXG4vLyAgICAgICBvcmlnaW5hbExpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlIHRoYXRcbi8vICAgICAgICAgICAgICAgICAgICAgY29ycmVzcG9uZHMgdG8gdGhpcyBjaHVuayBvZiBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIG9yaWdpbmFsQ29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlIHRoYXRcbi8vICAgICAgICAgICAgICAgICAgICAgICBjb3JyZXNwb25kcyB0byB0aGlzIGNodW5rIG9mIGdlbmVyYXRlZCBjb2RlLFxuLy8gICAgICAgbmFtZTogVGhlIG5hbWUgb2YgdGhlIG9yaWdpbmFsIHN5bWJvbCB3aGljaCBnZW5lcmF0ZWQgdGhpcyBjaHVuayBvZlxuLy8gICAgICAgICAgICAgY29kZS5cbi8vICAgICB9XG4vL1xuLy8gQWxsIHByb3BlcnRpZXMgZXhjZXB0IGZvciBgZ2VuZXJhdGVkTGluZWAgYW5kIGBnZW5lcmF0ZWRDb2x1bW5gIGNhbiBiZVxuLy8gYG51bGxgLlxuLy9cbi8vIGBfZ2VuZXJhdGVkTWFwcGluZ3NgIGlzIG9yZGVyZWQgYnkgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbnMuXG4vL1xuLy8gYF9vcmlnaW5hbE1hcHBpbmdzYCBpcyBvcmRlcmVkIGJ5IHRoZSBvcmlnaW5hbCBwb3NpdGlvbnMuXG5cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fX2dlbmVyYXRlZE1hcHBpbmdzID0gbnVsbDtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdfZ2VuZXJhdGVkTWFwcGluZ3MnLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MpIHtcbiAgICAgIHRoaXMuX3BhcnNlTWFwcGluZ3ModGhpcy5fbWFwcGluZ3MsIHRoaXMuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncztcbiAgfVxufSk7XG5cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fX29yaWdpbmFsTWFwcGluZ3MgPSBudWxsO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ19vcmlnaW5hbE1hcHBpbmdzJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MpIHtcbiAgICAgIHRoaXMuX3BhcnNlTWFwcGluZ3ModGhpcy5fbWFwcGluZ3MsIHRoaXMuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzO1xuICB9XG59KTtcblxuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9jaGFySXNNYXBwaW5nU2VwYXJhdG9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfY2hhcklzTWFwcGluZ1NlcGFyYXRvcihhU3RyLCBpbmRleCkge1xuICAgIHZhciBjID0gYVN0ci5jaGFyQXQoaW5kZXgpO1xuICAgIHJldHVybiBjID09PSBcIjtcIiB8fCBjID09PSBcIixcIjtcbiAgfTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgbWFwcGluZ3MgaW4gYSBzdHJpbmcgaW4gdG8gYSBkYXRhIHN0cnVjdHVyZSB3aGljaCB3ZSBjYW4gZWFzaWx5XG4gKiBxdWVyeSAodGhlIG9yZGVyZWQgYXJyYXlzIGluIHRoZSBgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmRcbiAqIGB0aGlzLl9fb3JpZ2luYWxNYXBwaW5nc2AgcHJvcGVydGllcykuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdWJjbGFzc2VzIG11c3QgaW1wbGVtZW50IF9wYXJzZU1hcHBpbmdzXCIpO1xuICB9O1xuXG5Tb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVIgPSAxO1xuU291cmNlTWFwQ29uc3VtZXIuT1JJR0lOQUxfT1JERVIgPSAyO1xuXG5Tb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCA9IDE7XG5Tb3VyY2VNYXBDb25zdW1lci5MRUFTVF9VUFBFUl9CT1VORCA9IDI7XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGVhY2ggbWFwcGluZyBiZXR3ZWVuIGFuIG9yaWdpbmFsIHNvdXJjZS9saW5lL2NvbHVtbiBhbmQgYVxuICogZ2VuZXJhdGVkIGxpbmUvY29sdW1uIGluIHRoaXMgc291cmNlIG1hcC5cbiAqXG4gKiBAcGFyYW0gRnVuY3Rpb24gYUNhbGxiYWNrXG4gKiAgICAgICAgVGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdpdGggZWFjaCBtYXBwaW5nLlxuICogQHBhcmFtIE9iamVjdCBhQ29udGV4dFxuICogICAgICAgIE9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHRoaXMgb2JqZWN0IHdpbGwgYmUgdGhlIHZhbHVlIG9mIGB0aGlzYCBldmVyeVxuICogICAgICAgIHRpbWUgdGhhdCBgYUNhbGxiYWNrYCBpcyBjYWxsZWQuXG4gKiBAcGFyYW0gYU9yZGVyXG4gKiAgICAgICAgRWl0aGVyIGBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVJgIG9yXG4gKiAgICAgICAgYFNvdXJjZU1hcENvbnN1bWVyLk9SSUdJTkFMX09SREVSYC4gU3BlY2lmaWVzIHdoZXRoZXIgeW91IHdhbnQgdG9cbiAqICAgICAgICBpdGVyYXRlIG92ZXIgdGhlIG1hcHBpbmdzIHNvcnRlZCBieSB0aGUgZ2VuZXJhdGVkIGZpbGUncyBsaW5lL2NvbHVtblxuICogICAgICAgIG9yZGVyIG9yIHRoZSBvcmlnaW5hbCdzIHNvdXJjZS9saW5lL2NvbHVtbiBvcmRlciwgcmVzcGVjdGl2ZWx5LiBEZWZhdWx0cyB0b1xuICogICAgICAgIGBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVJgLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuZWFjaE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9lYWNoTWFwcGluZyhhQ2FsbGJhY2ssIGFDb250ZXh0LCBhT3JkZXIpIHtcbiAgICB2YXIgY29udGV4dCA9IGFDb250ZXh0IHx8IG51bGw7XG4gICAgdmFyIG9yZGVyID0gYU9yZGVyIHx8IFNvdXJjZU1hcENvbnN1bWVyLkdFTkVSQVRFRF9PUkRFUjtcblxuICAgIHZhciBtYXBwaW5ncztcbiAgICBzd2l0Y2ggKG9yZGVyKSB7XG4gICAgY2FzZSBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVI6XG4gICAgICBtYXBwaW5ncyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTb3VyY2VNYXBDb25zdW1lci5PUklHSU5BTF9PUkRFUjpcbiAgICAgIG1hcHBpbmdzID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5ncztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG9yZGVyIG9mIGl0ZXJhdGlvbi5cIik7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZVJvb3QgPSB0aGlzLnNvdXJjZVJvb3Q7XG4gICAgbWFwcGluZ3MubWFwKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICB2YXIgc291cmNlID0gbWFwcGluZy5zb3VyY2UgPT09IG51bGwgPyBudWxsIDogdGhpcy5fc291cmNlcy5hdChtYXBwaW5nLnNvdXJjZSk7XG4gICAgICBzb3VyY2UgPSB1dGlsLmNvbXB1dGVTb3VyY2VVUkwoc291cmNlUm9vdCwgc291cmNlLCB0aGlzLl9zb3VyY2VNYXBVUkwpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgIGdlbmVyYXRlZExpbmU6IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSxcbiAgICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbixcbiAgICAgICAgb3JpZ2luYWxMaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgb3JpZ2luYWxDb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW4sXG4gICAgICAgIG5hbWU6IG1hcHBpbmcubmFtZSA9PT0gbnVsbCA/IG51bGwgOiB0aGlzLl9uYW1lcy5hdChtYXBwaW5nLm5hbWUpXG4gICAgICB9O1xuICAgIH0sIHRoaXMpLmZvckVhY2goYUNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgb3JpZ2luYWwgc291cmNlLFxuICogbGluZSwgYW5kIGNvbHVtbiBwcm92aWRlZC4gSWYgbm8gY29sdW1uIGlzIHByb3ZpZGVkLCByZXR1cm5zIGFsbCBtYXBwaW5nc1xuICogY29ycmVzcG9uZGluZyB0byBhIGVpdGhlciB0aGUgbGluZSB3ZSBhcmUgc2VhcmNoaW5nIGZvciBvciB0aGUgbmV4dFxuICogY2xvc2VzdCBsaW5lIHRoYXQgaGFzIGFueSBtYXBwaW5ncy4gT3RoZXJ3aXNlLCByZXR1cm5zIGFsbCBtYXBwaW5nc1xuICogY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gbGluZSBhbmQgZWl0aGVyIHRoZSBjb2x1bW4gd2UgYXJlIHNlYXJjaGluZyBmb3JcbiAqIG9yIHRoZSBuZXh0IGNsb3Nlc3QgY29sdW1uIHRoYXQgaGFzIGFueSBvZmZzZXRzLlxuICpcbiAqIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS4gIFRoZSBsaW5lIG51bWJlciBpcyAxLWJhc2VkLlxuICogICAtIGNvbHVtbjogT3B0aW9uYWwuIHRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgICBUaGUgY29sdW1uIG51bWJlciBpcyAwLWJhc2VkLlxuICpcbiAqIGFuZCBhbiBhcnJheSBvZiBvYmplY3RzIGlzIHJldHVybmVkLCBlYWNoIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuICBUaGVcbiAqICAgIGxpbmUgbnVtYmVyIGlzIDEtYmFzZWQuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgIFRoZSBjb2x1bW4gbnVtYmVyIGlzIDAtYmFzZWQuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IoYUFyZ3MpIHtcbiAgICB2YXIgbGluZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpO1xuXG4gICAgLy8gV2hlbiB0aGVyZSBpcyBubyBleGFjdCBtYXRjaCwgQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX2ZpbmRNYXBwaW5nXG4gICAgLy8gcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGNsb3Nlc3QgbWFwcGluZyBsZXNzIHRoYW4gdGhlIG5lZWRsZS4gQnlcbiAgICAvLyBzZXR0aW5nIG5lZWRsZS5vcmlnaW5hbENvbHVtbiB0byAwLCB3ZSB0aHVzIGZpbmQgdGhlIGxhc3QgbWFwcGluZyBmb3JcbiAgICAvLyB0aGUgZ2l2ZW4gbGluZSwgcHJvdmlkZWQgc3VjaCBhIG1hcHBpbmcgZXhpc3RzLlxuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBzb3VyY2U6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJyksXG4gICAgICBvcmlnaW5hbExpbmU6IGxpbmUsXG4gICAgICBvcmlnaW5hbENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nLCAwKVxuICAgIH07XG5cbiAgICBuZWVkbGUuc291cmNlID0gdGhpcy5fZmluZFNvdXJjZUluZGV4KG5lZWRsZS5zb3VyY2UpO1xuICAgIGlmIChuZWVkbGUuc291cmNlIDwgMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHZhciBtYXBwaW5ncyA9IFtdO1xuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZE1hcHBpbmcobmVlZGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsTWFwcGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvcmlnaW5hbExpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9yaWdpbmFsQ29sdW1uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbC5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5hcnlTZWFyY2guTEVBU1RfVVBQRVJfQk9VTkQpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICBpZiAoYUFyZ3MuY29sdW1uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsTGluZSA9IG1hcHBpbmcub3JpZ2luYWxMaW5lO1xuXG4gICAgICAgIC8vIEl0ZXJhdGUgdW50aWwgZWl0aGVyIHdlIHJ1biBvdXQgb2YgbWFwcGluZ3MsIG9yIHdlIHJ1biBpbnRvXG4gICAgICAgIC8vIGEgbWFwcGluZyBmb3IgYSBkaWZmZXJlbnQgbGluZSB0aGFuIHRoZSBvbmUgd2UgZm91bmQuIFNpbmNlXG4gICAgICAgIC8vIG1hcHBpbmdzIGFyZSBzb3J0ZWQsIHRoaXMgaXMgZ3VhcmFudGVlZCB0byBmaW5kIGFsbCBtYXBwaW5ncyBmb3JcbiAgICAgICAgLy8gdGhlIGxpbmUgd2UgZm91bmQuXG4gICAgICAgIHdoaWxlIChtYXBwaW5nICYmIG1hcHBpbmcub3JpZ2luYWxMaW5lID09PSBvcmlnaW5hbExpbmUpIHtcbiAgICAgICAgICBtYXBwaW5ncy5wdXNoKHtcbiAgICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzWysraW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb3JpZ2luYWxDb2x1bW4gPSBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uO1xuXG4gICAgICAgIC8vIEl0ZXJhdGUgdW50aWwgZWl0aGVyIHdlIHJ1biBvdXQgb2YgbWFwcGluZ3MsIG9yIHdlIHJ1biBpbnRvXG4gICAgICAgIC8vIGEgbWFwcGluZyBmb3IgYSBkaWZmZXJlbnQgbGluZSB0aGFuIHRoZSBvbmUgd2Ugd2VyZSBzZWFyY2hpbmcgZm9yLlxuICAgICAgICAvLyBTaW5jZSBtYXBwaW5ncyBhcmUgc29ydGVkLCB0aGlzIGlzIGd1YXJhbnRlZWQgdG8gZmluZCBhbGwgbWFwcGluZ3MgZm9yXG4gICAgICAgIC8vIHRoZSBsaW5lIHdlIGFyZSBzZWFyY2hpbmcgZm9yLlxuICAgICAgICB3aGlsZSAobWFwcGluZyAmJlxuICAgICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgPT09IGxpbmUgJiZcbiAgICAgICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4gPT0gb3JpZ2luYWxDb2x1bW4pIHtcbiAgICAgICAgICBtYXBwaW5ncy5wdXNoKHtcbiAgICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzWysraW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcHBpbmdzO1xuICB9O1xuXG5leHBvcnRzLlNvdXJjZU1hcENvbnN1bWVyID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogQSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyIGluc3RhbmNlIHJlcHJlc2VudHMgYSBwYXJzZWQgc291cmNlIG1hcCB3aGljaCB3ZSBjYW5cbiAqIHF1ZXJ5IGZvciBpbmZvcm1hdGlvbiBhYm91dCB0aGUgb3JpZ2luYWwgZmlsZSBwb3NpdGlvbnMgYnkgZ2l2aW5nIGl0IGEgZmlsZVxuICogcG9zaXRpb24gaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKlxuICogVGhlIGZpcnN0IHBhcmFtZXRlciBpcyB0aGUgcmF3IHNvdXJjZSBtYXAgKGVpdGhlciBhcyBhIEpTT04gc3RyaW5nLCBvclxuICogYWxyZWFkeSBwYXJzZWQgdG8gYW4gb2JqZWN0KS4gQWNjb3JkaW5nIHRvIHRoZSBzcGVjLCBzb3VyY2UgbWFwcyBoYXZlIHRoZVxuICogZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG4gKlxuICogICAtIHZlcnNpb246IFdoaWNoIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXAgc3BlYyB0aGlzIG1hcCBpcyBmb2xsb3dpbmcuXG4gKiAgIC0gc291cmNlczogQW4gYXJyYXkgb2YgVVJMcyB0byB0aGUgb3JpZ2luYWwgc291cmNlIGZpbGVzLlxuICogICAtIG5hbWVzOiBBbiBhcnJheSBvZiBpZGVudGlmaWVycyB3aGljaCBjYW4gYmUgcmVmZXJyZW5jZWQgYnkgaW5kaXZpZHVhbCBtYXBwaW5ncy5cbiAqICAgLSBzb3VyY2VSb290OiBPcHRpb25hbC4gVGhlIFVSTCByb290IGZyb20gd2hpY2ggYWxsIHNvdXJjZXMgYXJlIHJlbGF0aXZlLlxuICogICAtIHNvdXJjZXNDb250ZW50OiBPcHRpb25hbC4gQW4gYXJyYXkgb2YgY29udGVudHMgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlcy5cbiAqICAgLSBtYXBwaW5nczogQSBzdHJpbmcgb2YgYmFzZTY0IFZMUXMgd2hpY2ggY29udGFpbiB0aGUgYWN0dWFsIG1hcHBpbmdzLlxuICogICAtIGZpbGU6IE9wdGlvbmFsLiBUaGUgZ2VuZXJhdGVkIGZpbGUgdGhpcyBzb3VyY2UgbWFwIGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAqXG4gKiBIZXJlIGlzIGFuIGV4YW1wbGUgc291cmNlIG1hcCwgdGFrZW4gZnJvbSB0aGUgc291cmNlIG1hcCBzcGVjWzBdOlxuICpcbiAqICAgICB7XG4gKiAgICAgICB2ZXJzaW9uIDogMyxcbiAqICAgICAgIGZpbGU6IFwib3V0LmpzXCIsXG4gKiAgICAgICBzb3VyY2VSb290IDogXCJcIixcbiAqICAgICAgIHNvdXJjZXM6IFtcImZvby5qc1wiLCBcImJhci5qc1wiXSxcbiAqICAgICAgIG5hbWVzOiBbXCJzcmNcIiwgXCJtYXBzXCIsIFwiYXJlXCIsIFwiZnVuXCJdLFxuICogICAgICAgbWFwcGluZ3M6IFwiQUEsQUI7O0FCQ0RFO1wiXG4gKiAgICAgfVxuICpcbiAqIFRoZSBzZWNvbmQgcGFyYW1ldGVyLCBpZiBnaXZlbiwgaXMgYSBzdHJpbmcgd2hvc2UgdmFsdWUgaXMgdGhlIFVSTFxuICogYXQgd2hpY2ggdGhlIHNvdXJjZSBtYXAgd2FzIGZvdW5kLiAgVGhpcyBVUkwgaXMgdXNlZCB0byBjb21wdXRlIHRoZVxuICogc291cmNlcyBhcnJheS5cbiAqXG4gKiBbMF06IGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL2RvY3VtZW50L2QvMVUxUkdBZWhRd1J5cFVUb3ZGMUtSbHBpT0Z6ZTBiLV8yZ2M2ZkFIMEtZMGsvZWRpdD9wbGk9MSNcbiAqL1xuZnVuY3Rpb24gQmFzaWNTb3VyY2VNYXBDb25zdW1lcihhU291cmNlTWFwLCBhU291cmNlTWFwVVJMKSB7XG4gIHZhciBzb3VyY2VNYXAgPSBhU291cmNlTWFwO1xuICBpZiAodHlwZW9mIGFTb3VyY2VNYXAgPT09ICdzdHJpbmcnKSB7XG4gICAgc291cmNlTWFwID0gdXRpbC5wYXJzZVNvdXJjZU1hcElucHV0KGFTb3VyY2VNYXApO1xuICB9XG5cbiAgdmFyIHZlcnNpb24gPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICd2ZXJzaW9uJyk7XG4gIHZhciBzb3VyY2VzID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc291cmNlcycpO1xuICAvLyBTYXNzIDMuMyBsZWF2ZXMgb3V0IHRoZSAnbmFtZXMnIGFycmF5LCBzbyB3ZSBkZXZpYXRlIGZyb20gdGhlIHNwZWMgKHdoaWNoXG4gIC8vIHJlcXVpcmVzIHRoZSBhcnJheSkgdG8gcGxheSBuaWNlIGhlcmUuXG4gIHZhciBuYW1lcyA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ25hbWVzJywgW10pO1xuICB2YXIgc291cmNlUm9vdCA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3NvdXJjZVJvb3QnLCBudWxsKTtcbiAgdmFyIHNvdXJjZXNDb250ZW50ID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc291cmNlc0NvbnRlbnQnLCBudWxsKTtcbiAgdmFyIG1hcHBpbmdzID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnbWFwcGluZ3MnKTtcbiAgdmFyIGZpbGUgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdmaWxlJywgbnVsbCk7XG5cbiAgLy8gT25jZSBhZ2FpbiwgU2FzcyBkZXZpYXRlcyBmcm9tIHRoZSBzcGVjIGFuZCBzdXBwbGllcyB0aGUgdmVyc2lvbiBhcyBhXG4gIC8vIHN0cmluZyByYXRoZXIgdGhhbiBhIG51bWJlciwgc28gd2UgdXNlIGxvb3NlIGVxdWFsaXR5IGNoZWNraW5nIGhlcmUuXG4gIGlmICh2ZXJzaW9uICE9IHRoaXMuX3ZlcnNpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHZlcnNpb246ICcgKyB2ZXJzaW9uKTtcbiAgfVxuXG4gIGlmIChzb3VyY2VSb290KSB7XG4gICAgc291cmNlUm9vdCA9IHV0aWwubm9ybWFsaXplKHNvdXJjZVJvb3QpO1xuICB9XG5cbiAgc291cmNlcyA9IHNvdXJjZXNcbiAgICAubWFwKFN0cmluZylcbiAgICAvLyBTb21lIHNvdXJjZSBtYXBzIHByb2R1Y2UgcmVsYXRpdmUgc291cmNlIHBhdGhzIGxpa2UgXCIuL2Zvby5qc1wiIGluc3RlYWQgb2ZcbiAgICAvLyBcImZvby5qc1wiLiAgTm9ybWFsaXplIHRoZXNlIGZpcnN0IHNvIHRoYXQgZnV0dXJlIGNvbXBhcmlzb25zIHdpbGwgc3VjY2VlZC5cbiAgICAvLyBTZWUgYnVnemlsLmxhLzEwOTA3NjguXG4gICAgLm1hcCh1dGlsLm5vcm1hbGl6ZSlcbiAgICAvLyBBbHdheXMgZW5zdXJlIHRoYXQgYWJzb2x1dGUgc291cmNlcyBhcmUgaW50ZXJuYWxseSBzdG9yZWQgcmVsYXRpdmUgdG9cbiAgICAvLyB0aGUgc291cmNlIHJvb3QsIGlmIHRoZSBzb3VyY2Ugcm9vdCBpcyBhYnNvbHV0ZS4gTm90IGRvaW5nIHRoaXMgd291bGRcbiAgICAvLyBiZSBwYXJ0aWN1bGFybHkgcHJvYmxlbWF0aWMgd2hlbiB0aGUgc291cmNlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlXG4gICAgLy8gc291cmNlICh2YWxpZCwgYnV0IHdoeT8/KS4gU2VlIGdpdGh1YiBpc3N1ZSAjMTk5IGFuZCBidWd6aWwubGEvMTE4ODk4Mi5cbiAgICAubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBzb3VyY2VSb290ICYmIHV0aWwuaXNBYnNvbHV0ZShzb3VyY2VSb290KSAmJiB1dGlsLmlzQWJzb2x1dGUoc291cmNlKVxuICAgICAgICA/IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlKVxuICAgICAgICA6IHNvdXJjZTtcbiAgICB9KTtcblxuICAvLyBQYXNzIGB0cnVlYCBiZWxvdyB0byBhbGxvdyBkdXBsaWNhdGUgbmFtZXMgYW5kIHNvdXJjZXMuIFdoaWxlIHNvdXJjZSBtYXBzXG4gIC8vIGFyZSBpbnRlbmRlZCB0byBiZSBjb21wcmVzc2VkIGFuZCBkZWR1cGxpY2F0ZWQsIHRoZSBUeXBlU2NyaXB0IGNvbXBpbGVyXG4gIC8vIHNvbWV0aW1lcyBnZW5lcmF0ZXMgc291cmNlIG1hcHMgd2l0aCBkdXBsaWNhdGVzIGluIHRoZW0uIFNlZSBHaXRodWIgaXNzdWVcbiAgLy8gIzcyIGFuZCBidWd6aWwubGEvODg5NDkyLlxuICB0aGlzLl9uYW1lcyA9IEFycmF5U2V0LmZyb21BcnJheShuYW1lcy5tYXAoU3RyaW5nKSwgdHJ1ZSk7XG4gIHRoaXMuX3NvdXJjZXMgPSBBcnJheVNldC5mcm9tQXJyYXkoc291cmNlcywgdHJ1ZSk7XG5cbiAgdGhpcy5fYWJzb2x1dGVTb3VyY2VzID0gdGhpcy5fc291cmNlcy50b0FycmF5KCkubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgcmV0dXJuIHV0aWwuY29tcHV0ZVNvdXJjZVVSTChzb3VyY2VSb290LCBzLCBhU291cmNlTWFwVVJMKTtcbiAgfSk7XG5cbiAgdGhpcy5zb3VyY2VSb290ID0gc291cmNlUm9vdDtcbiAgdGhpcy5zb3VyY2VzQ29udGVudCA9IHNvdXJjZXNDb250ZW50O1xuICB0aGlzLl9tYXBwaW5ncyA9IG1hcHBpbmdzO1xuICB0aGlzLl9zb3VyY2VNYXBVUkwgPSBhU291cmNlTWFwVVJMO1xuICB0aGlzLmZpbGUgPSBmaWxlO1xufVxuXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlKTtcbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbnN1bWVyID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiB0byBmaW5kIHRoZSBpbmRleCBvZiBhIHNvdXJjZS4gIFJldHVybnMgLTEgaWYgbm90XG4gKiBmb3VuZC5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX2ZpbmRTb3VyY2VJbmRleCA9IGZ1bmN0aW9uKGFTb3VyY2UpIHtcbiAgdmFyIHJlbGF0aXZlU291cmNlID0gYVNvdXJjZTtcbiAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgcmVsYXRpdmVTb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgcmVsYXRpdmVTb3VyY2UpO1xuICB9XG5cbiAgaWYgKHRoaXMuX3NvdXJjZXMuaGFzKHJlbGF0aXZlU291cmNlKSkge1xuICAgIHJldHVybiB0aGlzLl9zb3VyY2VzLmluZGV4T2YocmVsYXRpdmVTb3VyY2UpO1xuICB9XG5cbiAgLy8gTWF5YmUgYVNvdXJjZSBpcyBhbiBhYnNvbHV0ZSBVUkwgYXMgcmV0dXJuZWQgYnkgfHNvdXJjZXN8LiAgSW5cbiAgLy8gdGhpcyBjYXNlIHdlIGNhbid0IHNpbXBseSB1bmRvIHRoZSB0cmFuc2Zvcm0uXG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fYWJzb2x1dGVTb3VyY2VzLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKHRoaXMuX2Fic29sdXRlU291cmNlc1tpXSA9PSBhU291cmNlKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTE7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIEJhc2ljU291cmNlTWFwQ29uc3VtZXIgZnJvbSBhIFNvdXJjZU1hcEdlbmVyYXRvci5cbiAqXG4gKiBAcGFyYW0gU291cmNlTWFwR2VuZXJhdG9yIGFTb3VyY2VNYXBcbiAqICAgICAgICBUaGUgc291cmNlIG1hcCB0aGF0IHdpbGwgYmUgY29uc3VtZWQuXG4gKiBAcGFyYW0gU3RyaW5nIGFTb3VyY2VNYXBVUkxcbiAqICAgICAgICBUaGUgVVJMIGF0IHdoaWNoIHRoZSBzb3VyY2UgbWFwIGNhbiBiZSBmb3VuZCAob3B0aW9uYWwpXG4gKiBAcmV0dXJucyBCYXNpY1NvdXJjZU1hcENvbnN1bWVyXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIuZnJvbVNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2Zyb21Tb3VyY2VNYXAoYVNvdXJjZU1hcCwgYVNvdXJjZU1hcFVSTCkge1xuICAgIHZhciBzbWMgPSBPYmplY3QuY3JlYXRlKEJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlKTtcblxuICAgIHZhciBuYW1lcyA9IHNtYy5fbmFtZXMgPSBBcnJheVNldC5mcm9tQXJyYXkoYVNvdXJjZU1hcC5fbmFtZXMudG9BcnJheSgpLCB0cnVlKTtcbiAgICB2YXIgc291cmNlcyA9IHNtYy5fc291cmNlcyA9IEFycmF5U2V0LmZyb21BcnJheShhU291cmNlTWFwLl9zb3VyY2VzLnRvQXJyYXkoKSwgdHJ1ZSk7XG4gICAgc21jLnNvdXJjZVJvb3QgPSBhU291cmNlTWFwLl9zb3VyY2VSb290O1xuICAgIHNtYy5zb3VyY2VzQ29udGVudCA9IGFTb3VyY2VNYXAuX2dlbmVyYXRlU291cmNlc0NvbnRlbnQoc21jLl9zb3VyY2VzLnRvQXJyYXkoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtYy5zb3VyY2VSb290KTtcbiAgICBzbWMuZmlsZSA9IGFTb3VyY2VNYXAuX2ZpbGU7XG4gICAgc21jLl9zb3VyY2VNYXBVUkwgPSBhU291cmNlTWFwVVJMO1xuICAgIHNtYy5fYWJzb2x1dGVTb3VyY2VzID0gc21jLl9zb3VyY2VzLnRvQXJyYXkoKS5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiB1dGlsLmNvbXB1dGVTb3VyY2VVUkwoc21jLnNvdXJjZVJvb3QsIHMsIGFTb3VyY2VNYXBVUkwpO1xuICAgIH0pO1xuXG4gICAgLy8gQmVjYXVzZSB3ZSBhcmUgbW9kaWZ5aW5nIHRoZSBlbnRyaWVzIChieSBjb252ZXJ0aW5nIHN0cmluZyBzb3VyY2VzIGFuZFxuICAgIC8vIG5hbWVzIHRvIGluZGljZXMgaW50byB0aGUgc291cmNlcyBhbmQgbmFtZXMgQXJyYXlTZXRzKSwgd2UgaGF2ZSB0byBtYWtlXG4gICAgLy8gYSBjb3B5IG9mIHRoZSBlbnRyeSBvciBlbHNlIGJhZCB0aGluZ3MgaGFwcGVuLiBTaGFyZWQgbXV0YWJsZSBzdGF0ZVxuICAgIC8vIHN0cmlrZXMgYWdhaW4hIFNlZSBnaXRodWIgaXNzdWUgIzE5MS5cblxuICAgIHZhciBnZW5lcmF0ZWRNYXBwaW5ncyA9IGFTb3VyY2VNYXAuX21hcHBpbmdzLnRvQXJyYXkoKS5zbGljZSgpO1xuICAgIHZhciBkZXN0R2VuZXJhdGVkTWFwcGluZ3MgPSBzbWMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IFtdO1xuICAgIHZhciBkZXN0T3JpZ2luYWxNYXBwaW5ncyA9IHNtYy5fX29yaWdpbmFsTWFwcGluZ3MgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNyY01hcHBpbmcgPSBnZW5lcmF0ZWRNYXBwaW5nc1tpXTtcbiAgICAgIHZhciBkZXN0TWFwcGluZyA9IG5ldyBNYXBwaW5nO1xuICAgICAgZGVzdE1hcHBpbmcuZ2VuZXJhdGVkTGluZSA9IHNyY01hcHBpbmcuZ2VuZXJhdGVkTGluZTtcbiAgICAgIGRlc3RNYXBwaW5nLmdlbmVyYXRlZENvbHVtbiA9IHNyY01hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICBpZiAoc3JjTWFwcGluZy5zb3VyY2UpIHtcbiAgICAgICAgZGVzdE1hcHBpbmcuc291cmNlID0gc291cmNlcy5pbmRleE9mKHNyY01hcHBpbmcuc291cmNlKTtcbiAgICAgICAgZGVzdE1hcHBpbmcub3JpZ2luYWxMaW5lID0gc3JjTWFwcGluZy5vcmlnaW5hbExpbmU7XG4gICAgICAgIGRlc3RNYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gc3JjTWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICBpZiAoc3JjTWFwcGluZy5uYW1lKSB7XG4gICAgICAgICAgZGVzdE1hcHBpbmcubmFtZSA9IG5hbWVzLmluZGV4T2Yoc3JjTWFwcGluZy5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc3RPcmlnaW5hbE1hcHBpbmdzLnB1c2goZGVzdE1hcHBpbmcpO1xuICAgICAgfVxuXG4gICAgICBkZXN0R2VuZXJhdGVkTWFwcGluZ3MucHVzaChkZXN0TWFwcGluZyk7XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KHNtYy5fX29yaWdpbmFsTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMpO1xuXG4gICAgcmV0dXJuIHNtYztcbiAgfTtcblxuLyoqXG4gKiBUaGUgdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcHBpbmcgc3BlYyB0aGF0IHdlIGFyZSBjb25zdW1pbmcuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBvcmlnaW5hbCBzb3VyY2VzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdzb3VyY2VzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWJzb2x1dGVTb3VyY2VzLnNsaWNlKCk7XG4gIH1cbn0pO1xuXG4vKipcbiAqIFByb3ZpZGUgdGhlIEpJVCB3aXRoIGEgbmljZSBzaGFwZSAvIGhpZGRlbiBjbGFzcy5cbiAqL1xuZnVuY3Rpb24gTWFwcGluZygpIHtcbiAgdGhpcy5nZW5lcmF0ZWRMaW5lID0gMDtcbiAgdGhpcy5nZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICB0aGlzLnNvdXJjZSA9IG51bGw7XG4gIHRoaXMub3JpZ2luYWxMaW5lID0gbnVsbDtcbiAgdGhpcy5vcmlnaW5hbENvbHVtbiA9IG51bGw7XG4gIHRoaXMubmFtZSA9IG51bGw7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB2YXIgZ2VuZXJhdGVkTGluZSA9IDE7XG4gICAgdmFyIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbExpbmUgPSAwO1xuICAgIHZhciBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNTb3VyY2UgPSAwO1xuICAgIHZhciBwcmV2aW91c05hbWUgPSAwO1xuICAgIHZhciBsZW5ndGggPSBhU3RyLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjYWNoZWRTZWdtZW50cyA9IHt9O1xuICAgIHZhciB0ZW1wID0ge307XG4gICAgdmFyIG9yaWdpbmFsTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgbWFwcGluZywgc3RyLCBzZWdtZW50LCBlbmQsIHZhbHVlO1xuXG4gICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBpZiAoYVN0ci5jaGFyQXQoaW5kZXgpID09PSAnOycpIHtcbiAgICAgICAgZ2VuZXJhdGVkTGluZSsrO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhU3RyLmNoYXJBdChpbmRleCkgPT09ICcsJykge1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG1hcHBpbmcgPSBuZXcgTWFwcGluZygpO1xuICAgICAgICBtYXBwaW5nLmdlbmVyYXRlZExpbmUgPSBnZW5lcmF0ZWRMaW5lO1xuXG4gICAgICAgIC8vIEJlY2F1c2UgZWFjaCBvZmZzZXQgaXMgZW5jb2RlZCByZWxhdGl2ZSB0byB0aGUgcHJldmlvdXMgb25lLFxuICAgICAgICAvLyBtYW55IHNlZ21lbnRzIG9mdGVuIGhhdmUgdGhlIHNhbWUgZW5jb2RpbmcuIFdlIGNhbiBleHBsb2l0IHRoaXNcbiAgICAgICAgLy8gZmFjdCBieSBjYWNoaW5nIHRoZSBwYXJzZWQgdmFyaWFibGUgbGVuZ3RoIGZpZWxkcyBvZiBlYWNoIHNlZ21lbnQsXG4gICAgICAgIC8vIGFsbG93aW5nIHVzIHRvIGF2b2lkIGEgc2Vjb25kIHBhcnNlIGlmIHdlIGVuY291bnRlciB0aGUgc2FtZVxuICAgICAgICAvLyBzZWdtZW50IGFnYWluLlxuICAgICAgICBmb3IgKGVuZCA9IGluZGV4OyBlbmQgPCBsZW5ndGg7IGVuZCsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2NoYXJJc01hcHBpbmdTZXBhcmF0b3IoYVN0ciwgZW5kKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0ciA9IGFTdHIuc2xpY2UoaW5kZXgsIGVuZCk7XG5cbiAgICAgICAgc2VnbWVudCA9IGNhY2hlZFNlZ21lbnRzW3N0cl07XG4gICAgICAgIGlmIChzZWdtZW50KSB7XG4gICAgICAgICAgaW5kZXggKz0gc3RyLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWdtZW50ID0gW107XG4gICAgICAgICAgd2hpbGUgKGluZGV4IDwgZW5kKSB7XG4gICAgICAgICAgICBiYXNlNjRWTFEuZGVjb2RlKGFTdHIsIGluZGV4LCB0ZW1wKTtcbiAgICAgICAgICAgIHZhbHVlID0gdGVtcC52YWx1ZTtcbiAgICAgICAgICAgIGluZGV4ID0gdGVtcC5yZXN0O1xuICAgICAgICAgICAgc2VnbWVudC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgYSBzb3VyY2UsIGJ1dCBubyBsaW5lIGFuZCBjb2x1bW4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgYSBzb3VyY2UgYW5kIGxpbmUsIGJ1dCBubyBjb2x1bW4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYWNoZWRTZWdtZW50c1tzdHJdID0gc2VnbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdlbmVyYXRlZCBjb2x1bW4uXG4gICAgICAgIG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uID0gcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gKyBzZWdtZW50WzBdO1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICAgIGlmIChzZWdtZW50Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAvLyBPcmlnaW5hbCBzb3VyY2UuXG4gICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSBwcmV2aW91c1NvdXJjZSArIHNlZ21lbnRbMV07XG4gICAgICAgICAgcHJldmlvdXNTb3VyY2UgKz0gc2VnbWVudFsxXTtcblxuICAgICAgICAgIC8vIE9yaWdpbmFsIGxpbmUuXG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgPSBwcmV2aW91c09yaWdpbmFsTGluZSArIHNlZ21lbnRbMl07XG4gICAgICAgICAgcHJldmlvdXNPcmlnaW5hbExpbmUgPSBtYXBwaW5nLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAvLyBMaW5lcyBhcmUgc3RvcmVkIDAtYmFzZWRcbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSArPSAxO1xuXG4gICAgICAgICAgLy8gT3JpZ2luYWwgY29sdW1uLlxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4gPSBwcmV2aW91c09yaWdpbmFsQ29sdW1uICsgc2VnbWVudFszXTtcbiAgICAgICAgICBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gbWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICAgIGlmIChzZWdtZW50Lmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgIC8vIE9yaWdpbmFsIG5hbWUuXG4gICAgICAgICAgICBtYXBwaW5nLm5hbWUgPSBwcmV2aW91c05hbWUgKyBzZWdtZW50WzRdO1xuICAgICAgICAgICAgcHJldmlvdXNOYW1lICs9IHNlZ21lbnRbNF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2VuZXJhdGVkTWFwcGluZ3MucHVzaChtYXBwaW5nKTtcbiAgICAgICAgaWYgKHR5cGVvZiBtYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBvcmlnaW5hbE1hcHBpbmdzLnB1c2gobWFwcGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBxdWlja1NvcnQoZ2VuZXJhdGVkTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQpO1xuICAgIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IGdlbmVyYXRlZE1hcHBpbmdzO1xuXG4gICAgcXVpY2tTb3J0KG9yaWdpbmFsTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMpO1xuICAgIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzID0gb3JpZ2luYWxNYXBwaW5ncztcbiAgfTtcblxuLyoqXG4gKiBGaW5kIHRoZSBtYXBwaW5nIHRoYXQgYmVzdCBtYXRjaGVzIHRoZSBoeXBvdGhldGljYWwgXCJuZWVkbGVcIiBtYXBwaW5nIHRoYXRcbiAqIHdlIGFyZSBzZWFyY2hpbmcgZm9yIGluIHRoZSBnaXZlbiBcImhheXN0YWNrXCIgb2YgbWFwcGluZ3MuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9maW5kTWFwcGluZyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2ZpbmRNYXBwaW5nKGFOZWVkbGUsIGFNYXBwaW5ncywgYUxpbmVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhQ29sdW1uTmFtZSwgYUNvbXBhcmF0b3IsIGFCaWFzKSB7XG4gICAgLy8gVG8gcmV0dXJuIHRoZSBwb3NpdGlvbiB3ZSBhcmUgc2VhcmNoaW5nIGZvciwgd2UgbXVzdCBmaXJzdCBmaW5kIHRoZVxuICAgIC8vIG1hcHBpbmcgZm9yIHRoZSBnaXZlbiBwb3NpdGlvbiBhbmQgdGhlbiByZXR1cm4gdGhlIG9wcG9zaXRlIHBvc2l0aW9uIGl0XG4gICAgLy8gcG9pbnRzIHRvLiBCZWNhdXNlIHRoZSBtYXBwaW5ncyBhcmUgc29ydGVkLCB3ZSBjYW4gdXNlIGJpbmFyeSBzZWFyY2ggdG9cbiAgICAvLyBmaW5kIHRoZSBiZXN0IG1hcHBpbmcuXG5cbiAgICBpZiAoYU5lZWRsZVthTGluZU5hbWVdIDw9IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0xpbmUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMSwgZ290ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyBhTmVlZGxlW2FMaW5lTmFtZV0pO1xuICAgIH1cbiAgICBpZiAoYU5lZWRsZVthQ29sdW1uTmFtZV0gPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb2x1bW4gbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMCwgZ290ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyBhTmVlZGxlW2FDb2x1bW5OYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJpbmFyeVNlYXJjaC5zZWFyY2goYU5lZWRsZSwgYU1hcHBpbmdzLCBhQ29tcGFyYXRvciwgYUJpYXMpO1xuICB9O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIGxhc3QgY29sdW1uIGZvciBlYWNoIGdlbmVyYXRlZCBtYXBwaW5nLiBUaGUgbGFzdCBjb2x1bW4gaXNcbiAqIGluY2x1c2l2ZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuY29tcHV0ZUNvbHVtblNwYW5zID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfY29tcHV0ZUNvbHVtblNwYW5zKCkge1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICAvLyBNYXBwaW5ncyBkbyBub3QgY29udGFpbiBhIGZpZWxkIGZvciB0aGUgbGFzdCBnZW5lcmF0ZWQgY29sdW1udC4gV2VcbiAgICAgIC8vIGNhbiBjb21lIHVwIHdpdGggYW4gb3B0aW1pc3RpYyBlc3RpbWF0ZSwgaG93ZXZlciwgYnkgYXNzdW1pbmcgdGhhdFxuICAgICAgLy8gbWFwcGluZ3MgYXJlIGNvbnRpZ3VvdXMgKGkuZS4gZ2l2ZW4gdHdvIGNvbnNlY3V0aXZlIG1hcHBpbmdzLCB0aGVcbiAgICAgIC8vIGZpcnN0IG1hcHBpbmcgZW5kcyB3aGVyZSB0aGUgc2Vjb25kIG9uZSBzdGFydHMpLlxuICAgICAgaWYgKGluZGV4ICsgMSA8IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzLmxlbmd0aCkge1xuICAgICAgICB2YXIgbmV4dE1hcHBpbmcgPSB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5nc1tpbmRleCArIDFdO1xuXG4gICAgICAgIGlmIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgPT09IG5leHRNYXBwaW5nLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgICBtYXBwaW5nLmxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBuZXh0TWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLSAxO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBsYXN0IG1hcHBpbmcgZm9yIGVhY2ggbGluZSBzcGFucyB0aGUgZW50aXJlIGxpbmUuXG4gICAgICBtYXBwaW5nLmxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBJbmZpbml0eTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgb3JpZ2luYWwgc291cmNlLCBsaW5lLCBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgZ2VuZXJhdGVkXG4gKiBzb3VyY2UncyBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zIHByb3ZpZGVkLiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3RcbiAqIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuICBUaGUgbGluZSBudW1iZXJcbiAqICAgICBpcyAxLWJhc2VkLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuICBUaGUgY29sdW1uXG4gKiAgICAgbnVtYmVyIGlzIDAtYmFzZWQuXG4gKiAgIC0gYmlhczogRWl0aGVyICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgb3JpZ2luYWwgc291cmNlIGZpbGUsIG9yIG51bGwuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuICBUaGVcbiAqICAgICBsaW5lIG51bWJlciBpcyAxLWJhc2VkLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSwgb3IgbnVsbC4gIFRoZVxuICogICAgIGNvbHVtbiBudW1iZXIgaXMgMC1iYXNlZC5cbiAqICAgLSBuYW1lOiBUaGUgb3JpZ2luYWwgaWRlbnRpZmllciwgb3IgbnVsbC5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUub3JpZ2luYWxQb3NpdGlvbkZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX29yaWdpbmFsUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICB2YXIgbmVlZGxlID0ge1xuICAgICAgZ2VuZXJhdGVkTGluZTogdXRpbC5nZXRBcmcoYUFyZ3MsICdsaW5lJyksXG4gICAgICBnZW5lcmF0ZWRDb2x1bW46IHV0aWwuZ2V0QXJnKGFBcmdzLCAnY29sdW1uJylcbiAgICB9O1xuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZE1hcHBpbmcoXG4gICAgICBuZWVkbGUsXG4gICAgICB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncyxcbiAgICAgIFwiZ2VuZXJhdGVkTGluZVwiLFxuICAgICAgXCJnZW5lcmF0ZWRDb2x1bW5cIixcbiAgICAgIHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQsXG4gICAgICB1dGlsLmdldEFyZyhhQXJncywgJ2JpYXMnLCBTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORClcbiAgICApO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICBpZiAobWFwcGluZy5nZW5lcmF0ZWRMaW5lID09PSBuZWVkbGUuZ2VuZXJhdGVkTGluZSkge1xuICAgICAgICB2YXIgc291cmNlID0gdXRpbC5nZXRBcmcobWFwcGluZywgJ3NvdXJjZScsIG51bGwpO1xuICAgICAgICBpZiAoc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgc291cmNlID0gdGhpcy5fc291cmNlcy5hdChzb3VyY2UpO1xuICAgICAgICAgIHNvdXJjZSA9IHV0aWwuY29tcHV0ZVNvdXJjZVVSTCh0aGlzLnNvdXJjZVJvb3QsIHNvdXJjZSwgdGhpcy5fc291cmNlTWFwVVJMKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmFtZSA9IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICduYW1lJywgbnVsbCk7XG4gICAgICAgIGlmIChuYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgbmFtZSA9IHRoaXMuX25hbWVzLmF0KG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ29yaWdpbmFsTGluZScsIG51bGwpLFxuICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ29yaWdpbmFsQ29sdW1uJywgbnVsbCksXG4gICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2U6IG51bGwsXG4gICAgICBsaW5lOiBudWxsLFxuICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgbmFtZTogbnVsbFxuICAgIH07XG4gIH07XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgd2UgaGF2ZSB0aGUgc291cmNlIGNvbnRlbnQgZm9yIGV2ZXJ5IHNvdXJjZSBpbiB0aGUgc291cmNlXG4gKiBtYXAsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMgPVxuICBmdW5jdGlvbiBCYXNpY1NvdXJjZU1hcENvbnN1bWVyX2hhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCkge1xuICAgIGlmICghdGhpcy5zb3VyY2VzQ29udGVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudC5sZW5ndGggPj0gdGhpcy5fc291cmNlcy5zaXplKCkgJiZcbiAgICAgICF0aGlzLnNvdXJjZXNDb250ZW50LnNvbWUoZnVuY3Rpb24gKHNjKSB7IHJldHVybiBzYyA9PSBudWxsOyB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29udGVudC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgdGhlIHVybCBvZiB0aGVcbiAqIG9yaWdpbmFsIHNvdXJjZSBmaWxlLiBSZXR1cm5zIG51bGwgaWYgbm8gb3JpZ2luYWwgc291cmNlIGNvbnRlbnQgaXNcbiAqIGF2YWlsYWJsZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3NvdXJjZUNvbnRlbnRGb3IoYVNvdXJjZSwgbnVsbE9uTWlzc2luZykge1xuICAgIGlmICghdGhpcy5zb3VyY2VzQ29udGVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZFNvdXJjZUluZGV4KGFTb3VyY2UpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudFtpbmRleF07XG4gICAgfVxuXG4gICAgdmFyIHJlbGF0aXZlU291cmNlID0gYVNvdXJjZTtcbiAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIHJlbGF0aXZlU291cmNlID0gdXRpbC5yZWxhdGl2ZSh0aGlzLnNvdXJjZVJvb3QsIHJlbGF0aXZlU291cmNlKTtcbiAgICB9XG5cbiAgICB2YXIgdXJsO1xuICAgIGlmICh0aGlzLnNvdXJjZVJvb3QgIT0gbnVsbFxuICAgICAgICAmJiAodXJsID0gdXRpbC51cmxQYXJzZSh0aGlzLnNvdXJjZVJvb3QpKSkge1xuICAgICAgLy8gWFhYOiBmaWxlOi8vIFVSSXMgYW5kIGFic29sdXRlIHBhdGhzIGxlYWQgdG8gdW5leHBlY3RlZCBiZWhhdmlvciBmb3JcbiAgICAgIC8vIG1hbnkgdXNlcnMuIFdlIGNhbiBoZWxwIHRoZW0gb3V0IHdoZW4gdGhleSBleHBlY3QgZmlsZTovLyBVUklzIHRvXG4gICAgICAvLyBiZWhhdmUgbGlrZSBpdCB3b3VsZCBpZiB0aGV5IHdlcmUgcnVubmluZyBhIGxvY2FsIEhUVFAgc2VydmVyLiBTZWVcbiAgICAgIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTg4NTU5Ny5cbiAgICAgIHZhciBmaWxlVXJpQWJzUGF0aCA9IHJlbGF0aXZlU291cmNlLnJlcGxhY2UoL15maWxlOlxcL1xcLy8sIFwiXCIpO1xuICAgICAgaWYgKHVybC5zY2hlbWUgPT0gXCJmaWxlXCJcbiAgICAgICAgICAmJiB0aGlzLl9zb3VyY2VzLmhhcyhmaWxlVXJpQWJzUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlc0NvbnRlbnRbdGhpcy5fc291cmNlcy5pbmRleE9mKGZpbGVVcmlBYnNQYXRoKV1cbiAgICAgIH1cblxuICAgICAgaWYgKCghdXJsLnBhdGggfHwgdXJsLnBhdGggPT0gXCIvXCIpXG4gICAgICAgICAgJiYgdGhpcy5fc291cmNlcy5oYXMoXCIvXCIgKyByZWxhdGl2ZVNvdXJjZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlc0NvbnRlbnRbdGhpcy5fc291cmNlcy5pbmRleE9mKFwiL1wiICsgcmVsYXRpdmVTb3VyY2UpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgcmVjdXJzaXZlbHkgZnJvbVxuICAgIC8vIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvci4gSW4gdGhhdCBjYXNlLCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gdGhyb3cgaWYgd2UgY2FuJ3QgZmluZCB0aGUgc291cmNlIC0gd2UganVzdCB3YW50IHRvXG4gICAgLy8gcmV0dXJuIG51bGwsIHNvIHdlIHByb3ZpZGUgYSBmbGFnIHRvIGV4aXQgZ3JhY2VmdWxseS5cbiAgICBpZiAobnVsbE9uTWlzc2luZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyByZWxhdGl2ZVNvdXJjZSArICdcIiBpcyBub3QgaW4gdGhlIFNvdXJjZU1hcC4nKTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIG9yaWdpbmFsIHNvdXJjZSxcbiAqIGxpbmUsIGFuZCBjb2x1bW4gcG9zaXRpb25zIHByb3ZpZGVkLiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3Qgd2l0aFxuICogdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBzb3VyY2U6IFRoZSBmaWxlbmFtZSBvZiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLiAgVGhlIGxpbmUgbnVtYmVyXG4gKiAgICAgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuICBUaGUgY29sdW1uXG4gKiAgICAgbnVtYmVyIGlzIDAtYmFzZWQuXG4gKiAgIC0gYmlhczogRWl0aGVyICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLiAgVGhlXG4gKiAgICAgbGluZSBudW1iZXIgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICogICAgIFRoZSBjb2x1bW4gbnVtYmVyIGlzIDAtYmFzZWQuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmdlbmVyYXRlZFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZ2VuZXJhdGVkUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICB2YXIgc291cmNlID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnKTtcbiAgICBzb3VyY2UgPSB0aGlzLl9maW5kU291cmNlSW5kZXgoc291cmNlKTtcbiAgICBpZiAoc291cmNlIDwgMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluZTogbnVsbCxcbiAgICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgICBsYXN0Q29sdW1uOiBudWxsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIG9yaWdpbmFsTGluZTogdXRpbC5nZXRBcmcoYUFyZ3MsICdsaW5lJyksXG4gICAgICBvcmlnaW5hbENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nKVxuICAgIH07XG5cbiAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kTWFwcGluZyhcbiAgICAgIG5lZWRsZSxcbiAgICAgIHRoaXMuX29yaWdpbmFsTWFwcGluZ3MsXG4gICAgICBcIm9yaWdpbmFsTGluZVwiLFxuICAgICAgXCJvcmlnaW5hbENvbHVtblwiLFxuICAgICAgdXRpbC5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyxcbiAgICAgIHV0aWwuZ2V0QXJnKGFBcmdzLCAnYmlhcycsIFNvdXJjZU1hcENvbnN1bWVyLkdSRUFURVNUX0xPV0VSX0JPVU5EKVxuICAgICk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzW2luZGV4XTtcblxuICAgICAgaWYgKG1hcHBpbmcuc291cmNlID09PSBuZWVkbGUuc291cmNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZExpbmUnLCBudWxsKSxcbiAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICBsYXN0Q29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnbGFzdEdlbmVyYXRlZENvbHVtbicsIG51bGwpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmU6IG51bGwsXG4gICAgICBjb2x1bW46IG51bGwsXG4gICAgICBsYXN0Q29sdW1uOiBudWxsXG4gICAgfTtcbiAgfTtcblxuZXhwb3J0cy5CYXNpY1NvdXJjZU1hcENvbnN1bWVyID0gQmFzaWNTb3VyY2VNYXBDb25zdW1lcjtcblxuLyoqXG4gKiBBbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIgaW5zdGFuY2UgcmVwcmVzZW50cyBhIHBhcnNlZCBzb3VyY2UgbWFwIHdoaWNoXG4gKiB3ZSBjYW4gcXVlcnkgZm9yIGluZm9ybWF0aW9uLiBJdCBkaWZmZXJzIGZyb20gQmFzaWNTb3VyY2VNYXBDb25zdW1lciBpblxuICogdGhhdCBpdCB0YWtlcyBcImluZGV4ZWRcIiBzb3VyY2UgbWFwcyAoaS5lLiBvbmVzIHdpdGggYSBcInNlY3Rpb25zXCIgZmllbGQpIGFzXG4gKiBpbnB1dC5cbiAqXG4gKiBUaGUgZmlyc3QgcGFyYW1ldGVyIGlzIGEgcmF3IHNvdXJjZSBtYXAgKGVpdGhlciBhcyBhIEpTT04gc3RyaW5nLCBvciBhbHJlYWR5XG4gKiBwYXJzZWQgdG8gYW4gb2JqZWN0KS4gQWNjb3JkaW5nIHRvIHRoZSBzcGVjIGZvciBpbmRleGVkIHNvdXJjZSBtYXBzLCB0aGV5XG4gKiBoYXZlIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlczpcbiAqXG4gKiAgIC0gdmVyc2lvbjogV2hpY2ggdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcCBzcGVjIHRoaXMgbWFwIGlzIGZvbGxvd2luZy5cbiAqICAgLSBmaWxlOiBPcHRpb25hbC4gVGhlIGdlbmVyYXRlZCBmaWxlIHRoaXMgc291cmNlIG1hcCBpcyBhc3NvY2lhdGVkIHdpdGguXG4gKiAgIC0gc2VjdGlvbnM6IEEgbGlzdCBvZiBzZWN0aW9uIGRlZmluaXRpb25zLlxuICpcbiAqIEVhY2ggdmFsdWUgdW5kZXIgdGhlIFwic2VjdGlvbnNcIiBmaWVsZCBoYXMgdHdvIGZpZWxkczpcbiAqICAgLSBvZmZzZXQ6IFRoZSBvZmZzZXQgaW50byB0aGUgb3JpZ2luYWwgc3BlY2lmaWVkIGF0IHdoaWNoIHRoaXMgc2VjdGlvblxuICogICAgICAgYmVnaW5zIHRvIGFwcGx5LCBkZWZpbmVkIGFzIGFuIG9iamVjdCB3aXRoIGEgXCJsaW5lXCIgYW5kIFwiY29sdW1uXCJcbiAqICAgICAgIGZpZWxkLlxuICogICAtIG1hcDogQSBzb3VyY2UgbWFwIGRlZmluaXRpb24uIFRoaXMgc291cmNlIG1hcCBjb3VsZCBhbHNvIGJlIGluZGV4ZWQsXG4gKiAgICAgICBidXQgZG9lc24ndCBoYXZlIHRvIGJlLlxuICpcbiAqIEluc3RlYWQgb2YgdGhlIFwibWFwXCIgZmllbGQsIGl0J3MgYWxzbyBwb3NzaWJsZSB0byBoYXZlIGEgXCJ1cmxcIiBmaWVsZFxuICogc3BlY2lmeWluZyBhIFVSTCB0byByZXRyaWV2ZSBhIHNvdXJjZSBtYXAgZnJvbSwgYnV0IHRoYXQncyBjdXJyZW50bHlcbiAqIHVuc3VwcG9ydGVkLlxuICpcbiAqIEhlcmUncyBhbiBleGFtcGxlIHNvdXJjZSBtYXAsIHRha2VuIGZyb20gdGhlIHNvdXJjZSBtYXAgc3BlY1swXSwgYnV0XG4gKiBtb2RpZmllZCB0byBvbWl0IGEgc2VjdGlvbiB3aGljaCB1c2VzIHRoZSBcInVybFwiIGZpZWxkLlxuICpcbiAqICB7XG4gKiAgICB2ZXJzaW9uIDogMyxcbiAqICAgIGZpbGU6IFwiYXBwLmpzXCIsXG4gKiAgICBzZWN0aW9uczogW3tcbiAqICAgICAgb2Zmc2V0OiB7bGluZToxMDAsIGNvbHVtbjoxMH0sXG4gKiAgICAgIG1hcDoge1xuICogICAgICAgIHZlcnNpb24gOiAzLFxuICogICAgICAgIGZpbGU6IFwic2VjdGlvbi5qc1wiLFxuICogICAgICAgIHNvdXJjZXM6IFtcImZvby5qc1wiLCBcImJhci5qc1wiXSxcbiAqICAgICAgICBuYW1lczogW1wic3JjXCIsIFwibWFwc1wiLCBcImFyZVwiLCBcImZ1blwiXSxcbiAqICAgICAgICBtYXBwaW5nczogXCJBQUFBLEU7O0FCQ0RFO1wiXG4gKiAgICAgIH1cbiAqICAgIH1dLFxuICogIH1cbiAqXG4gKiBUaGUgc2Vjb25kIHBhcmFtZXRlciwgaWYgZ2l2ZW4sIGlzIGEgc3RyaW5nIHdob3NlIHZhbHVlIGlzIHRoZSBVUkxcbiAqIGF0IHdoaWNoIHRoZSBzb3VyY2UgbWFwIHdhcyBmb3VuZC4gIFRoaXMgVVJMIGlzIHVzZWQgdG8gY29tcHV0ZSB0aGVcbiAqIHNvdXJjZXMgYXJyYXkuXG4gKlxuICogWzBdOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9kb2N1bWVudC9kLzFVMVJHQWVoUXdSeXBVVG92RjFLUmxwaU9GemUwYi1fMmdjNmZBSDBLWTBrL2VkaXQjaGVhZGluZz1oLjUzNWVzM3hlcHJndFxuICovXG5mdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCwgYVNvdXJjZU1hcFVSTCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IHV0aWwucGFyc2VTb3VyY2VNYXBJbnB1dChhU291cmNlTWFwKTtcbiAgfVxuXG4gIHZhciB2ZXJzaW9uID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAndmVyc2lvbicpO1xuICB2YXIgc2VjdGlvbnMgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzZWN0aW9ucycpO1xuXG4gIGlmICh2ZXJzaW9uICE9IHRoaXMuX3ZlcnNpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHZlcnNpb246ICcgKyB2ZXJzaW9uKTtcbiAgfVxuXG4gIHRoaXMuX3NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcblxuICB2YXIgbGFzdE9mZnNldCA9IHtcbiAgICBsaW5lOiAtMSxcbiAgICBjb2x1bW46IDBcbiAgfTtcbiAgdGhpcy5fc2VjdGlvbnMgPSBzZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICBpZiAocy51cmwpIHtcbiAgICAgIC8vIFRoZSB1cmwgZmllbGQgd2lsbCByZXF1aXJlIHN1cHBvcnQgZm9yIGFzeW5jaHJvbmljaXR5LlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvaXNzdWVzLzE2XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1cHBvcnQgZm9yIHVybCBmaWVsZCBpbiBzZWN0aW9ucyBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuICAgIHZhciBvZmZzZXQgPSB1dGlsLmdldEFyZyhzLCAnb2Zmc2V0Jyk7XG4gICAgdmFyIG9mZnNldExpbmUgPSB1dGlsLmdldEFyZyhvZmZzZXQsICdsaW5lJyk7XG4gICAgdmFyIG9mZnNldENvbHVtbiA9IHV0aWwuZ2V0QXJnKG9mZnNldCwgJ2NvbHVtbicpO1xuXG4gICAgaWYgKG9mZnNldExpbmUgPCBsYXN0T2Zmc2V0LmxpbmUgfHxcbiAgICAgICAgKG9mZnNldExpbmUgPT09IGxhc3RPZmZzZXQubGluZSAmJiBvZmZzZXRDb2x1bW4gPCBsYXN0T2Zmc2V0LmNvbHVtbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2VjdGlvbiBvZmZzZXRzIG11c3QgYmUgb3JkZXJlZCBhbmQgbm9uLW92ZXJsYXBwaW5nLicpO1xuICAgIH1cbiAgICBsYXN0T2Zmc2V0ID0gb2Zmc2V0O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdlbmVyYXRlZE9mZnNldDoge1xuICAgICAgICAvLyBUaGUgb2Zmc2V0IGZpZWxkcyBhcmUgMC1iYXNlZCwgYnV0IHdlIHVzZSAxLWJhc2VkIGluZGljZXMgd2hlblxuICAgICAgICAvLyBlbmNvZGluZy9kZWNvZGluZyBmcm9tIFZMUS5cbiAgICAgICAgZ2VuZXJhdGVkTGluZTogb2Zmc2V0TGluZSArIDEsXG4gICAgICAgIGdlbmVyYXRlZENvbHVtbjogb2Zmc2V0Q29sdW1uICsgMVxuICAgICAgfSxcbiAgICAgIGNvbnN1bWVyOiBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC5nZXRBcmcocywgJ21hcCcpLCBhU291cmNlTWFwVVJMKVxuICAgIH1cbiAgfSk7XG59XG5cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSk7XG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogVGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXBwaW5nIHNwZWMgdGhhdCB3ZSBhcmUgY29uc3VtaW5nLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBvcmlnaW5hbCBzb3VyY2VzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ3NvdXJjZXMnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzb3VyY2VzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9zZWN0aW9uc1tpXS5jb25zdW1lci5zb3VyY2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHNvdXJjZXMucHVzaCh0aGlzLl9zZWN0aW9uc1tpXS5jb25zdW1lci5zb3VyY2VzW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZXM7XG4gIH1cbn0pO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSwgbGluZSwgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLiAgVGhlIGxpbmUgbnVtYmVyXG4gKiAgICAgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLiAgVGhlIGNvbHVtblxuICogICAgIG51bWJlciBpcyAwLWJhc2VkLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlLCBvciBudWxsLlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLiAgVGhlXG4gKiAgICAgbGluZSBudW1iZXIgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuICBUaGVcbiAqICAgICBjb2x1bW4gbnVtYmVyIGlzIDAtYmFzZWQuXG4gKiAgIC0gbmFtZTogVGhlIG9yaWdpbmFsIGlkZW50aWZpZXIsIG9yIG51bGwuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUub3JpZ2luYWxQb3NpdGlvbkZvciA9XG4gIGZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcl9vcmlnaW5hbFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIGdlbmVyYXRlZExpbmU6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpLFxuICAgICAgZ2VuZXJhdGVkQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicpXG4gICAgfTtcblxuICAgIC8vIEZpbmQgdGhlIHNlY3Rpb24gY29udGFpbmluZyB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9uIHdlJ3JlIHRyeWluZyB0byBtYXBcbiAgICAvLyB0byBhbiBvcmlnaW5hbCBwb3NpdGlvbi5cbiAgICB2YXIgc2VjdGlvbkluZGV4ID0gYmluYXJ5U2VhcmNoLnNlYXJjaChuZWVkbGUsIHRoaXMuX3NlY3Rpb25zLFxuICAgICAgZnVuY3Rpb24obmVlZGxlLCBzZWN0aW9uKSB7XG4gICAgICAgIHZhciBjbXAgPSBuZWVkbGUuZ2VuZXJhdGVkTGluZSAtIHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmU7XG4gICAgICAgIGlmIChjbXApIHtcbiAgICAgICAgICByZXR1cm4gY21wO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChuZWVkbGUuZ2VuZXJhdGVkQ29sdW1uIC1cbiAgICAgICAgICAgICAgICBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgfSk7XG4gICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tzZWN0aW9uSW5kZXhdO1xuXG4gICAgaWYgKCFzZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzb3VyY2U6IG51bGwsXG4gICAgICAgIGxpbmU6IG51bGwsXG4gICAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgICAgbmFtZTogbnVsbFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjdGlvbi5jb25zdW1lci5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICAgIGxpbmU6IG5lZWRsZS5nZW5lcmF0ZWRMaW5lIC1cbiAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgLSAxKSxcbiAgICAgIGNvbHVtbjogbmVlZGxlLmdlbmVyYXRlZENvbHVtbiAtXG4gICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lID09PSBuZWVkbGUuZ2VuZXJhdGVkTGluZVxuICAgICAgICAgPyBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRDb2x1bW4gLSAxXG4gICAgICAgICA6IDApLFxuICAgICAgYmlhczogYUFyZ3MuYmlhc1xuICAgIH0pO1xuICB9O1xuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHdlIGhhdmUgdGhlIHNvdXJjZSBjb250ZW50IGZvciBldmVyeSBzb3VyY2UgaW4gdGhlIHNvdXJjZVxuICogbWFwLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlY3Rpb25zLmV2ZXJ5KGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcy5jb25zdW1lci5oYXNDb250ZW50c09mQWxsU291cmNlcygpO1xuICAgIH0pO1xuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSBjb250ZW50LiBUaGUgb25seSBhcmd1bWVudCBpcyB0aGUgdXJsIG9mIHRoZVxuICogb3JpZ2luYWwgc291cmNlIGZpbGUuIFJldHVybnMgbnVsbCBpZiBubyBvcmlnaW5hbCBzb3VyY2UgY29udGVudCBpc1xuICogYXZhaWxhYmxlLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLnNvdXJjZUNvbnRlbnRGb3IgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfc291cmNlQ29udGVudEZvcihhU291cmNlLCBudWxsT25NaXNzaW5nKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tpXTtcblxuICAgICAgdmFyIGNvbnRlbnQgPSBzZWN0aW9uLmNvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3IoYVNvdXJjZSwgdHJ1ZSk7XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG51bGxPbk1pc3NpbmcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsgYVNvdXJjZSArICdcIiBpcyBub3QgaW4gdGhlIFNvdXJjZU1hcC4nKTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIG9yaWdpbmFsIHNvdXJjZSxcbiAqIGxpbmUsIGFuZCBjb2x1bW4gcG9zaXRpb25zIHByb3ZpZGVkLiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3Qgd2l0aFxuICogdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBzb3VyY2U6IFRoZSBmaWxlbmFtZSBvZiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLiAgVGhlIGxpbmUgbnVtYmVyXG4gKiAgICAgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuICBUaGUgY29sdW1uXG4gKiAgICAgbnVtYmVyIGlzIDAtYmFzZWQuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLiAgVGhlXG4gKiAgICAgbGluZSBudW1iZXIgaXMgMS1iYXNlZC4gXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgICBUaGUgY29sdW1uIG51bWJlciBpcyAwLWJhc2VkLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmdlbmVyYXRlZFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX2dlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tpXTtcblxuICAgICAgLy8gT25seSBjb25zaWRlciB0aGlzIHNlY3Rpb24gaWYgdGhlIHJlcXVlc3RlZCBzb3VyY2UgaXMgaW4gdGhlIGxpc3Qgb2ZcbiAgICAgIC8vIHNvdXJjZXMgb2YgdGhlIGNvbnN1bWVyLlxuICAgICAgaWYgKHNlY3Rpb24uY29uc3VtZXIuX2ZpbmRTb3VyY2VJbmRleCh1dGlsLmdldEFyZyhhQXJncywgJ3NvdXJjZScpKSA9PT0gLTEpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgZ2VuZXJhdGVkUG9zaXRpb24gPSBzZWN0aW9uLmNvbnN1bWVyLmdlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKTtcbiAgICAgIGlmIChnZW5lcmF0ZWRQb3NpdGlvbikge1xuICAgICAgICB2YXIgcmV0ID0ge1xuICAgICAgICAgIGxpbmU6IGdlbmVyYXRlZFBvc2l0aW9uLmxpbmUgK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgLSAxKSxcbiAgICAgICAgICBjb2x1bW46IGdlbmVyYXRlZFBvc2l0aW9uLmNvbHVtbiArXG4gICAgICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSA9PT0gZ2VuZXJhdGVkUG9zaXRpb24ubGluZVxuICAgICAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgICAgIDogMClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZTogbnVsbCxcbiAgICAgIGNvbHVtbjogbnVsbFxuICAgIH07XG4gIH07XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9wYXJzZU1hcHBpbmdzID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbaV07XG4gICAgICB2YXIgc2VjdGlvbk1hcHBpbmdzID0gc2VjdGlvbi5jb25zdW1lci5fZ2VuZXJhdGVkTWFwcGluZ3M7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlY3Rpb25NYXBwaW5ncy5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgbWFwcGluZyA9IHNlY3Rpb25NYXBwaW5nc1tqXTtcblxuICAgICAgICB2YXIgc291cmNlID0gc2VjdGlvbi5jb25zdW1lci5fc291cmNlcy5hdChtYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIHNvdXJjZSA9IHV0aWwuY29tcHV0ZVNvdXJjZVVSTChzZWN0aW9uLmNvbnN1bWVyLnNvdXJjZVJvb3QsIHNvdXJjZSwgdGhpcy5fc291cmNlTWFwVVJMKTtcbiAgICAgICAgdGhpcy5fc291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgICAgc291cmNlID0gdGhpcy5fc291cmNlcy5pbmRleE9mKHNvdXJjZSk7XG5cbiAgICAgICAgdmFyIG5hbWUgPSBudWxsO1xuICAgICAgICBpZiAobWFwcGluZy5uYW1lKSB7XG4gICAgICAgICAgbmFtZSA9IHNlY3Rpb24uY29uc3VtZXIuX25hbWVzLmF0KG1hcHBpbmcubmFtZSk7XG4gICAgICAgICAgdGhpcy5fbmFtZXMuYWRkKG5hbWUpO1xuICAgICAgICAgIG5hbWUgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIG1hcHBpbmdzIGNvbWluZyBmcm9tIHRoZSBjb25zdW1lciBmb3IgdGhlIHNlY3Rpb24gaGF2ZVxuICAgICAgICAvLyBnZW5lcmF0ZWQgcG9zaXRpb25zIHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGUgc2VjdGlvbiwgc28gd2VcbiAgICAgICAgLy8gbmVlZCB0byBvZmZzZXQgdGhlbSB0byBiZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgb2YgdGhlIGNvbmNhdGVuYXRlZFxuICAgICAgICAvLyBnZW5lcmF0ZWQgZmlsZS5cbiAgICAgICAgdmFyIGFkanVzdGVkTWFwcGluZyA9IHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICBnZW5lcmF0ZWRMaW5lOiBtYXBwaW5nLmdlbmVyYXRlZExpbmUgK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgLSAxKSxcbiAgICAgICAgICBnZW5lcmF0ZWRDb2x1bW46IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lID09PSBtYXBwaW5nLmdlbmVyYXRlZExpbmVcbiAgICAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgICAgOiAwKSxcbiAgICAgICAgICBvcmlnaW5hbExpbmU6IG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgIG9yaWdpbmFsQ29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MucHVzaChhZGp1c3RlZE1hcHBpbmcpO1xuICAgICAgICBpZiAodHlwZW9mIGFkanVzdGVkTWFwcGluZy5vcmlnaW5hbExpbmUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MucHVzaChhZGp1c3RlZE1hcHBpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncywgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCk7XG4gICAgcXVpY2tTb3J0KHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcbiAgfTtcblxuZXhwb3J0cy5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIgPSBJbmRleGVkU291cmNlTWFwQ29uc3VtZXI7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbmV4cG9ydHMuR1JFQVRFU1RfTE9XRVJfQk9VTkQgPSAxO1xuZXhwb3J0cy5MRUFTVF9VUFBFUl9CT1VORCA9IDI7XG5cbi8qKlxuICogUmVjdXJzaXZlIGltcGxlbWVudGF0aW9uIG9mIGJpbmFyeSBzZWFyY2guXG4gKlxuICogQHBhcmFtIGFMb3cgSW5kaWNlcyBoZXJlIGFuZCBsb3dlciBkbyBub3QgY29udGFpbiB0aGUgbmVlZGxlLlxuICogQHBhcmFtIGFIaWdoIEluZGljZXMgaGVyZSBhbmQgaGlnaGVyIGRvIG5vdCBjb250YWluIHRoZSBuZWVkbGUuXG4gKiBAcGFyYW0gYU5lZWRsZSBUaGUgZWxlbWVudCBiZWluZyBzZWFyY2hlZCBmb3IuXG4gKiBAcGFyYW0gYUhheXN0YWNrIFRoZSBub24tZW1wdHkgYXJyYXkgYmVpbmcgc2VhcmNoZWQuXG4gKiBAcGFyYW0gYUNvbXBhcmUgRnVuY3Rpb24gd2hpY2ggdGFrZXMgdHdvIGVsZW1lbnRzIGFuZCByZXR1cm5zIC0xLCAwLCBvciAxLlxuICogQHBhcmFtIGFCaWFzIEVpdGhlciAnYmluYXJ5U2VhcmNoLkdSRUFURVNUX0xPV0VSX0JPVU5EJyBvclxuICogICAgICdiaW5hcnlTZWFyY2guTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICovXG5mdW5jdGlvbiByZWN1cnNpdmVTZWFyY2goYUxvdywgYUhpZ2gsIGFOZWVkbGUsIGFIYXlzdGFjaywgYUNvbXBhcmUsIGFCaWFzKSB7XG4gIC8vIFRoaXMgZnVuY3Rpb24gdGVybWluYXRlcyB3aGVuIG9uZSBvZiB0aGUgZm9sbG93aW5nIGlzIHRydWU6XG4gIC8vXG4gIC8vICAgMS4gV2UgZmluZCB0aGUgZXhhY3QgZWxlbWVudCB3ZSBhcmUgbG9va2luZyBmb3IuXG4gIC8vXG4gIC8vICAgMi4gV2UgZGlkIG5vdCBmaW5kIHRoZSBleGFjdCBlbGVtZW50LCBidXQgd2UgY2FuIHJldHVybiB0aGUgaW5kZXggb2ZcbiAgLy8gICAgICB0aGUgbmV4dC1jbG9zZXN0IGVsZW1lbnQuXG4gIC8vXG4gIC8vICAgMy4gV2UgZGlkIG5vdCBmaW5kIHRoZSBleGFjdCBlbGVtZW50LCBhbmQgdGhlcmUgaXMgbm8gbmV4dC1jbG9zZXN0XG4gIC8vICAgICAgZWxlbWVudCB0aGFuIHRoZSBvbmUgd2UgYXJlIHNlYXJjaGluZyBmb3IsIHNvIHdlIHJldHVybiAtMS5cbiAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGFIaWdoIC0gYUxvdykgLyAyKSArIGFMb3c7XG4gIHZhciBjbXAgPSBhQ29tcGFyZShhTmVlZGxlLCBhSGF5c3RhY2tbbWlkXSwgdHJ1ZSk7XG4gIGlmIChjbXAgPT09IDApIHtcbiAgICAvLyBGb3VuZCB0aGUgZWxlbWVudCB3ZSBhcmUgbG9va2luZyBmb3IuXG4gICAgcmV0dXJuIG1pZDtcbiAgfVxuICBlbHNlIGlmIChjbXAgPiAwKSB7XG4gICAgLy8gT3VyIG5lZWRsZSBpcyBncmVhdGVyIHRoYW4gYUhheXN0YWNrW21pZF0uXG4gICAgaWYgKGFIaWdoIC0gbWlkID4gMSkge1xuICAgICAgLy8gVGhlIGVsZW1lbnQgaXMgaW4gdGhlIHVwcGVyIGhhbGYuXG4gICAgICByZXR1cm4gcmVjdXJzaXZlU2VhcmNoKG1pZCwgYUhpZ2gsIGFOZWVkbGUsIGFIYXlzdGFjaywgYUNvbXBhcmUsIGFCaWFzKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgZXhhY3QgbmVlZGxlIGVsZW1lbnQgd2FzIG5vdCBmb3VuZCBpbiB0aGlzIGhheXN0YWNrLiBEZXRlcm1pbmUgaWZcbiAgICAvLyB3ZSBhcmUgaW4gdGVybWluYXRpb24gY2FzZSAoMykgb3IgKDIpIGFuZCByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIHRoaW5nLlxuICAgIGlmIChhQmlhcyA9PSBleHBvcnRzLkxFQVNUX1VQUEVSX0JPVU5EKSB7XG4gICAgICByZXR1cm4gYUhpZ2ggPCBhSGF5c3RhY2subGVuZ3RoID8gYUhpZ2ggOiAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1pZDtcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gT3VyIG5lZWRsZSBpcyBsZXNzIHRoYW4gYUhheXN0YWNrW21pZF0uXG4gICAgaWYgKG1pZCAtIGFMb3cgPiAxKSB7XG4gICAgICAvLyBUaGUgZWxlbWVudCBpcyBpbiB0aGUgbG93ZXIgaGFsZi5cbiAgICAgIHJldHVybiByZWN1cnNpdmVTZWFyY2goYUxvdywgbWlkLCBhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcyk7XG4gICAgfVxuXG4gICAgLy8gd2UgYXJlIGluIHRlcm1pbmF0aW9uIGNhc2UgKDMpIG9yICgyKSBhbmQgcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSB0aGluZy5cbiAgICBpZiAoYUJpYXMgPT0gZXhwb3J0cy5MRUFTVF9VUFBFUl9CT1VORCkge1xuICAgICAgcmV0dXJuIG1pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFMb3cgPCAwID8gLTEgOiBhTG93O1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgYmluYXJ5IHNlYXJjaCB3aGljaCB3aWxsIGFsd2F5cyB0cnkgYW5kIHJldHVyblxuICogdGhlIGluZGV4IG9mIHRoZSBjbG9zZXN0IGVsZW1lbnQgaWYgdGhlcmUgaXMgbm8gZXhhY3QgaGl0LiBUaGlzIGlzIGJlY2F1c2VcbiAqIG1hcHBpbmdzIGJldHdlZW4gb3JpZ2luYWwgYW5kIGdlbmVyYXRlZCBsaW5lL2NvbCBwYWlycyBhcmUgc2luZ2xlIHBvaW50cyxcbiAqIGFuZCB0aGVyZSBpcyBhbiBpbXBsaWNpdCByZWdpb24gYmV0d2VlbiBlYWNoIG9mIHRoZW0sIHNvIGEgbWlzcyBqdXN0IG1lYW5zXG4gKiB0aGF0IHlvdSBhcmVuJ3Qgb24gdGhlIHZlcnkgc3RhcnQgb2YgYSByZWdpb24uXG4gKlxuICogQHBhcmFtIGFOZWVkbGUgVGhlIGVsZW1lbnQgeW91IGFyZSBsb29raW5nIGZvci5cbiAqIEBwYXJhbSBhSGF5c3RhY2sgVGhlIGFycmF5IHRoYXQgaXMgYmVpbmcgc2VhcmNoZWQuXG4gKiBAcGFyYW0gYUNvbXBhcmUgQSBmdW5jdGlvbiB3aGljaCB0YWtlcyB0aGUgbmVlZGxlIGFuZCBhbiBlbGVtZW50IGluIHRoZVxuICogICAgIGFycmF5IGFuZCByZXR1cm5zIC0xLCAwLCBvciAxIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBuZWVkbGUgaXMgbGVzc1xuICogICAgIHRoYW4sIGVxdWFsIHRvLCBvciBncmVhdGVyIHRoYW4gdGhlIGVsZW1lbnQsIHJlc3BlY3RpdmVseS5cbiAqIEBwYXJhbSBhQmlhcyBFaXRoZXIgJ2JpbmFyeVNlYXJjaC5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnYmluYXJ5U2VhcmNoLkxFQVNUX1VQUEVSX0JPVU5EJy4gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcmV0dXJuIHRoZVxuICogICAgIGNsb3Nlc3QgZWxlbWVudCB0aGF0IGlzIHNtYWxsZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmVcbiAqICAgICBzZWFyY2hpbmcgZm9yLCByZXNwZWN0aXZlbHksIGlmIHRoZSBleGFjdCBlbGVtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAqICAgICBEZWZhdWx0cyB0byAnYmluYXJ5U2VhcmNoLkdSRUFURVNUX0xPV0VSX0JPVU5EJy5cbiAqL1xuZXhwb3J0cy5zZWFyY2ggPSBmdW5jdGlvbiBzZWFyY2goYU5lZWRsZSwgYUhheXN0YWNrLCBhQ29tcGFyZSwgYUJpYXMpIHtcbiAgaWYgKGFIYXlzdGFjay5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICB2YXIgaW5kZXggPSByZWN1cnNpdmVTZWFyY2goLTEsIGFIYXlzdGFjay5sZW5ndGgsIGFOZWVkbGUsIGFIYXlzdGFjayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFDb21wYXJlLCBhQmlhcyB8fCBleHBvcnRzLkdSRUFURVNUX0xPV0VSX0JPVU5EKTtcbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8vIFdlIGhhdmUgZm91bmQgZWl0aGVyIHRoZSBleGFjdCBlbGVtZW50LCBvciB0aGUgbmV4dC1jbG9zZXN0IGVsZW1lbnQgdGhhblxuICAvLyB0aGUgb25lIHdlIGFyZSBzZWFyY2hpbmcgZm9yLiBIb3dldmVyLCB0aGVyZSBtYXkgYmUgbW9yZSB0aGFuIG9uZSBzdWNoXG4gIC8vIGVsZW1lbnQuIE1ha2Ugc3VyZSB3ZSBhbHdheXMgcmV0dXJuIHRoZSBzbWFsbGVzdCBvZiB0aGVzZS5cbiAgd2hpbGUgKGluZGV4IC0gMSA+PSAwKSB7XG4gICAgaWYgKGFDb21wYXJlKGFIYXlzdGFja1tpbmRleF0sIGFIYXlzdGFja1tpbmRleCAtIDFdLCB0cnVlKSAhPT0gMCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC0taW5kZXg7XG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG4vLyBJdCB0dXJucyBvdXQgdGhhdCBzb21lIChtb3N0PykgSmF2YVNjcmlwdCBlbmdpbmVzIGRvbid0IHNlbGYtaG9zdFxuLy8gYEFycmF5LnByb3RvdHlwZS5zb3J0YC4gVGhpcyBtYWtlcyBzZW5zZSBiZWNhdXNlIEMrKyB3aWxsIGxpa2VseSByZW1haW5cbi8vIGZhc3RlciB0aGFuIEpTIHdoZW4gZG9pbmcgcmF3IENQVS1pbnRlbnNpdmUgc29ydGluZy4gSG93ZXZlciwgd2hlbiB1c2luZyBhXG4vLyBjdXN0b20gY29tcGFyYXRvciBmdW5jdGlvbiwgY2FsbGluZyBiYWNrIGFuZCBmb3J0aCBiZXR3ZWVuIHRoZSBWTSdzIEMrKyBhbmRcbi8vIEpJVCdkIEpTIGlzIHJhdGhlciBzbG93ICphbmQqIGxvc2VzIEpJVCB0eXBlIGluZm9ybWF0aW9uLCByZXN1bHRpbmcgaW5cbi8vIHdvcnNlIGdlbmVyYXRlZCBjb2RlIGZvciB0aGUgY29tcGFyYXRvciBmdW5jdGlvbiB0aGFuIHdvdWxkIGJlIG9wdGltYWwuIEluXG4vLyBmYWN0LCB3aGVuIHNvcnRpbmcgd2l0aCBhIGNvbXBhcmF0b3IsIHRoZXNlIGNvc3RzIG91dHdlaWdoIHRoZSBiZW5lZml0cyBvZlxuLy8gc29ydGluZyBpbiBDKysuIEJ5IHVzaW5nIG91ciBvd24gSlMtaW1wbGVtZW50ZWQgUXVpY2sgU29ydCAoYmVsb3cpLCB3ZSBnZXRcbi8vIGEgfjM1MDBtcyBtZWFuIHNwZWVkLXVwIGluIGBiZW5jaC9iZW5jaC5odG1sYC5cblxuLyoqXG4gKiBTd2FwIHRoZSBlbGVtZW50cyBpbmRleGVkIGJ5IGB4YCBhbmQgYHlgIGluIHRoZSBhcnJheSBgYXJ5YC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnlcbiAqICAgICAgICBUaGUgYXJyYXkuXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogICAgICAgIFRoZSBpbmRleCBvZiB0aGUgZmlyc3QgaXRlbS5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiAgICAgICAgVGhlIGluZGV4IG9mIHRoZSBzZWNvbmQgaXRlbS5cbiAqL1xuZnVuY3Rpb24gc3dhcChhcnksIHgsIHkpIHtcbiAgdmFyIHRlbXAgPSBhcnlbeF07XG4gIGFyeVt4XSA9IGFyeVt5XTtcbiAgYXJ5W3ldID0gdGVtcDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgd2l0aGluIHRoZSByYW5nZSBgbG93IC4uIGhpZ2hgIGluY2x1c2l2ZS5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbG93XG4gKiAgICAgICAgVGhlIGxvd2VyIGJvdW5kIG9uIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBoaWdoXG4gKiAgICAgICAgVGhlIHVwcGVyIGJvdW5kIG9uIHRoZSByYW5nZS5cbiAqL1xuZnVuY3Rpb24gcmFuZG9tSW50SW5SYW5nZShsb3csIGhpZ2gpIHtcbiAgcmV0dXJuIE1hdGgucm91bmQobG93ICsgKE1hdGgucmFuZG9tKCkgKiAoaGlnaCAtIGxvdykpKTtcbn1cblxuLyoqXG4gKiBUaGUgUXVpY2sgU29ydCBhbGdvcml0aG0uXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJ5XG4gKiAgICAgICAgQW4gYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmF0b3JcbiAqICAgICAgICBGdW5jdGlvbiB0byB1c2UgdG8gY29tcGFyZSB0d28gaXRlbXMuXG4gKiBAcGFyYW0ge051bWJlcn0gcFxuICogICAgICAgIFN0YXJ0IGluZGV4IG9mIHRoZSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IHJcbiAqICAgICAgICBFbmQgaW5kZXggb2YgdGhlIGFycmF5XG4gKi9cbmZ1bmN0aW9uIGRvUXVpY2tTb3J0KGFyeSwgY29tcGFyYXRvciwgcCwgcikge1xuICAvLyBJZiBvdXIgbG93ZXIgYm91bmQgaXMgbGVzcyB0aGFuIG91ciB1cHBlciBib3VuZCwgd2UgKDEpIHBhcnRpdGlvbiB0aGVcbiAgLy8gYXJyYXkgaW50byB0d28gcGllY2VzIGFuZCAoMikgcmVjdXJzZSBvbiBlYWNoIGhhbGYuIElmIGl0IGlzIG5vdCwgdGhpcyBpc1xuICAvLyB0aGUgZW1wdHkgYXJyYXkgYW5kIG91ciBiYXNlIGNhc2UuXG5cbiAgaWYgKHAgPCByKSB7XG4gICAgLy8gKDEpIFBhcnRpdGlvbmluZy5cbiAgICAvL1xuICAgIC8vIFRoZSBwYXJ0aXRpb25pbmcgY2hvb3NlcyBhIHBpdm90IGJldHdlZW4gYHBgIGFuZCBgcmAgYW5kIG1vdmVzIGFsbFxuICAgIC8vIGVsZW1lbnRzIHRoYXQgYXJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgcGl2b3QgdG8gdGhlIGJlZm9yZSBpdCwgYW5kXG4gICAgLy8gYWxsIHRoZSBlbGVtZW50cyB0aGF0IGFyZSBncmVhdGVyIHRoYW4gaXQgYWZ0ZXIgaXQuIFRoZSBlZmZlY3QgaXMgdGhhdFxuICAgIC8vIG9uY2UgcGFydGl0aW9uIGlzIGRvbmUsIHRoZSBwaXZvdCBpcyBpbiB0aGUgZXhhY3QgcGxhY2UgaXQgd2lsbCBiZSB3aGVuXG4gICAgLy8gdGhlIGFycmF5IGlzIHB1dCBpbiBzb3J0ZWQgb3JkZXIsIGFuZCBpdCB3aWxsIG5vdCBuZWVkIHRvIGJlIG1vdmVkXG4gICAgLy8gYWdhaW4uIFRoaXMgcnVucyBpbiBPKG4pIHRpbWUuXG5cbiAgICAvLyBBbHdheXMgY2hvb3NlIGEgcmFuZG9tIHBpdm90IHNvIHRoYXQgYW4gaW5wdXQgYXJyYXkgd2hpY2ggaXMgcmV2ZXJzZVxuICAgIC8vIHNvcnRlZCBkb2VzIG5vdCBjYXVzZSBPKG5eMikgcnVubmluZyB0aW1lLlxuICAgIHZhciBwaXZvdEluZGV4ID0gcmFuZG9tSW50SW5SYW5nZShwLCByKTtcbiAgICB2YXIgaSA9IHAgLSAxO1xuXG4gICAgc3dhcChhcnksIHBpdm90SW5kZXgsIHIpO1xuICAgIHZhciBwaXZvdCA9IGFyeVtyXTtcblxuICAgIC8vIEltbWVkaWF0ZWx5IGFmdGVyIGBqYCBpcyBpbmNyZW1lbnRlZCBpbiB0aGlzIGxvb3AsIHRoZSBmb2xsb3dpbmcgaG9sZFxuICAgIC8vIHRydWU6XG4gICAgLy9cbiAgICAvLyAgICogRXZlcnkgZWxlbWVudCBpbiBgYXJ5W3AgLi4gaV1gIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgcGl2b3QuXG4gICAgLy9cbiAgICAvLyAgICogRXZlcnkgZWxlbWVudCBpbiBgYXJ5W2krMSAuLiBqLTFdYCBpcyBncmVhdGVyIHRoYW4gdGhlIHBpdm90LlxuICAgIGZvciAodmFyIGogPSBwOyBqIDwgcjsgaisrKSB7XG4gICAgICBpZiAoY29tcGFyYXRvcihhcnlbal0sIHBpdm90KSA8PSAwKSB7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgc3dhcChhcnksIGksIGopO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN3YXAoYXJ5LCBpICsgMSwgaik7XG4gICAgdmFyIHEgPSBpICsgMTtcblxuICAgIC8vICgyKSBSZWN1cnNlIG9uIGVhY2ggaGFsZi5cblxuICAgIGRvUXVpY2tTb3J0KGFyeSwgY29tcGFyYXRvciwgcCwgcSAtIDEpO1xuICAgIGRvUXVpY2tTb3J0KGFyeSwgY29tcGFyYXRvciwgcSArIDEsIHIpO1xuICB9XG59XG5cbi8qKlxuICogU29ydCB0aGUgZ2l2ZW4gYXJyYXkgaW4tcGxhY2Ugd2l0aCB0aGUgZ2l2ZW4gY29tcGFyYXRvciBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnlcbiAqICAgICAgICBBbiBhcnJheSB0byBzb3J0LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyYXRvclxuICogICAgICAgIEZ1bmN0aW9uIHRvIHVzZSB0byBjb21wYXJlIHR3byBpdGVtcy5cbiAqL1xuZXhwb3J0cy5xdWlja1NvcnQgPSBmdW5jdGlvbiAoYXJ5LCBjb21wYXJhdG9yKSB7XG4gIGRvUXVpY2tTb3J0KGFyeSwgY29tcGFyYXRvciwgMCwgYXJ5Lmxlbmd0aCAtIDEpO1xufTtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxudmFyIFNvdXJjZU1hcEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vc291cmNlLW1hcC1nZW5lcmF0b3InKS5Tb3VyY2VNYXBHZW5lcmF0b3I7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vLyBNYXRjaGVzIGEgV2luZG93cy1zdHlsZSBgXFxyXFxuYCBuZXdsaW5lIG9yIGEgYFxcbmAgbmV3bGluZSB1c2VkIGJ5IGFsbCBvdGhlclxuLy8gb3BlcmF0aW5nIHN5c3RlbXMgdGhlc2UgZGF5cyAoY2FwdHVyaW5nIHRoZSByZXN1bHQpLlxudmFyIFJFR0VYX05FV0xJTkUgPSAvKFxccj9cXG4pLztcblxuLy8gTmV3bGluZSBjaGFyYWN0ZXIgY29kZSBmb3IgY2hhckNvZGVBdCgpIGNvbXBhcmlzb25zXG52YXIgTkVXTElORV9DT0RFID0gMTA7XG5cbi8vIFByaXZhdGUgc3ltYm9sIGZvciBpZGVudGlmeWluZyBgU291cmNlTm9kZWBzIHdoZW4gbXVsdGlwbGUgdmVyc2lvbnMgb2Zcbi8vIHRoZSBzb3VyY2UtbWFwIGxpYnJhcnkgYXJlIGxvYWRlZC4gVGhpcyBNVVNUIE5PVCBDSEFOR0UgYWNyb3NzXG4vLyB2ZXJzaW9ucyFcbnZhciBpc1NvdXJjZU5vZGUgPSBcIiQkJGlzU291cmNlTm9kZSQkJFwiO1xuXG4vKipcbiAqIFNvdXJjZU5vZGVzIHByb3ZpZGUgYSB3YXkgdG8gYWJzdHJhY3Qgb3ZlciBpbnRlcnBvbGF0aW5nL2NvbmNhdGVuYXRpbmdcbiAqIHNuaXBwZXRzIG9mIGdlbmVyYXRlZCBKYXZhU2NyaXB0IHNvdXJjZSBjb2RlIHdoaWxlIG1haW50YWluaW5nIHRoZSBsaW5lIGFuZFxuICogY29sdW1uIGluZm9ybWF0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgb3JpZ2luYWwgc291cmNlIGNvZGUuXG4gKlxuICogQHBhcmFtIGFMaW5lIFRoZSBvcmlnaW5hbCBsaW5lIG51bWJlci5cbiAqIEBwYXJhbSBhQ29sdW1uIFRoZSBvcmlnaW5hbCBjb2x1bW4gbnVtYmVyLlxuICogQHBhcmFtIGFTb3VyY2UgVGhlIG9yaWdpbmFsIHNvdXJjZSdzIGZpbGVuYW1lLlxuICogQHBhcmFtIGFDaHVua3MgT3B0aW9uYWwuIEFuIGFycmF5IG9mIHN0cmluZ3Mgd2hpY2ggYXJlIHNuaXBwZXRzIG9mXG4gKiAgICAgICAgZ2VuZXJhdGVkIEpTLCBvciBvdGhlciBTb3VyY2VOb2Rlcy5cbiAqIEBwYXJhbSBhTmFtZSBUaGUgb3JpZ2luYWwgaWRlbnRpZmllci5cbiAqL1xuZnVuY3Rpb24gU291cmNlTm9kZShhTGluZSwgYUNvbHVtbiwgYVNvdXJjZSwgYUNodW5rcywgYU5hbWUpIHtcbiAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICB0aGlzLnNvdXJjZUNvbnRlbnRzID0ge307XG4gIHRoaXMubGluZSA9IGFMaW5lID09IG51bGwgPyBudWxsIDogYUxpbmU7XG4gIHRoaXMuY29sdW1uID0gYUNvbHVtbiA9PSBudWxsID8gbnVsbCA6IGFDb2x1bW47XG4gIHRoaXMuc291cmNlID0gYVNvdXJjZSA9PSBudWxsID8gbnVsbCA6IGFTb3VyY2U7XG4gIHRoaXMubmFtZSA9IGFOYW1lID09IG51bGwgPyBudWxsIDogYU5hbWU7XG4gIHRoaXNbaXNTb3VyY2VOb2RlXSA9IHRydWU7XG4gIGlmIChhQ2h1bmtzICE9IG51bGwpIHRoaXMuYWRkKGFDaHVua3MpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBTb3VyY2VOb2RlIGZyb20gZ2VuZXJhdGVkIGNvZGUgYW5kIGEgU291cmNlTWFwQ29uc3VtZXIuXG4gKlxuICogQHBhcmFtIGFHZW5lcmF0ZWRDb2RlIFRoZSBnZW5lcmF0ZWQgY29kZVxuICogQHBhcmFtIGFTb3VyY2VNYXBDb25zdW1lciBUaGUgU291cmNlTWFwIGZvciB0aGUgZ2VuZXJhdGVkIGNvZGVcbiAqIEBwYXJhbSBhUmVsYXRpdmVQYXRoIE9wdGlvbmFsLiBUaGUgcGF0aCB0aGF0IHJlbGF0aXZlIHNvdXJjZXMgaW4gdGhlXG4gKiAgICAgICAgU291cmNlTWFwQ29uc3VtZXIgc2hvdWxkIGJlIHJlbGF0aXZlIHRvLlxuICovXG5Tb3VyY2VOb2RlLmZyb21TdHJpbmdXaXRoU291cmNlTWFwID1cbiAgZnVuY3Rpb24gU291cmNlTm9kZV9mcm9tU3RyaW5nV2l0aFNvdXJjZU1hcChhR2VuZXJhdGVkQ29kZSwgYVNvdXJjZU1hcENvbnN1bWVyLCBhUmVsYXRpdmVQYXRoKSB7XG4gICAgLy8gVGhlIFNvdXJjZU5vZGUgd2Ugd2FudCB0byBmaWxsIHdpdGggdGhlIGdlbmVyYXRlZCBjb2RlXG4gICAgLy8gYW5kIHRoZSBTb3VyY2VNYXBcbiAgICB2YXIgbm9kZSA9IG5ldyBTb3VyY2VOb2RlKCk7XG5cbiAgICAvLyBBbGwgZXZlbiBpbmRpY2VzIG9mIHRoaXMgYXJyYXkgYXJlIG9uZSBsaW5lIG9mIHRoZSBnZW5lcmF0ZWQgY29kZSxcbiAgICAvLyB3aGlsZSBhbGwgb2RkIGluZGljZXMgYXJlIHRoZSBuZXdsaW5lcyBiZXR3ZWVuIHR3byBhZGphY2VudCBsaW5lc1xuICAgIC8vIChzaW5jZSBgUkVHRVhfTkVXTElORWAgY2FwdHVyZXMgaXRzIG1hdGNoKS5cbiAgICAvLyBQcm9jZXNzZWQgZnJhZ21lbnRzIGFyZSBhY2Nlc3NlZCBieSBjYWxsaW5nIGBzaGlmdE5leHRMaW5lYC5cbiAgICB2YXIgcmVtYWluaW5nTGluZXMgPSBhR2VuZXJhdGVkQ29kZS5zcGxpdChSRUdFWF9ORVdMSU5FKTtcbiAgICB2YXIgcmVtYWluaW5nTGluZXNJbmRleCA9IDA7XG4gICAgdmFyIHNoaWZ0TmV4dExpbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsaW5lQ29udGVudHMgPSBnZXROZXh0TGluZSgpO1xuICAgICAgLy8gVGhlIGxhc3QgbGluZSBvZiBhIGZpbGUgbWlnaHQgbm90IGhhdmUgYSBuZXdsaW5lLlxuICAgICAgdmFyIG5ld0xpbmUgPSBnZXROZXh0TGluZSgpIHx8IFwiXCI7XG4gICAgICByZXR1cm4gbGluZUNvbnRlbnRzICsgbmV3TGluZTtcblxuICAgICAgZnVuY3Rpb24gZ2V0TmV4dExpbmUoKSB7XG4gICAgICAgIHJldHVybiByZW1haW5pbmdMaW5lc0luZGV4IDwgcmVtYWluaW5nTGluZXMubGVuZ3RoID9cbiAgICAgICAgICAgIHJlbWFpbmluZ0xpbmVzW3JlbWFpbmluZ0xpbmVzSW5kZXgrK10gOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFdlIG5lZWQgdG8gcmVtZW1iZXIgdGhlIHBvc2l0aW9uIG9mIFwicmVtYWluaW5nTGluZXNcIlxuICAgIHZhciBsYXN0R2VuZXJhdGVkTGluZSA9IDEsIGxhc3RHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuXG4gICAgLy8gVGhlIGdlbmVyYXRlIFNvdXJjZU5vZGVzIHdlIG5lZWQgYSBjb2RlIHJhbmdlLlxuICAgIC8vIFRvIGV4dHJhY3QgaXQgY3VycmVudCBhbmQgbGFzdCBtYXBwaW5nIGlzIHVzZWQuXG4gICAgLy8gSGVyZSB3ZSBzdG9yZSB0aGUgbGFzdCBtYXBwaW5nLlxuICAgIHZhciBsYXN0TWFwcGluZyA9IG51bGw7XG5cbiAgICBhU291cmNlTWFwQ29uc3VtZXIuZWFjaE1hcHBpbmcoZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICAgIGlmIChsYXN0TWFwcGluZyAhPT0gbnVsbCkge1xuICAgICAgICAvLyBXZSBhZGQgdGhlIGNvZGUgZnJvbSBcImxhc3RNYXBwaW5nXCIgdG8gXCJtYXBwaW5nXCI6XG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIHRoZXJlIGlzIGEgbmV3IGxpbmUgaW4gYmV0d2Vlbi5cbiAgICAgICAgaWYgKGxhc3RHZW5lcmF0ZWRMaW5lIDwgbWFwcGluZy5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgICAgLy8gQXNzb2NpYXRlIGZpcnN0IGxpbmUgd2l0aCBcImxhc3RNYXBwaW5nXCJcbiAgICAgICAgICBhZGRNYXBwaW5nV2l0aENvZGUobGFzdE1hcHBpbmcsIHNoaWZ0TmV4dExpbmUoKSk7XG4gICAgICAgICAgbGFzdEdlbmVyYXRlZExpbmUrKztcbiAgICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICAgICAgICAvLyBUaGUgcmVtYWluaW5nIGNvZGUgaXMgYWRkZWQgd2l0aG91dCBtYXBwaW5nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlcmUgaXMgbm8gbmV3IGxpbmUgaW4gYmV0d2Vlbi5cbiAgICAgICAgICAvLyBBc3NvY2lhdGUgdGhlIGNvZGUgYmV0d2VlbiBcImxhc3RHZW5lcmF0ZWRDb2x1bW5cIiBhbmRcbiAgICAgICAgICAvLyBcIm1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXCIgd2l0aCBcImxhc3RNYXBwaW5nXCJcbiAgICAgICAgICB2YXIgbmV4dExpbmUgPSByZW1haW5pbmdMaW5lc1tyZW1haW5pbmdMaW5lc0luZGV4XSB8fCAnJztcbiAgICAgICAgICB2YXIgY29kZSA9IG5leHRMaW5lLnN1YnN0cigwLCBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbiAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEdlbmVyYXRlZENvbHVtbik7XG4gICAgICAgICAgcmVtYWluaW5nTGluZXNbcmVtYWluaW5nTGluZXNJbmRleF0gPSBuZXh0TGluZS5zdWJzdHIobWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcbiAgICAgICAgICBhZGRNYXBwaW5nV2l0aENvZGUobGFzdE1hcHBpbmcsIGNvZGUpO1xuICAgICAgICAgIC8vIE5vIG1vcmUgcmVtYWluaW5nIGNvZGUsIGNvbnRpbnVlXG4gICAgICAgICAgbGFzdE1hcHBpbmcgPSBtYXBwaW5nO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gV2UgYWRkIHRoZSBnZW5lcmF0ZWQgY29kZSB1bnRpbCB0aGUgZmlyc3QgbWFwcGluZ1xuICAgICAgLy8gdG8gdGhlIFNvdXJjZU5vZGUgd2l0aG91dCBhbnkgbWFwcGluZy5cbiAgICAgIC8vIEVhY2ggbGluZSBpcyBhZGRlZCBhcyBzZXBhcmF0ZSBzdHJpbmcuXG4gICAgICB3aGlsZSAobGFzdEdlbmVyYXRlZExpbmUgPCBtYXBwaW5nLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgbm9kZS5hZGQoc2hpZnROZXh0TGluZSgpKTtcbiAgICAgICAgbGFzdEdlbmVyYXRlZExpbmUrKztcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0R2VuZXJhdGVkQ29sdW1uIDwgbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4pIHtcbiAgICAgICAgdmFyIG5leHRMaW5lID0gcmVtYWluaW5nTGluZXNbcmVtYWluaW5nTGluZXNJbmRleF0gfHwgJyc7XG4gICAgICAgIG5vZGUuYWRkKG5leHRMaW5lLnN1YnN0cigwLCBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbikpO1xuICAgICAgICByZW1haW5pbmdMaW5lc1tyZW1haW5pbmdMaW5lc0luZGV4XSA9IG5leHRMaW5lLnN1YnN0cihtYXBwaW5nLmdlbmVyYXRlZENvbHVtbik7XG4gICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcbiAgICAgIH1cbiAgICAgIGxhc3RNYXBwaW5nID0gbWFwcGluZztcbiAgICB9LCB0aGlzKTtcbiAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgbWFwcGluZ3MuXG4gICAgaWYgKHJlbWFpbmluZ0xpbmVzSW5kZXggPCByZW1haW5pbmdMaW5lcy5sZW5ndGgpIHtcbiAgICAgIGlmIChsYXN0TWFwcGluZykge1xuICAgICAgICAvLyBBc3NvY2lhdGUgdGhlIHJlbWFpbmluZyBjb2RlIGluIHRoZSBjdXJyZW50IGxpbmUgd2l0aCBcImxhc3RNYXBwaW5nXCJcbiAgICAgICAgYWRkTWFwcGluZ1dpdGhDb2RlKGxhc3RNYXBwaW5nLCBzaGlmdE5leHRMaW5lKCkpO1xuICAgICAgfVxuICAgICAgLy8gYW5kIGFkZCB0aGUgcmVtYWluaW5nIGxpbmVzIHdpdGhvdXQgYW55IG1hcHBpbmdcbiAgICAgIG5vZGUuYWRkKHJlbWFpbmluZ0xpbmVzLnNwbGljZShyZW1haW5pbmdMaW5lc0luZGV4KS5qb2luKFwiXCIpKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IHNvdXJjZXNDb250ZW50IGludG8gU291cmNlTm9kZVxuICAgIGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZUZpbGUpIHtcbiAgICAgIHZhciBjb250ZW50ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlRmlsZSk7XG4gICAgICBpZiAoY29udGVudCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChhUmVsYXRpdmVQYXRoICE9IG51bGwpIHtcbiAgICAgICAgICBzb3VyY2VGaWxlID0gdXRpbC5qb2luKGFSZWxhdGl2ZVBhdGgsIHNvdXJjZUZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBub2RlO1xuXG4gICAgZnVuY3Rpb24gYWRkTWFwcGluZ1dpdGhDb2RlKG1hcHBpbmcsIGNvZGUpIHtcbiAgICAgIGlmIChtYXBwaW5nID09PSBudWxsIHx8IG1hcHBpbmcuc291cmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm9kZS5hZGQoY29kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc291cmNlID0gYVJlbGF0aXZlUGF0aFxuICAgICAgICAgID8gdXRpbC5qb2luKGFSZWxhdGl2ZVBhdGgsIG1hcHBpbmcuc291cmNlKVxuICAgICAgICAgIDogbWFwcGluZy5zb3VyY2U7XG4gICAgICAgIG5vZGUuYWRkKG5ldyBTb3VyY2VOb2RlKG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmcubmFtZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBBZGQgYSBjaHVuayBvZiBnZW5lcmF0ZWQgSlMgdG8gdGhpcyBzb3VyY2Ugbm9kZS5cbiAqXG4gKiBAcGFyYW0gYUNodW5rIEEgc3RyaW5nIHNuaXBwZXQgb2YgZ2VuZXJhdGVkIEpTIGNvZGUsIGFub3RoZXIgaW5zdGFuY2Ugb2ZcbiAqICAgICAgICBTb3VyY2VOb2RlLCBvciBhbiBhcnJheSB3aGVyZSBlYWNoIG1lbWJlciBpcyBvbmUgb2YgdGhvc2UgdGhpbmdzLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX2FkZChhQ2h1bmspIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYUNodW5rKSkge1xuICAgIGFDaHVuay5mb3JFYWNoKGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgdGhpcy5hZGQoY2h1bmspO1xuICAgIH0sIHRoaXMpO1xuICB9XG4gIGVsc2UgaWYgKGFDaHVua1tpc1NvdXJjZU5vZGVdIHx8IHR5cGVvZiBhQ2h1bmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAoYUNodW5rKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuLnB1c2goYUNodW5rKTtcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIFwiRXhwZWN0ZWQgYSBTb3VyY2VOb2RlLCBzdHJpbmcsIG9yIGFuIGFycmF5IG9mIFNvdXJjZU5vZGVzIGFuZCBzdHJpbmdzLiBHb3QgXCIgKyBhQ2h1bmtcbiAgICApO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBjaHVuayBvZiBnZW5lcmF0ZWQgSlMgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGlzIHNvdXJjZSBub2RlLlxuICpcbiAqIEBwYXJhbSBhQ2h1bmsgQSBzdHJpbmcgc25pcHBldCBvZiBnZW5lcmF0ZWQgSlMgY29kZSwgYW5vdGhlciBpbnN0YW5jZSBvZlxuICogICAgICAgIFNvdXJjZU5vZGUsIG9yIGFuIGFycmF5IHdoZXJlIGVhY2ggbWVtYmVyIGlzIG9uZSBvZiB0aG9zZSB0aGluZ3MuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3ByZXBlbmQoYUNodW5rKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFDaHVuaykpIHtcbiAgICBmb3IgKHZhciBpID0gYUNodW5rLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5wcmVwZW5kKGFDaHVua1tpXSk7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKGFDaHVua1tpc1NvdXJjZU5vZGVdIHx8IHR5cGVvZiBhQ2h1bmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQoYUNodW5rKTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgXCJFeHBlY3RlZCBhIFNvdXJjZU5vZGUsIHN0cmluZywgb3IgYW4gYXJyYXkgb2YgU291cmNlTm9kZXMgYW5kIHN0cmluZ3MuIEdvdCBcIiArIGFDaHVua1xuICAgICk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdhbGsgb3ZlciB0aGUgdHJlZSBvZiBKUyBzbmlwcGV0cyBpbiB0aGlzIG5vZGUgYW5kIGl0cyBjaGlsZHJlbi4gVGhlXG4gKiB3YWxraW5nIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbmNlIGZvciBlYWNoIHNuaXBwZXQgb2YgSlMgYW5kIGlzIHBhc3NlZCB0aGF0XG4gKiBzbmlwcGV0IGFuZCB0aGUgaXRzIG9yaWdpbmFsIGFzc29jaWF0ZWQgc291cmNlJ3MgbGluZS9jb2x1bW4gbG9jYXRpb24uXG4gKlxuICogQHBhcmFtIGFGbiBUaGUgdHJhdmVyc2FsIGZ1bmN0aW9uLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS53YWxrID0gZnVuY3Rpb24gU291cmNlTm9kZV93YWxrKGFGbikge1xuICB2YXIgY2h1bms7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY2h1bmsgPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgIGlmIChjaHVua1tpc1NvdXJjZU5vZGVdKSB7XG4gICAgICBjaHVuay53YWxrKGFGbik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGNodW5rICE9PSAnJykge1xuICAgICAgICBhRm4oY2h1bmssIHsgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMubGluZSxcbiAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIExpa2UgYFN0cmluZy5wcm90b3R5cGUuam9pbmAgZXhjZXB0IGZvciBTb3VyY2VOb2Rlcy4gSW5zZXJ0cyBgYVN0cmAgYmV0d2VlblxuICogZWFjaCBvZiBgdGhpcy5jaGlsZHJlbmAuXG4gKlxuICogQHBhcmFtIGFTZXAgVGhlIHNlcGFyYXRvci5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUuam9pbiA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfam9pbihhU2VwKSB7XG4gIHZhciBuZXdDaGlsZHJlbjtcbiAgdmFyIGk7XG4gIHZhciBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgaWYgKGxlbiA+IDApIHtcbiAgICBuZXdDaGlsZHJlbiA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW4tMTsgaSsrKSB7XG4gICAgICBuZXdDaGlsZHJlbi5wdXNoKHRoaXMuY2hpbGRyZW5baV0pO1xuICAgICAgbmV3Q2hpbGRyZW4ucHVzaChhU2VwKTtcbiAgICB9XG4gICAgbmV3Q2hpbGRyZW4ucHVzaCh0aGlzLmNoaWxkcmVuW2ldKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gbmV3Q2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENhbGwgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlIG9uIHRoZSB2ZXJ5IHJpZ2h0LW1vc3Qgc291cmNlIHNuaXBwZXQuIFVzZWZ1bFxuICogZm9yIHRyaW1taW5nIHdoaXRlc3BhY2UgZnJvbSB0aGUgZW5kIG9mIGEgc291cmNlIG5vZGUsIGV0Yy5cbiAqXG4gKiBAcGFyYW0gYVBhdHRlcm4gVGhlIHBhdHRlcm4gdG8gcmVwbGFjZS5cbiAqIEBwYXJhbSBhUmVwbGFjZW1lbnQgVGhlIHRoaW5nIHRvIHJlcGxhY2UgdGhlIHBhdHRlcm4gd2l0aC5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUucmVwbGFjZVJpZ2h0ID0gZnVuY3Rpb24gU291cmNlTm9kZV9yZXBsYWNlUmlnaHQoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCkge1xuICB2YXIgbGFzdENoaWxkID0gdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICBpZiAobGFzdENoaWxkW2lzU291cmNlTm9kZV0pIHtcbiAgICBsYXN0Q2hpbGQucmVwbGFjZVJpZ2h0KGFQYXR0ZXJuLCBhUmVwbGFjZW1lbnQpO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBsYXN0Q2hpbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdID0gbGFzdENoaWxkLnJlcGxhY2UoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKCcnLnJlcGxhY2UoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCkpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSBjb250ZW50IGZvciBhIHNvdXJjZSBmaWxlLiBUaGlzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIFNvdXJjZU1hcEdlbmVyYXRvclxuICogaW4gdGhlIHNvdXJjZXNDb250ZW50IGZpZWxkLlxuICpcbiAqIEBwYXJhbSBhU291cmNlRmlsZSBUaGUgZmlsZW5hbWUgb2YgdGhlIHNvdXJjZSBmaWxlXG4gKiBAcGFyYW0gYVNvdXJjZUNvbnRlbnQgVGhlIGNvbnRlbnQgb2YgdGhlIHNvdXJjZSBmaWxlXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnNldFNvdXJjZUNvbnRlbnQgPVxuICBmdW5jdGlvbiBTb3VyY2VOb2RlX3NldFNvdXJjZUNvbnRlbnQoYVNvdXJjZUZpbGUsIGFTb3VyY2VDb250ZW50KSB7XG4gICAgdGhpcy5zb3VyY2VDb250ZW50c1t1dGlsLnRvU2V0U3RyaW5nKGFTb3VyY2VGaWxlKV0gPSBhU291cmNlQ29udGVudDtcbiAgfTtcblxuLyoqXG4gKiBXYWxrIG92ZXIgdGhlIHRyZWUgb2YgU291cmNlTm9kZXMuIFRoZSB3YWxraW5nIGZ1bmN0aW9uIGlzIGNhbGxlZCBmb3IgZWFjaFxuICogc291cmNlIGZpbGUgY29udGVudCBhbmQgaXMgcGFzc2VkIHRoZSBmaWxlbmFtZSBhbmQgc291cmNlIGNvbnRlbnQuXG4gKlxuICogQHBhcmFtIGFGbiBUaGUgdHJhdmVyc2FsIGZ1bmN0aW9uLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS53YWxrU291cmNlQ29udGVudHMgPVxuICBmdW5jdGlvbiBTb3VyY2VOb2RlX3dhbGtTb3VyY2VDb250ZW50cyhhRm4pIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRoaXMuY2hpbGRyZW5baV1baXNTb3VyY2VOb2RlXSkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLndhbGtTb3VyY2VDb250ZW50cyhhRm4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzb3VyY2VzID0gT2JqZWN0LmtleXModGhpcy5zb3VyY2VDb250ZW50cyk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFGbih1dGlsLmZyb21TZXRTdHJpbmcoc291cmNlc1tpXSksIHRoaXMuc291cmNlQ29udGVudHNbc291cmNlc1tpXV0pO1xuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHNvdXJjZSBub2RlLiBXYWxrcyBvdmVyIHRoZSB0cmVlXG4gKiBhbmQgY29uY2F0ZW5hdGVzIGFsbCB0aGUgdmFyaW91cyBzbmlwcGV0cyB0b2dldGhlciB0byBvbmUgc3RyaW5nLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfdG9TdHJpbmcoKSB7XG4gIHZhciBzdHIgPSBcIlwiO1xuICB0aGlzLndhbGsoZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgc3RyICs9IGNodW5rO1xuICB9KTtcbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgc291cmNlIG5vZGUgYWxvbmcgd2l0aCBhIHNvdXJjZVxuICogbWFwLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS50b1N0cmluZ1dpdGhTb3VyY2VNYXAgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3RvU3RyaW5nV2l0aFNvdXJjZU1hcChhQXJncykge1xuICB2YXIgZ2VuZXJhdGVkID0ge1xuICAgIGNvZGU6IFwiXCIsXG4gICAgbGluZTogMSxcbiAgICBjb2x1bW46IDBcbiAgfTtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoYUFyZ3MpO1xuICB2YXIgc291cmNlTWFwcGluZ0FjdGl2ZSA9IGZhbHNlO1xuICB2YXIgbGFzdE9yaWdpbmFsU291cmNlID0gbnVsbDtcbiAgdmFyIGxhc3RPcmlnaW5hbExpbmUgPSBudWxsO1xuICB2YXIgbGFzdE9yaWdpbmFsQ29sdW1uID0gbnVsbDtcbiAgdmFyIGxhc3RPcmlnaW5hbE5hbWUgPSBudWxsO1xuICB0aGlzLndhbGsoZnVuY3Rpb24gKGNodW5rLCBvcmlnaW5hbCkge1xuICAgIGdlbmVyYXRlZC5jb2RlICs9IGNodW5rO1xuICAgIGlmIChvcmlnaW5hbC5zb3VyY2UgIT09IG51bGxcbiAgICAgICAgJiYgb3JpZ2luYWwubGluZSAhPT0gbnVsbFxuICAgICAgICAmJiBvcmlnaW5hbC5jb2x1bW4gIT09IG51bGwpIHtcbiAgICAgIGlmKGxhc3RPcmlnaW5hbFNvdXJjZSAhPT0gb3JpZ2luYWwuc291cmNlXG4gICAgICAgICB8fCBsYXN0T3JpZ2luYWxMaW5lICE9PSBvcmlnaW5hbC5saW5lXG4gICAgICAgICB8fCBsYXN0T3JpZ2luYWxDb2x1bW4gIT09IG9yaWdpbmFsLmNvbHVtblxuICAgICAgICAgfHwgbGFzdE9yaWdpbmFsTmFtZSAhPT0gb3JpZ2luYWwubmFtZSkge1xuICAgICAgICBtYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgc291cmNlOiBvcmlnaW5hbC5zb3VyY2UsXG4gICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgIGxpbmU6IG9yaWdpbmFsLmxpbmUsXG4gICAgICAgICAgICBjb2x1bW46IG9yaWdpbmFsLmNvbHVtblxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgICBsaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgICAgICAgIGNvbHVtbjogZ2VuZXJhdGVkLmNvbHVtblxuICAgICAgICAgIH0sXG4gICAgICAgICAgbmFtZTogb3JpZ2luYWwubmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGxhc3RPcmlnaW5hbFNvdXJjZSA9IG9yaWdpbmFsLnNvdXJjZTtcbiAgICAgIGxhc3RPcmlnaW5hbExpbmUgPSBvcmlnaW5hbC5saW5lO1xuICAgICAgbGFzdE9yaWdpbmFsQ29sdW1uID0gb3JpZ2luYWwuY29sdW1uO1xuICAgICAgbGFzdE9yaWdpbmFsTmFtZSA9IG9yaWdpbmFsLm5hbWU7XG4gICAgICBzb3VyY2VNYXBwaW5nQWN0aXZlID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHNvdXJjZU1hcHBpbmdBY3RpdmUpIHtcbiAgICAgIG1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgbGluZTogZ2VuZXJhdGVkLmxpbmUsXG4gICAgICAgICAgY29sdW1uOiBnZW5lcmF0ZWQuY29sdW1uXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbGFzdE9yaWdpbmFsU291cmNlID0gbnVsbDtcbiAgICAgIHNvdXJjZU1hcHBpbmdBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gICAgZm9yICh2YXIgaWR4ID0gMCwgbGVuZ3RoID0gY2h1bmsubGVuZ3RoOyBpZHggPCBsZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoY2h1bmsuY2hhckNvZGVBdChpZHgpID09PSBORVdMSU5FX0NPREUpIHtcbiAgICAgICAgZ2VuZXJhdGVkLmxpbmUrKztcbiAgICAgICAgZ2VuZXJhdGVkLmNvbHVtbiA9IDA7XG4gICAgICAgIC8vIE1hcHBpbmdzIGVuZCBhdCBlb2xcbiAgICAgICAgaWYgKGlkeCArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIGxhc3RPcmlnaW5hbFNvdXJjZSA9IG51bGw7XG4gICAgICAgICAgc291cmNlTWFwcGluZ0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHNvdXJjZU1hcHBpbmdBY3RpdmUpIHtcbiAgICAgICAgICBtYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICBzb3VyY2U6IG9yaWdpbmFsLnNvdXJjZSxcbiAgICAgICAgICAgIG9yaWdpbmFsOiB7XG4gICAgICAgICAgICAgIGxpbmU6IG9yaWdpbmFsLmxpbmUsXG4gICAgICAgICAgICAgIGNvbHVtbjogb3JpZ2luYWwuY29sdW1uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgICAgIGxpbmU6IGdlbmVyYXRlZC5saW5lLFxuICAgICAgICAgICAgICBjb2x1bW46IGdlbmVyYXRlZC5jb2x1bW5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiBvcmlnaW5hbC5uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdlbmVyYXRlZC5jb2x1bW4rKztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICB0aGlzLndhbGtTb3VyY2VDb250ZW50cyhmdW5jdGlvbiAoc291cmNlRmlsZSwgc291cmNlQ29udGVudCkge1xuICAgIG1hcC5zZXRTb3VyY2VDb250ZW50KHNvdXJjZUZpbGUsIHNvdXJjZUNvbnRlbnQpO1xuICB9KTtcblxuICByZXR1cm4geyBjb2RlOiBnZW5lcmF0ZWQuY29kZSwgbWFwOiBtYXAgfTtcbn07XG5cbmV4cG9ydHMuU291cmNlTm9kZSA9IFNvdXJjZU5vZGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbnZhciBpc01vZGVybiA9IChcbiAgdHlwZW9mIEJ1ZmZlci5hbGxvYyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICB0eXBlb2YgQnVmZmVyLmFsbG9jVW5zYWZlID09PSAnZnVuY3Rpb24nICYmXG4gIHR5cGVvZiBCdWZmZXIuZnJvbSA9PT0gJ2Z1bmN0aW9uJ1xuKVxuXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyIChpbnB1dCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpbnB1dCkuc2xpY2UoOCwgLTEpID09PSAnQXJyYXlCdWZmZXInXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAob2JqLCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgYnl0ZU9mZnNldCA+Pj49IDBcblxuICB2YXIgbWF4TGVuZ3RoID0gb2JqLmJ5dGVMZW5ndGggLSBieXRlT2Zmc2V0XG5cbiAgaWYgKG1heExlbmd0aCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIidvZmZzZXQnIGlzIG91dCBvZiBib3VuZHNcIilcbiAgfVxuXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IG1heExlbmd0aFxuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA+Pj49IDBcblxuICAgIGlmIChsZW5ndGggPiBtYXhMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiJ2xlbmd0aCcgaXMgb3V0IG9mIGJvdW5kc1wiKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpc01vZGVyblxuICAgID8gQnVmZmVyLmZyb20ob2JqLnNsaWNlKGJ5dGVPZmZzZXQsIGJ5dGVPZmZzZXQgKyBsZW5ndGgpKVxuICAgIDogbmV3IEJ1ZmZlcihuZXcgVWludDhBcnJheShvYmouc2xpY2UoYnl0ZU9mZnNldCwgYnl0ZU9mZnNldCArIGxlbmd0aCkpKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHJldHVybiBpc01vZGVyblxuICAgID8gQnVmZmVyLmZyb20oc3RyaW5nLCBlbmNvZGluZylcbiAgICA6IG5ldyBCdWZmZXIoc3RyaW5nLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYnVmZmVyRnJvbSAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAoaXNBcnJheUJ1ZmZlcih2YWx1ZSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGlzTW9kZXJuXG4gICAgPyBCdWZmZXIuZnJvbSh2YWx1ZSlcbiAgICA6IG5ldyBCdWZmZXIodmFsdWUpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnVmZmVyRnJvbVxuIiwiaW1wb3J0IHsgbWVyZ2UgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgQWJzdHJhY3RDaHJvbWVQbHVnaW5SZWxvYWRlciBmcm9tIFwiLi93ZWJwYWNrL0Fic3RyYWN0Q2hyb21lRXh0ZW5zaW9uUmVsb2FkZXJcIjtcbmltcG9ydCB7IG1pZGRsZXdhcmVJbmplY3RvciB9IGZyb20gXCIuL21pZGRsZXdhcmVcIjtcbmltcG9ydCB7IGNoYW5nZXNUcmlnZ2VyZXIgfSBmcm9tIFwiLi9ob3QtcmVsb2FkXCI7XG5pbXBvcnQgZGVmYXVsdE9wdGlvbnMgZnJvbSBcIi4vdXRpbHMvZGVmYXVsdC1vcHRpb25zXCI7XG5pbXBvcnQgQ29tcGlsZXJFdmVudHNGYWNhZGUgZnJvbSBcIi4vd2VicGFjay9Db21waWxlckV2ZW50c0ZhY2FkZVwiO1xuaW1wb3J0IHsgb25seU9uRGV2ZWxvcG1lbnRNc2cgfSBmcm9tIFwiLi9tZXNzYWdlcy93YXJuaW5nc1wiO1xuaW1wb3J0IHsgYmdTY3JpcHRSZXF1aXJlZE1zZyB9IGZyb20gXCIuL21lc3NhZ2VzL2Vycm9yc1wiO1xuaW1wb3J0IHsgd2FybiB9IGZyb20gXCIuL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IHsgQ29tcGlsZXIsIHZlcnNpb24gfSBmcm9tIFwid2VicGFja1wiO1xuXG5pbXBvcnQge1xuICBDaHJvbWVFeHRlbnNpb25SZWxvYWRlckluc3RhbmNlLFxuICBQbHVnaW5PcHRpb25zLFxuICBFbnRyaWVzT3B0aW9uXG59IGZyb20gXCJ3ZWJwYWNrLWNocm9tZS1leHRlbnNpb24tcmVsb2FkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hyb21lRXh0ZW5zaW9uUmVsb2FkZXJJbXBsIGV4dGVuZHMgQWJzdHJhY3RDaHJvbWVQbHVnaW5SZWxvYWRlclxuICBpbXBsZW1lbnRzIENocm9tZUV4dGVuc2lvblJlbG9hZGVySW5zdGFuY2Uge1xuICBwcml2YXRlIF9vcHRzPzogUGx1Z2luT3B0aW9ucztcbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IFBsdWdpbk9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX29wdHMgPSBvcHRpb25zO1xuICAgIHRoaXMuX2NodW5rVmVyc2lvbnMgPSB7fTtcbiAgfVxuXG4gIF9pc1dlYnBhY2tHVG9FVjQoKSB7XG4gICAgaWYgKHZlcnNpb24pIHtcbiAgICAgIGNvbnN0IFttYWpvcl0gPSB2ZXJzaW9uLnNwbGl0KFwiLlwiKTtcbiAgICAgIGlmIChwYXJzZUludChtYWpvcikgPj0gNCkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIF9jb250ZW50T3JCZ0NoYW5nZWQoXG4gICAgY2h1bmtzOiBXZWJwYWNrQ2h1bmtbXSxcbiAgICB7IGJhY2tncm91bmQsIGNvbnRlbnRTY3JpcHQgfTogRW50cmllc09wdGlvblxuICApIHtcbiAgICByZXR1cm4gY2h1bmtzXG4gICAgICAuZmlsdGVyKCh7IG5hbWUsIGhhc2ggfSkgPT4ge1xuICAgICAgICBjb25zdCBvbGRWZXJzaW9uID0gdGhpcy5fY2h1bmtWZXJzaW9uc1tuYW1lXTtcbiAgICAgICAgdGhpcy5fY2h1bmtWZXJzaW9uc1tuYW1lXSA9IGhhc2g7XG4gICAgICAgIHJldHVybiBoYXNoICE9PSBvbGRWZXJzaW9uO1xuICAgICAgfSlcbiAgICAgIC5zb21lKCh7IG5hbWUgfSkgPT4gbmFtZSA9PT0gYmFja2dyb3VuZCB8fCBuYW1lID09PSBjb250ZW50U2NyaXB0KTtcbiAgfVxuXG4gIF9yZWdpc3RlclBsdWdpbihjb21waWxlcjogQ29tcGlsZXIpIHtcbiAgICBjb25zdCB7IHJlbG9hZFBhZ2UsIHBvcnQsIGVudHJpZXMgfSA9IG1lcmdlKGRlZmF1bHRPcHRpb25zLCB0aGlzLl9vcHRzKTtcblxuICAgIHRoaXMuX2V2ZW50QVBJID0gbmV3IENvbXBpbGVyRXZlbnRzRmFjYWRlKGNvbXBpbGVyKTtcbiAgICB0aGlzLl9pbmplY3RvciA9IG1pZGRsZXdhcmVJbmplY3RvcihlbnRyaWVzLCB7IHBvcnQsIHJlbG9hZFBhZ2UgfSk7XG4gICAgdGhpcy5fdHJpZ2dlcmVyID0gY2hhbmdlc1RyaWdnZXJlcihwb3J0LCByZWxvYWRQYWdlKTtcbiAgICB0aGlzLl9ldmVudEFQSS5hZnRlck9wdGltaXplQ2h1bmtBc3NldHMoKGNvbXAsIGNodW5rcykgPT4ge1xuICAgICAgaWYgKCFjb21waWxlci5vcHRpb25zLmVudHJ5IHx8ICFjb21waWxlci5vcHRpb25zLmVudHJ5W1wiYmFja2dyb3VuZFwiXSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGJnU2NyaXB0UmVxdWlyZWRNc2cuZ2V0KCkpO1xuICAgICAgfVxuICAgICAgY29tcC5hc3NldHMgPSB7XG4gICAgICAgIC4uLmNvbXAuYXNzZXRzLFxuICAgICAgICAuLi50aGlzLl9pbmplY3Rvcihjb21wLmFzc2V0cywgY2h1bmtzKVxuICAgICAgfTtcbiAgICB9KTtcbiAgICB0aGlzLl9ldmVudEFQSS5hZnRlckVtaXQoKGNvbXAsIGRvbmUpID0+IHtcbiAgICAgIGlmICh0aGlzLl9jb250ZW50T3JCZ0NoYW5nZWQoY29tcC5jaHVua3MsIGVudHJpZXMpKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJlcigpXG4gICAgICAgICAgLnRoZW4oZG9uZSlcbiAgICAgICAgICAuY2F0Y2goZG9uZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhcHBseShjb21waWxlcjogQ29tcGlsZXIpIHtcbiAgICBpZiAoXG4gICAgICAodGhpcy5faXNXZWJwYWNrR1RvRVY0KClcbiAgICAgICAgPyBjb21waWxlci5vcHRpb25zLm1vZGVcbiAgICAgICAgOiBwcm9jZXNzLmVudi5OT0RFX0VOVikgPT09IFwiZGV2ZWxvcG1lbnRcIlxuICAgICkge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJQbHVnaW4oY29tcGlsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3YXJuKG9ubHlPbkRldmVsb3BtZW50TXNnLmdldCgpKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbiB9IGZyb20gXCJ3ZWJwYWNrXCI7XG5pbXBvcnQgQ29tcGlsZXJFdmVudHNGYWNhZGUgZnJvbSBcIi4vQ29tcGlsZXJFdmVudHNGYWNhZGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RDaHJvbWVFeHRlbnNpb25SZWxvYWRlclxuICBpbXBsZW1lbnRzIFBsdWdpbiB7XG4gIHByb3RlY3RlZCBfaW5qZWN0b3I6IEZ1bmN0aW9uO1xuICBwcm90ZWN0ZWQgX3RyaWdnZXJlcjogRnVuY3Rpb247XG4gIHByb3RlY3RlZCBfZXZlbnRBUEk6IENvbXBpbGVyRXZlbnRzRmFjYWRlO1xuICBwcm90ZWN0ZWQgX2NodW5rVmVyc2lvbnM6IE9iamVjdDtcblxuICBjb250ZXh0OiBhbnk7XG5cbiAgYWJzdHJhY3QgYXBwbHkob3B0aW9ucz86IGFueSk7XG59XG4iLCJpbXBvcnQgX21pZGRsZXdhcmVJbmplY3RvciBmcm9tIFwiLi9taWRkbGV3YXJlLWluamVjdG9yXCI7XG5cbmV4cG9ydCBjb25zdCBtaWRkbGV3YXJlSW5qZWN0b3IgPSBfbWlkZGxld2FyZUluamVjdG9yO1xuIiwiaW1wb3J0IHsgQ29uY2F0U291cmNlIH0gZnJvbSBcIndlYnBhY2stc291cmNlc1wiO1xuaW1wb3J0IG1pZGRsZVdhcmVTb3VyY2VCdWlsZGVyIGZyb20gXCIuL21pZGRsZXdhcmUtc291cmNlLWJ1aWxkZXJcIjtcbmltcG9ydCB7IEVudHJpZXNPcHRpb24gfSBmcm9tIFwid2VicGFjay1jaHJvbWUtZXh0ZW5zaW9uLXJlbG9hZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1pZGRsZXdhcmVJbmplY3RvcihcbiAgeyBiYWNrZ3JvdW5kLCBjb250ZW50U2NyaXB0IH06IEVudHJpZXNPcHRpb24sXG4gIHsgcG9ydCwgcmVsb2FkUGFnZSB9OiBNaWRkbGV3YXJlVGVtcGxhdGVQYXJhbXNcbikge1xuICBjb25zdCBzb3VyY2UgPSBtaWRkbGVXYXJlU291cmNlQnVpbGRlcih7IHBvcnQsIHJlbG9hZFBhZ2UgfSk7XG4gIGNvbnN0IHNvdXJjZUZhY3Rvcnk6IFNvdXJjZUZhY3RvcnkgPSAoLi4uc291cmNlcykgPT5cbiAgICBuZXcgQ29uY2F0U291cmNlKC4uLnNvdXJjZXMpIGFzIGFueTtcblxuICByZXR1cm4gKGFzc2V0czogb2JqZWN0LCBjaHVua3M6IFdlYnBhY2tDaHVua1tdKSA9PlxuICAgIGNodW5rcy5yZWR1Y2UoKHByZXYsIHsgbmFtZSwgZmlsZXMgfSkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBuYW1lID09PSBiYWNrZ3JvdW5kIHx8XG4gICAgICAgIG5hbWUgPT09IGNvbnRlbnRTY3JpcHQgfHxcbiAgICAgICAgY29udGVudFNjcmlwdC5pbmNsdWRlcyhuYW1lKVxuICAgICAgKSB7XG4gICAgICAgIGZpbGVzLmZvckVhY2goZW50cnlQb2ludCA9PiB7XG4gICAgICAgICAgaWYgKC9cXC5qcyQvLnRlc3QoZW50cnlQb2ludCkpIHtcbiAgICAgICAgICAgIHByZXZbZW50cnlQb2ludF0gPSBzb3VyY2VGYWN0b3J5KHNvdXJjZSwgYXNzZXRzW2VudHJ5UG9pbnRdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwge30pO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18zMF9fOyIsImltcG9ydCB7IHRlbXBsYXRlIH0gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHtcbiAgUkVDT05ORUNUX0lOVEVSVkFMLFxuICBTT0NLRVRfRVJSX0NPREVfUkVGXG59IGZyb20gXCIuLi9jb25zdGFudHMvbWlkbGV3YXJlLWNvbmZpZy5jb25zdGFudHNcIjtcbmltcG9ydCAqIGFzIHNpZ25hbHMgZnJvbSBcIi4uL3V0aWxzL3NpZ25hbHNcIjtcbmltcG9ydCByYXdTb3VyY2UgZnJvbSBcInJhdy1sb2FkZXIhLi93Y2VyLW1pZGRsZXdhcmUucmF3XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1pZGRsZVdhcmVTb3VyY2VCdWlsZGVyKHtcbiAgcG9ydCxcbiAgcmVsb2FkUGFnZVxufTogTWlkZGxld2FyZVRlbXBsYXRlUGFyYW1zKTogc3RyaW5nIHtcbiAgY29uc3QgdG1wbCA9IHRlbXBsYXRlKHJhd1NvdXJjZSk7XG5cbiAgcmV0dXJuIHRtcGwoe1xuICAgIFdTSG9zdDogYHdzOi8vbG9jYWxob3N0OiR7cG9ydH1gLFxuICAgIHJlbG9hZFBhZ2U6IGAke3JlbG9hZFBhZ2V9YCxcbiAgICBzaWduYWxzOiBKU09OLnN0cmluZ2lmeShzaWduYWxzKSxcbiAgICBjb25maWc6IEpTT04uc3RyaW5naWZ5KHsgUkVDT05ORUNUX0lOVEVSVkFMLCBTT0NLRVRfRVJSX0NPREVfUkVGIH0pXG4gIH0pO1xufVxuIiwiZXhwb3J0IGNvbnN0IFJFQ09OTkVDVF9JTlRFUlZBTCA9IDIwMDA7XG5leHBvcnQgY29uc3QgU09DS0VUX0VSUl9DT0RFX1JFRiA9XG4gIFwiaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY0NTUjc2VjdGlvbi03LjQuMVwiO1xuIiwiZXhwb3J0IGRlZmF1bHQgXCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xcblxcbi8qICBTdGFydCBvZiBXZWJwYWNrIENocm9tZSBIb3QgRXh0ZW5zaW9uIE1pZGRsZXdhcmUgICovXFxuXFxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKiAgVGhpcyB3aWxsIGJlIGNvbnZlcnRlZCBpbnRvIGEgbG9kYXNoIHRlbXBsLiwgYW55ICAqL1xcblxcbi8qICBleHRlcm5hbCBhcmd1bWVudCBtdXN0IGJlIHByb3ZpZGVkIHVzaW5nIGl0ICAgICAgICovXFxuXFxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cXG4oZnVuY3Rpb24gKGNocm9tZSwgd2luZG93KSB7XFxuICB2YXIgc2lnbmFscyA9IEpTT04ucGFyc2UoJzwlPSBzaWduYWxzICU+Jyk7XFxuICB2YXIgY29uZmlnID0gSlNPTi5wYXJzZSgnPCU9IGNvbmZpZyAlPicpO1xcbiAgdmFyIHJlbG9hZFBhZ2UgPSBcXFwiPCU9IHJlbG9hZFBhZ2UgJT5cXFwiID09PSBcXFwidHJ1ZVxcXCI7XFxuICB2YXIgd3NIb3N0ID0gXFxcIjwlPSBXU0hvc3QgJT5cXFwiO1xcbiAgdmFyIFNJR05fQ0hBTkdFID0gc2lnbmFscy5TSUdOX0NIQU5HRSxcXG4gICAgICBTSUdOX1JFTE9BRCA9IHNpZ25hbHMuU0lHTl9SRUxPQUQsXFxuICAgICAgU0lHTl9SRUxPQURFRCA9IHNpZ25hbHMuU0lHTl9SRUxPQURFRCxcXG4gICAgICBTSUdOX0xPRyA9IHNpZ25hbHMuU0lHTl9MT0csXFxuICAgICAgU0lHTl9DT05ORUNUID0gc2lnbmFscy5TSUdOX0NPTk5FQ1Q7XFxuICB2YXIgUkVDT05ORUNUX0lOVEVSVkFMID0gY29uZmlnLlJFQ09OTkVDVF9JTlRFUlZBTCxcXG4gICAgICBTT0NLRVRfRVJSX0NPREVfUkVGID0gY29uZmlnLlNPQ0tFVF9FUlJfQ09ERV9SRUY7XFxuICB2YXIgcnVudGltZSA9IGNocm9tZS5ydW50aW1lLFxcbiAgICAgIHRhYnMgPSBjaHJvbWUudGFicztcXG4gIHZhciBtYW5pZmVzdCA9IHJ1bnRpbWUuZ2V0TWFuaWZlc3QoKTsgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBIZWxwZXIgZnVuY3Rpb25zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xcblxcbiAgdmFyIGZvcm1hdHRlciA9IGZ1bmN0aW9uIGZvcm1hdHRlcihtc2cpIHtcXG4gICAgcmV0dXJuIFxcXCJbIFdDRVI6IFxcXCIuY29uY2F0KG1zZywgXFxcIiBdXFxcIik7XFxuICB9O1xcblxcbiAgdmFyIGxvZ2dlciA9IGZ1bmN0aW9uIGxvZ2dlcihtc2cpIHtcXG4gICAgdmFyIGxldmVsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBcXFwiaW5mb1xcXCI7XFxuICAgIHJldHVybiBjb25zb2xlW2xldmVsXShmb3JtYXR0ZXIobXNnKSk7XFxuICB9O1xcblxcbiAgdmFyIHRpbWVGb3JtYXR0ZXIgPSBmdW5jdGlvbiB0aW1lRm9ybWF0dGVyKGRhdGUpIHtcXG4gICAgcmV0dXJuIGRhdGUudG9UaW1lU3RyaW5nKCkucmVwbGFjZSgvLiooXFxcXGR7Mn06XFxcXGR7Mn06XFxcXGR7Mn0pLiovLCBcXFwiJDFcXFwiKTtcXG4gIH07IC8vID09PT09PT09PT09PT09PT09PT09PT09PT09IENhbGxlZCBvbmx5IG9uIGNvbnRlbnQgc2NyaXB0cyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cXG5cXG5cXG4gIGZ1bmN0aW9uIGNvbnRlbnRTY3JpcHRXb3JrZXIoKSB7XFxuICAgIHJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xcbiAgICAgIHR5cGU6IFNJR05fQ09OTkVDVFxcbiAgICB9LCBmdW5jdGlvbiAobXNnKSB7XFxuICAgICAgcmV0dXJuIGNvbnNvbGUuaW5mbyhtc2cpO1xcbiAgICB9KTtcXG4gICAgcnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKF9yZWYpIHtcXG4gICAgICB2YXIgdHlwZSA9IF9yZWYudHlwZSxcXG4gICAgICAgICAgcGF5bG9hZCA9IF9yZWYucGF5bG9hZDtcXG5cXG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcXG4gICAgICAgIGNhc2UgU0lHTl9SRUxPQUQ6XFxuICAgICAgICAgIGxvZ2dlcihcXFwiRGV0ZWN0ZWQgQ2hhbmdlcy4gUmVsb2FkaW5nIC4uLlxcXCIpO1xcbiAgICAgICAgICByZWxvYWRQYWdlICYmIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcXG4gICAgICAgICAgYnJlYWs7XFxuXFxuICAgICAgICBjYXNlIFNJR05fTE9HOlxcbiAgICAgICAgICBjb25zb2xlLmluZm8ocGF5bG9hZCk7XFxuICAgICAgICAgIGJyZWFrO1xcbiAgICAgIH1cXG4gICAgfSk7XFxuICB9IC8vID09PT09PT09PT09PT09PT09PT09PT09PSBDYWxsZWQgb25seSBvbiBiYWNrZ3JvdW5kIHNjcmlwdHMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cXG5cXG5cXG4gIGZ1bmN0aW9uIGJhY2tncm91bmRXb3JrZXIoc29ja2V0KSB7XFxuICAgIHJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChhY3Rpb24sIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XFxuICAgICAgaWYgKGFjdGlvbi50eXBlID09PSBTSUdOX0NPTk5FQ1QpIHtcXG4gICAgICAgIHNlbmRSZXNwb25zZShmb3JtYXR0ZXIoXFxcIkNvbm5lY3RlZCB0byBDaHJvbWUgRXh0ZW5zaW9uIEhvdCBSZWxvYWRlclxcXCIpKTtcXG4gICAgICB9XFxuICAgIH0pO1xcbiAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcXFwibWVzc2FnZVxcXCIsIGZ1bmN0aW9uIChfcmVmMikge1xcbiAgICAgIHZhciBkYXRhID0gX3JlZjIuZGF0YTtcXG5cXG4gICAgICB2YXIgX0pTT04kcGFyc2UgPSBKU09OLnBhcnNlKGRhdGEpLFxcbiAgICAgICAgICB0eXBlID0gX0pTT04kcGFyc2UudHlwZSxcXG4gICAgICAgICAgcGF5bG9hZCA9IF9KU09OJHBhcnNlLnBheWxvYWQ7XFxuXFxuICAgICAgaWYgKHR5cGUgPT09IFNJR05fQ0hBTkdFKSB7XFxuICAgICAgICB0YWJzLnF1ZXJ5KHtcXG4gICAgICAgICAgc3RhdHVzOiBcXFwiY29tcGxldGVcXFwiXFxuICAgICAgICB9LCBmdW5jdGlvbiAobG9hZGVkVGFicykge1xcbiAgICAgICAgICBsb2FkZWRUYWJzLmZvckVhY2goZnVuY3Rpb24gKHRhYikge1xcbiAgICAgICAgICAgIHJldHVybiB0YWIuaWQgJiYgdGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHtcXG4gICAgICAgICAgICAgIHR5cGU6IFNJR05fUkVMT0FEXFxuICAgICAgICAgICAgfSk7XFxuICAgICAgICAgIH0pO1xcbiAgICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XFxuICAgICAgICAgICAgdHlwZTogU0lHTl9SRUxPQURFRCxcXG4gICAgICAgICAgICBwYXlsb2FkOiBmb3JtYXR0ZXIoXFxcIlxcXCIuY29uY2F0KHRpbWVGb3JtYXR0ZXIobmV3IERhdGUoKSksIFxcXCIgLSBcXFwiKS5jb25jYXQobWFuaWZlc3QubmFtZSwgXFxcIiBzdWNjZXNzZnVsbHkgcmVsb2FkZWRcXFwiKSlcXG4gICAgICAgICAgfSkpO1xcbiAgICAgICAgICBydW50aW1lLnJlbG9hZCgpO1xcbiAgICAgICAgfSk7XFxuICAgICAgfSBlbHNlIHtcXG4gICAgICAgIHJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xcbiAgICAgICAgICB0eXBlOiB0eXBlLFxcbiAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXFxuICAgICAgICB9KTtcXG4gICAgICB9XFxuICAgIH0pO1xcbiAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcXFwiY2xvc2VcXFwiLCBmdW5jdGlvbiAoX3JlZjMpIHtcXG4gICAgICB2YXIgY29kZSA9IF9yZWYzLmNvZGU7XFxuICAgICAgbG9nZ2VyKFxcXCJTb2NrZXQgY29ubmVjdGlvbiBjbG9zZWQuIENvZGUgXFxcIi5jb25jYXQoY29kZSwgXFxcIi4gU2VlIG1vcmUgaW4gXFxcIikuY29uY2F0KFNPQ0tFVF9FUlJfQ09ERV9SRUYpLCBcXFwid2FyblxcXCIpO1xcbiAgICAgIHZhciBpbnRJZCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcXG4gICAgICAgIGxvZ2dlcihcXFwiQXR0ZW1wdGluZyB0byByZWNvbm5lY3QgKHRpcDogQ2hlY2sgaWYgV2VicGFjayBpcyBydW5uaW5nKVxcXCIpO1xcbiAgICAgICAgdmFyIHdzID0gbmV3IFdlYlNvY2tldCh3c0hvc3QpO1xcbiAgICAgICAgd3MuYWRkRXZlbnRMaXN0ZW5lcihcXFwib3BlblxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRJZCk7XFxuICAgICAgICAgIGxvZ2dlcihcXFwiUmVjb25uZWN0ZWQuIFJlbG9hZGluZyBwbHVnaW5cXFwiKTtcXG4gICAgICAgICAgcnVudGltZS5yZWxvYWQoKTtcXG4gICAgICAgIH0pO1xcbiAgICAgIH0sIFJFQ09OTkVDVF9JTlRFUlZBTCk7XFxuICAgIH0pO1xcbiAgfSAvLyA9PT09PT09PT09PT09PT09PT09PT09PSBCb290c3RyYXBzIHRoZSBtaWRkbGV3YXJlID09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xcblxcbiAgLyogQHRzLWlnbm9yZSAqL1xcblxcblxcbiAgcnVudGltZS5yZWxvYWQgPyBiYWNrZ3JvdW5kV29ya2VyKG5ldyBXZWJTb2NrZXQod3NIb3N0KSkgOiBjb250ZW50U2NyaXB0V29ya2VyKCk7XFxufSkoY2hyb21lLCB3aW5kb3cpO1xcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXFxuXFxuLyogRW5kIG9mIFdlYnBhY2sgQ2hyb21lIEhvdCBFeHRlbnNpb24gTWlkZGxld2FyZSAgKi9cXG5cXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1wiIiwiaW1wb3J0IF9jaGFuZ2VzVHJpZ2dlcmVyIGZyb20gXCIuL2NoYW5nZXMtdHJpZ2dlcmVyXCI7XG5cbmV4cG9ydCBjb25zdCBjaGFuZ2VzVHJpZ2dlcmVyID0gX2NoYW5nZXNUcmlnZ2VyZXI7XG4iLCJpbXBvcnQgSG90UmVsb2FkZXJTZXJ2ZXIgZnJvbSBcIi4vSG90UmVsb2FkZXJTZXJ2ZXJcIjtcbmltcG9ydCB7IGluZm8gfSBmcm9tIFwiLi4vdXRpbHMvbG9nZ2VyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IChwb3J0OiBudW1iZXIsIHJlbG9hZFBhZ2U6IGJvb2xlYW4pID0+IHtcbiAgY29uc3Qgc2VydmVyID0gbmV3IEhvdFJlbG9hZGVyU2VydmVyKHBvcnQpO1xuXG4gIGluZm8oXCJbIFN0YXJ0aW5nIHRoZSBDaHJvbWUgSG90IFBsdWdpbiBSZWxvYWQgU2VydmVyLi4uIF1cIik7XG4gIHNlcnZlci5saXN0ZW4oKTtcblxuICByZXR1cm4gKCk6IFByb21pc2U8YW55PiA9PiB7XG4gICAgcmV0dXJuIHNlcnZlci5zaWduQ2hhbmdlKHJlbG9hZFBhZ2UpO1xuICB9O1xufTtcbiIsImltcG9ydCB7IFNlcnZlciB9IGZyb20gXCJ3c1wiO1xuaW1wb3J0IHsgaW5mbyB9IGZyb20gXCIuLi91dGlscy9sb2dnZXJcIjtcbmltcG9ydCBTaWduRW1pdHRlciBmcm9tIFwiLi9TaWduRW1pdHRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3RSZWxvYWRlclNlcnZlciB7XG4gIHByaXZhdGUgX3NlcnZlcjogU2VydmVyO1xuICBwcml2YXRlIF9zaWduRW1pdGVyOiBTaWduRW1pdHRlcjtcblxuICBjb25zdHJ1Y3Rvcihwb3J0OiBudW1iZXIpIHtcbiAgICB0aGlzLl9zZXJ2ZXIgPSBuZXcgU2VydmVyKHsgcG9ydCB9KTtcbiAgfVxuXG4gIGxpc3RlbigpIHtcbiAgICB0aGlzLl9zZXJ2ZXIub24oXCJjb25uZWN0aW9uXCIsICh3cywgbXNnKSA9PiB7XG4gICAgICBjb25zdCBicm93c2VyVmVyc2lvbiA9IHRoaXMuX2dldEJyb3dzZXJWZXJzaW9uKG1zZy5oZWFkZXJzW1widXNlci1hZ2VudFwiXSk7XG4gICAgICB0aGlzLl9zaWduRW1pdGVyID0gbmV3IFNpZ25FbWl0dGVyKHRoaXMuX3NlcnZlciwgYnJvd3NlclZlcnNpb24pO1xuXG4gICAgICB3cy5vbihcIm1lc3NhZ2VcIiwgKGRhdGE6IHN0cmluZykgPT5cbiAgICAgICAgaW5mbyhgTWVzc2FnZSBmcm9tIHRoZSBjbGllbnQ6ICR7SlNPTi5wYXJzZShkYXRhKS5wYXlsb2FkfWApXG4gICAgICApO1xuICAgICAgd3Mub24oXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICAgIC8vIE5PT1AgLSBzd2FsbG93IHNvY2tldCBlcnJvcnMgZHVlIHRvIGh0dHA6Ly9naXQuaW8vdmJoU05cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2lnbkNoYW5nZShyZWxvYWRQYWdlOiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAodGhpcy5fc2lnbkVtaXRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuX3NpZ25FbWl0ZXIuc2FmZVNpZ25DaGFuZ2UocmVsb2FkUGFnZSk7XG4gICAgfSBlbHNlIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRCcm93c2VyVmVyc2lvbih1c2VyQWdlbnQpIHtcbiAgICBjb25zdCB2ZXIgPSB1c2VyQWdlbnQubWF0Y2goL1xcIENocm9tKGV8aXVtKVxcLyhbMC05XFwuXSopXFwgLyk7XG4gICAgaWYgKHZlciAmJiB2ZXIubGVuZ3RoID09PSAzKSB7XG4gICAgICByZXR1cm4gdmVyWzJdO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsIi8qXG5cblRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG5PcmlnaW5hbCBMaWJyYXJ5XG4gIC0gQ29weXJpZ2h0IChjKSBNYXJhayBTcXVpcmVzXG5cbkFkZGl0aW9uYWwgZnVuY3Rpb25hbGl0eVxuIC0gQ29weXJpZ2h0IChjKSBTaW5kcmUgU29yaHVzIDxzaW5kcmVzb3JodXNAZ21haWwuY29tPiAoc2luZHJlc29yaHVzLmNvbSlcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuXG4qL1xuXG52YXIgY29sb3JzID0ge307XG5tb2R1bGVbJ2V4cG9ydHMnXSA9IGNvbG9ycztcblxuY29sb3JzLnRoZW1lcyA9IHt9O1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBhbnNpU3R5bGVzID0gY29sb3JzLnN0eWxlcyA9IHJlcXVpcmUoJy4vc3R5bGVzJyk7XG52YXIgZGVmaW5lUHJvcHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbnZhciBuZXdMaW5lUmVnZXggPSBuZXcgUmVnRXhwKC9bXFxyXFxuXSsvZyk7XG5cbmNvbG9ycy5zdXBwb3J0c0NvbG9yID0gcmVxdWlyZSgnLi9zeXN0ZW0vc3VwcG9ydHMtY29sb3JzJykuc3VwcG9ydHNDb2xvcjtcblxuaWYgKHR5cGVvZiBjb2xvcnMuZW5hYmxlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgY29sb3JzLmVuYWJsZWQgPSBjb2xvcnMuc3VwcG9ydHNDb2xvcigpICE9PSBmYWxzZTtcbn1cblxuY29sb3JzLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuICBjb2xvcnMuZW5hYmxlZCA9IHRydWU7XG59O1xuXG5jb2xvcnMuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICBjb2xvcnMuZW5hYmxlZCA9IGZhbHNlO1xufTtcblxuY29sb3JzLnN0cmlwQ29sb3JzID0gY29sb3JzLnN0cmlwID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiAoJycgKyBzdHIpLnJlcGxhY2UoL1xceDFCXFxbXFxkK20vZywgJycpO1xufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG52YXIgc3R5bGl6ZSA9IGNvbG9ycy5zdHlsaXplID0gZnVuY3Rpb24gc3R5bGl6ZShzdHIsIHN0eWxlKSB7XG4gIGlmICghY29sb3JzLmVuYWJsZWQpIHtcbiAgICByZXR1cm4gc3RyKycnO1xuICB9XG5cbiAgdmFyIHN0eWxlTWFwID0gYW5zaVN0eWxlc1tzdHlsZV07XG5cbiAgLy8gU3R5bGl6ZSBzaG91bGQgd29yayBmb3Igbm9uLUFOU0kgc3R5bGVzLCB0b29cbiAgaWYoIXN0eWxlTWFwICYmIHN0eWxlIGluIGNvbG9ycyl7XG4gICAgLy8gU3R5bGUgbWFwcyBsaWtlIHRyYXAgb3BlcmF0ZSBhcyBmdW5jdGlvbnMgb24gc3RyaW5ncztcbiAgICAvLyB0aGV5IGRvbid0IGhhdmUgcHJvcGVydGllcyBsaWtlIG9wZW4gb3IgY2xvc2UuXG4gICAgcmV0dXJuIGNvbG9yc1tzdHlsZV0oc3RyKTtcbiAgfVxuXG4gIHJldHVybiBzdHlsZU1hcC5vcGVuICsgc3RyICsgc3R5bGVNYXAuY2xvc2U7XG59O1xuXG52YXIgbWF0Y2hPcGVyYXRvcnNSZSA9IC9bfFxcXFx7fSgpW1xcXV4kKyo/Ll0vZztcbnZhciBlc2NhcGVTdHJpbmdSZWdleHAgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcnKTtcbiAgfVxuICByZXR1cm4gc3RyLnJlcGxhY2UobWF0Y2hPcGVyYXRvcnNSZSwgJ1xcXFwkJicpO1xufTtcblxuZnVuY3Rpb24gYnVpbGQoX3N0eWxlcykge1xuICB2YXIgYnVpbGRlciA9IGZ1bmN0aW9uIGJ1aWxkZXIoKSB7XG4gICAgcmV0dXJuIGFwcGx5U3R5bGUuYXBwbHkoYnVpbGRlciwgYXJndW1lbnRzKTtcbiAgfTtcbiAgYnVpbGRlci5fc3R5bGVzID0gX3N0eWxlcztcbiAgLy8gX19wcm90b19fIGlzIHVzZWQgYmVjYXVzZSB3ZSBtdXN0IHJldHVybiBhIGZ1bmN0aW9uLCBidXQgdGhlcmUgaXNcbiAgLy8gbm8gd2F5IHRvIGNyZWF0ZSBhIGZ1bmN0aW9uIHdpdGggYSBkaWZmZXJlbnQgcHJvdG90eXBlLlxuICBidWlsZGVyLl9fcHJvdG9fXyA9IHByb3RvO1xuICByZXR1cm4gYnVpbGRlcjtcbn1cblxudmFyIHN0eWxlcyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHJldCA9IHt9O1xuICBhbnNpU3R5bGVzLmdyZXkgPSBhbnNpU3R5bGVzLmdyYXk7XG4gIE9iamVjdC5rZXlzKGFuc2lTdHlsZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgYW5zaVN0eWxlc1trZXldLmNsb3NlUmUgPVxuICAgICAgbmV3IFJlZ0V4cChlc2NhcGVTdHJpbmdSZWdleHAoYW5zaVN0eWxlc1trZXldLmNsb3NlKSwgJ2cnKTtcbiAgICByZXRba2V5XSA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBidWlsZCh0aGlzLl9zdHlsZXMuY29uY2F0KGtleSkpO1xuICAgICAgfSxcbiAgICB9O1xuICB9KTtcbiAgcmV0dXJuIHJldDtcbn0pKCk7XG5cbnZhciBwcm90byA9IGRlZmluZVByb3BzKGZ1bmN0aW9uIGNvbG9ycygpIHt9LCBzdHlsZXMpO1xuXG5mdW5jdGlvbiBhcHBseVN0eWxlKCkge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgdmFyIHN0ciA9IGFyZ3MubWFwKGZ1bmN0aW9uKGFyZykge1xuICAgIC8vIFVzZSB3ZWFrIGVxdWFsaXR5IGNoZWNrIHNvIHdlIGNhbiBjb2xvcml6ZSBudWxsL3VuZGVmaW5lZCBpbiBzYWZlIG1vZGVcbiAgICBpZiAoYXJnICE9IG51bGwgJiYgYXJnLmNvbnN0cnVjdG9yID09PSBTdHJpbmcpIHtcbiAgICAgIHJldHVybiBhcmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1dGlsLmluc3BlY3QoYXJnKTtcbiAgICB9XG4gIH0pLmpvaW4oJyAnKTtcblxuICBpZiAoIWNvbG9ycy5lbmFibGVkIHx8ICFzdHIpIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgdmFyIG5ld0xpbmVzUHJlc2VudCA9IHN0ci5pbmRleE9mKCdcXG4nKSAhPSAtMTtcblxuICB2YXIgbmVzdGVkU3R5bGVzID0gdGhpcy5fc3R5bGVzO1xuXG4gIHZhciBpID0gbmVzdGVkU3R5bGVzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIHZhciBjb2RlID0gYW5zaVN0eWxlc1tuZXN0ZWRTdHlsZXNbaV1dO1xuICAgIHN0ciA9IGNvZGUub3BlbiArIHN0ci5yZXBsYWNlKGNvZGUuY2xvc2VSZSwgY29kZS5vcGVuKSArIGNvZGUuY2xvc2U7XG4gICAgaWYgKG5ld0xpbmVzUHJlc2VudCkge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UobmV3TGluZVJlZ2V4LCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICByZXR1cm4gY29kZS5jbG9zZSArIG1hdGNoICsgY29kZS5vcGVuO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0cjtcbn1cblxuY29sb3JzLnNldFRoZW1lID0gZnVuY3Rpb24odGhlbWUpIHtcbiAgaWYgKHR5cGVvZiB0aGVtZSA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zb2xlLmxvZygnY29sb3JzLnNldFRoZW1lIG5vdyBvbmx5IGFjY2VwdHMgYW4gb2JqZWN0LCBub3QgYSBzdHJpbmcuICAnICtcbiAgICAgICdJZiB5b3UgYXJlIHRyeWluZyB0byBzZXQgYSB0aGVtZSBmcm9tIGEgZmlsZSwgaXQgaXMgbm93IHlvdXIgKHRoZSAnICtcbiAgICAgICdjYWxsZXJcXCdzKSByZXNwb25zaWJpbGl0eSB0byByZXF1aXJlIHRoZSBmaWxlLiAgVGhlIG9sZCBzeW50YXggJyArXG4gICAgICAnbG9va2VkIGxpa2UgY29sb3JzLnNldFRoZW1lKF9fZGlybmFtZSArICcgK1xuICAgICAgJ1xcJy8uLi90aGVtZXMvZ2VuZXJpYy1sb2dnaW5nLmpzXFwnKTsgVGhlIG5ldyBzeW50YXggbG9va3MgbGlrZSAnK1xuICAgICAgJ2NvbG9ycy5zZXRUaGVtZShyZXF1aXJlKF9fZGlybmFtZSArICcgK1xuICAgICAgJ1xcJy8uLi90aGVtZXMvZ2VuZXJpYy1sb2dnaW5nLmpzXFwnKSk7Jyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAodmFyIHN0eWxlIGluIHRoZW1lKSB7XG4gICAgKGZ1bmN0aW9uKHN0eWxlKSB7XG4gICAgICBjb2xvcnNbc3R5bGVdID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhlbWVbc3R5bGVdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHZhciBvdXQgPSBzdHI7XG4gICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGVtZVtzdHlsZV0pIHtcbiAgICAgICAgICAgIG91dCA9IGNvbG9yc1t0aGVtZVtzdHlsZV1baV1dKG91dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbG9yc1t0aGVtZVtzdHlsZV1dKHN0cik7XG4gICAgICB9O1xuICAgIH0pKHN0eWxlKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIHJldCA9IHt9O1xuICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIHJldFtuYW1lXSA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBidWlsZChbbmFtZV0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9KTtcbiAgcmV0dXJuIHJldDtcbn1cblxudmFyIHNlcXVlbmNlciA9IGZ1bmN0aW9uIHNlcXVlbmNlcihtYXAsIHN0cikge1xuICB2YXIgZXhwbG9kZWQgPSBzdHIuc3BsaXQoJycpO1xuICBleHBsb2RlZCA9IGV4cGxvZGVkLm1hcChtYXApO1xuICByZXR1cm4gZXhwbG9kZWQuam9pbignJyk7XG59O1xuXG4vLyBjdXN0b20gZm9ybWF0dGVyIG1ldGhvZHNcbmNvbG9ycy50cmFwID0gcmVxdWlyZSgnLi9jdXN0b20vdHJhcCcpO1xuY29sb3JzLnphbGdvID0gcmVxdWlyZSgnLi9jdXN0b20vemFsZ28nKTtcblxuLy8gbWFwc1xuY29sb3JzLm1hcHMgPSB7fTtcbmNvbG9ycy5tYXBzLmFtZXJpY2EgPSByZXF1aXJlKCcuL21hcHMvYW1lcmljYScpKGNvbG9ycyk7XG5jb2xvcnMubWFwcy56ZWJyYSA9IHJlcXVpcmUoJy4vbWFwcy96ZWJyYScpKGNvbG9ycyk7XG5jb2xvcnMubWFwcy5yYWluYm93ID0gcmVxdWlyZSgnLi9tYXBzL3JhaW5ib3cnKShjb2xvcnMpO1xuY29sb3JzLm1hcHMucmFuZG9tID0gcmVxdWlyZSgnLi9tYXBzL3JhbmRvbScpKGNvbG9ycyk7XG5cbmZvciAodmFyIG1hcCBpbiBjb2xvcnMubWFwcykge1xuICAoZnVuY3Rpb24obWFwKSB7XG4gICAgY29sb3JzW21hcF0gPSBmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiBzZXF1ZW5jZXIoY29sb3JzLm1hcHNbbWFwXSwgc3RyKTtcbiAgICB9O1xuICB9KShtYXApO1xufVxuXG5kZWZpbmVQcm9wcyhjb2xvcnMsIGluaXQoKSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyIsIi8qXG5UaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuQ29weXJpZ2h0IChjKSBTaW5kcmUgU29yaHVzIDxzaW5kcmVzb3JodXNAZ21haWwuY29tPiAoc2luZHJlc29yaHVzLmNvbSlcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuXG4qL1xuXG52YXIgc3R5bGVzID0ge307XG5tb2R1bGVbJ2V4cG9ydHMnXSA9IHN0eWxlcztcblxudmFyIGNvZGVzID0ge1xuICByZXNldDogWzAsIDBdLFxuXG4gIGJvbGQ6IFsxLCAyMl0sXG4gIGRpbTogWzIsIDIyXSxcbiAgaXRhbGljOiBbMywgMjNdLFxuICB1bmRlcmxpbmU6IFs0LCAyNF0sXG4gIGludmVyc2U6IFs3LCAyN10sXG4gIGhpZGRlbjogWzgsIDI4XSxcbiAgc3RyaWtldGhyb3VnaDogWzksIDI5XSxcblxuICBibGFjazogWzMwLCAzOV0sXG4gIHJlZDogWzMxLCAzOV0sXG4gIGdyZWVuOiBbMzIsIDM5XSxcbiAgeWVsbG93OiBbMzMsIDM5XSxcbiAgYmx1ZTogWzM0LCAzOV0sXG4gIG1hZ2VudGE6IFszNSwgMzldLFxuICBjeWFuOiBbMzYsIDM5XSxcbiAgd2hpdGU6IFszNywgMzldLFxuICBncmF5OiBbOTAsIDM5XSxcbiAgZ3JleTogWzkwLCAzOV0sXG5cbiAgYnJpZ2h0UmVkOiBbOTEsIDM5XSxcbiAgYnJpZ2h0R3JlZW46IFs5MiwgMzldLFxuICBicmlnaHRZZWxsb3c6IFs5MywgMzldLFxuICBicmlnaHRCbHVlOiBbOTQsIDM5XSxcbiAgYnJpZ2h0TWFnZW50YTogWzk1LCAzOV0sXG4gIGJyaWdodEN5YW46IFs5NiwgMzldLFxuICBicmlnaHRXaGl0ZTogWzk3LCAzOV0sXG5cbiAgYmdCbGFjazogWzQwLCA0OV0sXG4gIGJnUmVkOiBbNDEsIDQ5XSxcbiAgYmdHcmVlbjogWzQyLCA0OV0sXG4gIGJnWWVsbG93OiBbNDMsIDQ5XSxcbiAgYmdCbHVlOiBbNDQsIDQ5XSxcbiAgYmdNYWdlbnRhOiBbNDUsIDQ5XSxcbiAgYmdDeWFuOiBbNDYsIDQ5XSxcbiAgYmdXaGl0ZTogWzQ3LCA0OV0sXG4gIGJnR3JheTogWzEwMCwgNDldLFxuICBiZ0dyZXk6IFsxMDAsIDQ5XSxcblxuICBiZ0JyaWdodFJlZDogWzEwMSwgNDldLFxuICBiZ0JyaWdodEdyZWVuOiBbMTAyLCA0OV0sXG4gIGJnQnJpZ2h0WWVsbG93OiBbMTAzLCA0OV0sXG4gIGJnQnJpZ2h0Qmx1ZTogWzEwNCwgNDldLFxuICBiZ0JyaWdodE1hZ2VudGE6IFsxMDUsIDQ5XSxcbiAgYmdCcmlnaHRDeWFuOiBbMTA2LCA0OV0sXG4gIGJnQnJpZ2h0V2hpdGU6IFsxMDcsIDQ5XSxcblxuICAvLyBsZWdhY3kgc3R5bGVzIGZvciBjb2xvcnMgcHJlIHYxLjAuMFxuICBibGFja0JHOiBbNDAsIDQ5XSxcbiAgcmVkQkc6IFs0MSwgNDldLFxuICBncmVlbkJHOiBbNDIsIDQ5XSxcbiAgeWVsbG93Qkc6IFs0MywgNDldLFxuICBibHVlQkc6IFs0NCwgNDldLFxuICBtYWdlbnRhQkc6IFs0NSwgNDldLFxuICBjeWFuQkc6IFs0NiwgNDldLFxuICB3aGl0ZUJHOiBbNDcsIDQ5XSxcblxufTtcblxuT2JqZWN0LmtleXMoY29kZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gIHZhciB2YWwgPSBjb2Rlc1trZXldO1xuICB2YXIgc3R5bGUgPSBzdHlsZXNba2V5XSA9IFtdO1xuICBzdHlsZS5vcGVuID0gJ1xcdTAwMWJbJyArIHZhbFswXSArICdtJztcbiAgc3R5bGUuY2xvc2UgPSAnXFx1MDAxYlsnICsgdmFsWzFdICsgJ20nO1xufSk7XG4iLCIvKlxuVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbkNvcHlyaWdodCAoYykgU2luZHJlIFNvcmh1cyA8c2luZHJlc29yaHVzQGdtYWlsLmNvbT4gKHNpbmRyZXNvcmh1cy5jb20pXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cblxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgb3MgPSByZXF1aXJlKCdvcycpO1xudmFyIGhhc0ZsYWcgPSByZXF1aXJlKCcuL2hhcy1mbGFnLmpzJyk7XG5cbnZhciBlbnYgPSBwcm9jZXNzLmVudjtcblxudmFyIGZvcmNlQ29sb3IgPSB2b2lkIDA7XG5pZiAoaGFzRmxhZygnbm8tY29sb3InKSB8fCBoYXNGbGFnKCduby1jb2xvcnMnKSB8fCBoYXNGbGFnKCdjb2xvcj1mYWxzZScpKSB7XG4gIGZvcmNlQ29sb3IgPSBmYWxzZTtcbn0gZWxzZSBpZiAoaGFzRmxhZygnY29sb3InKSB8fCBoYXNGbGFnKCdjb2xvcnMnKSB8fCBoYXNGbGFnKCdjb2xvcj10cnVlJylcbiAgICAgICAgICAgfHwgaGFzRmxhZygnY29sb3I9YWx3YXlzJykpIHtcbiAgZm9yY2VDb2xvciA9IHRydWU7XG59XG5pZiAoJ0ZPUkNFX0NPTE9SJyBpbiBlbnYpIHtcbiAgZm9yY2VDb2xvciA9IGVudi5GT1JDRV9DT0xPUi5sZW5ndGggPT09IDBcbiAgICB8fCBwYXJzZUludChlbnYuRk9SQ0VfQ09MT1IsIDEwKSAhPT0gMDtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpIHtcbiAgaWYgKGxldmVsID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsZXZlbDogbGV2ZWwsXG4gICAgaGFzQmFzaWM6IHRydWUsXG4gICAgaGFzMjU2OiBsZXZlbCA+PSAyLFxuICAgIGhhczE2bTogbGV2ZWwgPj0gMyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3VwcG9ydHNDb2xvcihzdHJlYW0pIHtcbiAgaWYgKGZvcmNlQ29sb3IgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoaGFzRmxhZygnY29sb3I9MTZtJykgfHwgaGFzRmxhZygnY29sb3I9ZnVsbCcpXG4gICAgICB8fCBoYXNGbGFnKCdjb2xvcj10cnVlY29sb3InKSkge1xuICAgIHJldHVybiAzO1xuICB9XG5cbiAgaWYgKGhhc0ZsYWcoJ2NvbG9yPTI1NicpKSB7XG4gICAgcmV0dXJuIDI7XG4gIH1cblxuICBpZiAoc3RyZWFtICYmICFzdHJlYW0uaXNUVFkgJiYgZm9yY2VDb2xvciAhPT0gdHJ1ZSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgdmFyIG1pbiA9IGZvcmNlQ29sb3IgPyAxIDogMDtcblxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgIC8vIE5vZGUuanMgNy41LjAgaXMgdGhlIGZpcnN0IHZlcnNpb24gb2YgTm9kZS5qcyB0byBpbmNsdWRlIGEgcGF0Y2ggdG9cbiAgICAvLyBsaWJ1diB0aGF0IGVuYWJsZXMgMjU2IGNvbG9yIG91dHB1dCBvbiBXaW5kb3dzLiBBbnl0aGluZyBlYXJsaWVyIGFuZCBpdFxuICAgIC8vIHdvbid0IHdvcmsuIEhvd2V2ZXIsIGhlcmUgd2UgdGFyZ2V0IE5vZGUuanMgOCBhdCBtaW5pbXVtIGFzIGl0IGlzIGFuIExUU1xuICAgIC8vIHJlbGVhc2UsIGFuZCBOb2RlLmpzIDcgaXMgbm90LiBXaW5kb3dzIDEwIGJ1aWxkIDEwNTg2IGlzIHRoZSBmaXJzdFxuICAgIC8vIFdpbmRvd3MgcmVsZWFzZSB0aGF0IHN1cHBvcnRzIDI1NiBjb2xvcnMuIFdpbmRvd3MgMTAgYnVpbGQgMTQ5MzEgaXMgdGhlXG4gICAgLy8gZmlyc3QgcmVsZWFzZSB0aGF0IHN1cHBvcnRzIDE2bS9UcnVlQ29sb3IuXG4gICAgdmFyIG9zUmVsZWFzZSA9IG9zLnJlbGVhc2UoKS5zcGxpdCgnLicpO1xuICAgIGlmIChOdW1iZXIocHJvY2Vzcy52ZXJzaW9ucy5ub2RlLnNwbGl0KCcuJylbMF0pID49IDhcbiAgICAgICAgJiYgTnVtYmVyKG9zUmVsZWFzZVswXSkgPj0gMTAgJiYgTnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTA1ODYpIHtcbiAgICAgIHJldHVybiBOdW1iZXIob3NSZWxlYXNlWzJdKSA+PSAxNDkzMSA/IDMgOiAyO1xuICAgIH1cblxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKCdDSScgaW4gZW52KSB7XG4gICAgaWYgKFsnVFJBVklTJywgJ0NJUkNMRUNJJywgJ0FQUFZFWU9SJywgJ0dJVExBQl9DSSddLnNvbWUoZnVuY3Rpb24oc2lnbikge1xuICAgICAgcmV0dXJuIHNpZ24gaW4gZW52O1xuICAgIH0pIHx8IGVudi5DSV9OQU1FID09PSAnY29kZXNoaXAnKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWluO1xuICB9XG5cbiAgaWYgKCdURUFNQ0lUWV9WRVJTSU9OJyBpbiBlbnYpIHtcbiAgICByZXR1cm4gKC9eKDlcXC4oMCpbMS05XVxcZCopXFwufFxcZHsyLH1cXC4pLy50ZXN0KGVudi5URUFNQ0lUWV9WRVJTSU9OKSA/IDEgOiAwXG4gICAgKTtcbiAgfVxuXG4gIGlmICgnVEVSTV9QUk9HUkFNJyBpbiBlbnYpIHtcbiAgICB2YXIgdmVyc2lvbiA9IHBhcnNlSW50KChlbnYuVEVSTV9QUk9HUkFNX1ZFUlNJT04gfHwgJycpLnNwbGl0KCcuJylbMF0sIDEwKTtcblxuICAgIHN3aXRjaCAoZW52LlRFUk1fUFJPR1JBTSkge1xuICAgICAgY2FzZSAnaVRlcm0uYXBwJzpcbiAgICAgICAgcmV0dXJuIHZlcnNpb24gPj0gMyA/IDMgOiAyO1xuICAgICAgY2FzZSAnSHlwZXInOlxuICAgICAgICByZXR1cm4gMztcbiAgICAgIGNhc2UgJ0FwcGxlX1Rlcm1pbmFsJzpcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgICAvLyBObyBkZWZhdWx0XG4gICAgfVxuICB9XG5cbiAgaWYgKC8tMjU2KGNvbG9yKT8kL2kudGVzdChlbnYuVEVSTSkpIHtcbiAgICByZXR1cm4gMjtcbiAgfVxuXG4gIGlmICgvXnNjcmVlbnxeeHRlcm18XnZ0MTAwfF5yeHZ0fGNvbG9yfGFuc2l8Y3lnd2lufGxpbnV4L2kudGVzdChlbnYuVEVSTSkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmICgnQ09MT1JURVJNJyBpbiBlbnYpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmIChlbnYuVEVSTSA9PT0gJ2R1bWInKSB7XG4gICAgcmV0dXJuIG1pbjtcbiAgfVxuXG4gIHJldHVybiBtaW47XG59XG5cbmZ1bmN0aW9uIGdldFN1cHBvcnRMZXZlbChzdHJlYW0pIHtcbiAgdmFyIGxldmVsID0gc3VwcG9ydHNDb2xvcihzdHJlYW0pO1xuICByZXR1cm4gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3VwcG9ydHNDb2xvcjogZ2V0U3VwcG9ydExldmVsLFxuICBzdGRvdXQ6IGdldFN1cHBvcnRMZXZlbChwcm9jZXNzLnN0ZG91dCksXG4gIHN0ZGVycjogZ2V0U3VwcG9ydExldmVsKHByb2Nlc3Muc3RkZXJyKSxcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCIvKlxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSBTaW5kcmUgU29yaHVzIDxzaW5kcmVzb3JodXNAZ21haWwuY29tPiAoc2luZHJlc29yaHVzLmNvbSlcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZlxudGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpblxudGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0b1xudXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXNcbm9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkb1xuc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZsYWcsIGFyZ3YpIHtcbiAgYXJndiA9IGFyZ3YgfHwgcHJvY2Vzcy5hcmd2O1xuXG4gIHZhciB0ZXJtaW5hdG9yUG9zID0gYXJndi5pbmRleE9mKCctLScpO1xuICB2YXIgcHJlZml4ID0gL14tezEsMn0vLnRlc3QoZmxhZykgPyAnJyA6ICctLSc7XG4gIHZhciBwb3MgPSBhcmd2LmluZGV4T2YocHJlZml4ICsgZmxhZyk7XG5cbiAgcmV0dXJuIHBvcyAhPT0gLTEgJiYgKHRlcm1pbmF0b3JQb3MgPT09IC0xID8gdHJ1ZSA6IHBvcyA8IHRlcm1pbmF0b3JQb3MpO1xufTtcbiIsIm1vZHVsZVsnZXhwb3J0cyddID0gZnVuY3Rpb24gcnVuVGhlVHJhcCh0ZXh0LCBvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgdGV4dCA9IHRleHQgfHwgJ1J1biB0aGUgdHJhcCwgZHJvcCB0aGUgYmFzcyc7XG4gIHRleHQgPSB0ZXh0LnNwbGl0KCcnKTtcbiAgdmFyIHRyYXAgPSB7XG4gICAgYTogWydcXHUwMDQwJywgJ1xcdTAxMDQnLCAnXFx1MDIzYScsICdcXHUwMjQ1JywgJ1xcdTAzOTQnLCAnXFx1MDM5YicsICdcXHUwNDE0J10sXG4gICAgYjogWydcXHUwMGRmJywgJ1xcdTAxODEnLCAnXFx1MDI0MycsICdcXHUwMjZlJywgJ1xcdTAzYjInLCAnXFx1MGUzZiddLFxuICAgIGM6IFsnXFx1MDBhOScsICdcXHUwMjNiJywgJ1xcdTAzZmUnXSxcbiAgICBkOiBbJ1xcdTAwZDAnLCAnXFx1MDE4YScsICdcXHUwNTAwJywgJ1xcdTA1MDEnLCAnXFx1MDUwMicsICdcXHUwNTAzJ10sXG4gICAgZTogWydcXHUwMGNiJywgJ1xcdTAxMTUnLCAnXFx1MDE4ZScsICdcXHUwMjU4JywgJ1xcdTAzYTMnLCAnXFx1MDNiZScsICdcXHUwNGJjJyxcbiAgICAgICdcXHUwYTZjJ10sXG4gICAgZjogWydcXHUwNGZhJ10sXG4gICAgZzogWydcXHUwMjYyJ10sXG4gICAgaDogWydcXHUwMTI2JywgJ1xcdTAxOTUnLCAnXFx1MDRhMicsICdcXHUwNGJhJywgJ1xcdTA0YzcnLCAnXFx1MDUwYSddLFxuICAgIGk6IFsnXFx1MGYwZiddLFxuICAgIGo6IFsnXFx1MDEzNCddLFxuICAgIGs6IFsnXFx1MDEzOCcsICdcXHUwNGEwJywgJ1xcdTA0YzMnLCAnXFx1MDUxZSddLFxuICAgIGw6IFsnXFx1MDEzOSddLFxuICAgIG06IFsnXFx1MDI4ZCcsICdcXHUwNGNkJywgJ1xcdTA0Y2UnLCAnXFx1MDUyMCcsICdcXHUwNTIxJywgJ1xcdTBkNjknXSxcbiAgICBuOiBbJ1xcdTAwZDEnLCAnXFx1MDE0YicsICdcXHUwMTlkJywgJ1xcdTAzNzYnLCAnXFx1MDNhMCcsICdcXHUwNDhhJ10sXG4gICAgbzogWydcXHUwMGQ4JywgJ1xcdTAwZjUnLCAnXFx1MDBmOCcsICdcXHUwMWZlJywgJ1xcdTAyOTgnLCAnXFx1MDQ3YScsICdcXHUwNWRkJyxcbiAgICAgICdcXHUwNmRkJywgJ1xcdTBlNGYnXSxcbiAgICBwOiBbJ1xcdTAxZjcnLCAnXFx1MDQ4ZSddLFxuICAgIHE6IFsnXFx1MDljZCddLFxuICAgIHI6IFsnXFx1MDBhZScsICdcXHUwMWE2JywgJ1xcdTAyMTAnLCAnXFx1MDI0YycsICdcXHUwMjgwJywgJ1xcdTA0MmYnXSxcbiAgICBzOiBbJ1xcdTAwYTcnLCAnXFx1MDNkZScsICdcXHUwM2RmJywgJ1xcdTAzZTgnXSxcbiAgICB0OiBbJ1xcdTAxNDEnLCAnXFx1MDE2NicsICdcXHUwMzczJ10sXG4gICAgdTogWydcXHUwMWIxJywgJ1xcdTA1NGQnXSxcbiAgICB2OiBbJ1xcdTA1ZDgnXSxcbiAgICB3OiBbJ1xcdTA0MjgnLCAnXFx1MDQ2MCcsICdcXHUwNDdjJywgJ1xcdTBkNzAnXSxcbiAgICB4OiBbJ1xcdTA0YjInLCAnXFx1MDRmZScsICdcXHUwNGZjJywgJ1xcdTA0ZmQnXSxcbiAgICB5OiBbJ1xcdTAwYTUnLCAnXFx1MDRiMCcsICdcXHUwNGNiJ10sXG4gICAgejogWydcXHUwMWI1JywgJ1xcdTAyNDAnXSxcbiAgfTtcbiAgdGV4dC5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICBjID0gYy50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciBjaGFycyA9IHRyYXBbY10gfHwgWycgJ107XG4gICAgdmFyIHJhbmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFycy5sZW5ndGgpO1xuICAgIGlmICh0eXBlb2YgdHJhcFtjXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJlc3VsdCArPSB0cmFwW2NdW3JhbmRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgKz0gYztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIHBsZWFzZSBub1xubW9kdWxlWydleHBvcnRzJ10gPSBmdW5jdGlvbiB6YWxnbyh0ZXh0LCBvcHRpb25zKSB7XG4gIHRleHQgPSB0ZXh0IHx8ICcgICBoZSBpcyBoZXJlICAgJztcbiAgdmFyIHNvdWwgPSB7XG4gICAgJ3VwJzogW1xuICAgICAgJ8yNJywgJ8yOJywgJ8yEJywgJ8yFJyxcbiAgICAgICfMvycsICfMkScsICfMhicsICfMkCcsXG4gICAgICAnzZInLCAnzZcnLCAnzZEnLCAnzIcnLFxuICAgICAgJ8yIJywgJ8yKJywgJ82CJywgJ8yTJyxcbiAgICAgICfMiCcsICfNiicsICfNiycsICfNjCcsXG4gICAgICAnzIMnLCAnzIInLCAnzIwnLCAnzZAnLFxuICAgICAgJ8yAJywgJ8yBJywgJ8yLJywgJ8yPJyxcbiAgICAgICfMkicsICfMkycsICfMlCcsICfMvScsXG4gICAgICAnzIknLCAnzaMnLCAnzaQnLCAnzaUnLFxuICAgICAgJ82mJywgJ82nJywgJ82oJywgJ82pJyxcbiAgICAgICfNqicsICfNqycsICfNrCcsICfNrScsXG4gICAgICAnza4nLCAnza8nLCAnzL4nLCAnzZsnLFxuICAgICAgJ82GJywgJ8yaJyxcbiAgICBdLFxuICAgICdkb3duJzogW1xuICAgICAgJ8yWJywgJ8yXJywgJ8yYJywgJ8yZJyxcbiAgICAgICfMnCcsICfMnScsICfMnicsICfMnycsXG4gICAgICAnzKAnLCAnzKQnLCAnzKUnLCAnzKYnLFxuICAgICAgJ8ypJywgJ8yqJywgJ8yrJywgJ8ysJyxcbiAgICAgICfMrScsICfMricsICfMrycsICfMsCcsXG4gICAgICAnzLEnLCAnzLInLCAnzLMnLCAnzLknLFxuICAgICAgJ8y6JywgJ8y7JywgJ8y8JywgJ82FJyxcbiAgICAgICfNhycsICfNiCcsICfNiScsICfNjScsXG4gICAgICAnzY4nLCAnzZMnLCAnzZQnLCAnzZUnLFxuICAgICAgJ82WJywgJ82ZJywgJ82aJywgJ8yjJyxcbiAgICBdLFxuICAgICdtaWQnOiBbXG4gICAgICAnzJUnLCAnzJsnLCAnzIAnLCAnzIEnLFxuICAgICAgJ82YJywgJ8yhJywgJ8yiJywgJ8ynJyxcbiAgICAgICfMqCcsICfMtCcsICfMtScsICfMticsXG4gICAgICAnzZwnLCAnzZ0nLCAnzZ4nLFxuICAgICAgJ82fJywgJ82gJywgJ82iJywgJ8y4JyxcbiAgICAgICfMtycsICfNoScsICcg0oknLFxuICAgIF0sXG4gIH07XG4gIHZhciBhbGwgPSBbXS5jb25jYXQoc291bC51cCwgc291bC5kb3duLCBzb3VsLm1pZCk7XG5cbiAgZnVuY3Rpb24gcmFuZG9tTnVtYmVyKHJhbmdlKSB7XG4gICAgdmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSk7XG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICBmdW5jdGlvbiBpc0NoYXIoY2hhcmFjdGVyKSB7XG4gICAgdmFyIGJvb2wgPSBmYWxzZTtcbiAgICBhbGwuZmlsdGVyKGZ1bmN0aW9uKGkpIHtcbiAgICAgIGJvb2wgPSAoaSA9PT0gY2hhcmFjdGVyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYm9vbDtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gaGVDb21lcyh0ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBjb3VudHM7XG4gICAgdmFyIGw7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgb3B0aW9uc1sndXAnXSA9XG4gICAgICB0eXBlb2Ygb3B0aW9uc1sndXAnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWyd1cCddIDogdHJ1ZTtcbiAgICBvcHRpb25zWydtaWQnXSA9XG4gICAgICB0eXBlb2Ygb3B0aW9uc1snbWlkJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snbWlkJ10gOiB0cnVlO1xuICAgIG9wdGlvbnNbJ2Rvd24nXSA9XG4gICAgICB0eXBlb2Ygb3B0aW9uc1snZG93biddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ2Rvd24nXSA6IHRydWU7XG4gICAgb3B0aW9uc1snc2l6ZSddID1cbiAgICAgIHR5cGVvZiBvcHRpb25zWydzaXplJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2l6ZSddIDogJ21heGknO1xuICAgIHRleHQgPSB0ZXh0LnNwbGl0KCcnKTtcbiAgICBmb3IgKGwgaW4gdGV4dCkge1xuICAgICAgaWYgKGlzQ2hhcihsKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IHJlc3VsdCArIHRleHRbbF07XG4gICAgICBjb3VudHMgPSB7J3VwJzogMCwgJ2Rvd24nOiAwLCAnbWlkJzogMH07XG4gICAgICBzd2l0Y2ggKG9wdGlvbnMuc2l6ZSkge1xuICAgICAgICBjYXNlICdtaW5pJzpcbiAgICAgICAgICBjb3VudHMudXAgPSByYW5kb21OdW1iZXIoOCk7XG4gICAgICAgICAgY291bnRzLm1pZCA9IHJhbmRvbU51bWJlcigyKTtcbiAgICAgICAgICBjb3VudHMuZG93biA9IHJhbmRvbU51bWJlcig4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbWF4aSc6XG4gICAgICAgICAgY291bnRzLnVwID0gcmFuZG9tTnVtYmVyKDE2KSArIDM7XG4gICAgICAgICAgY291bnRzLm1pZCA9IHJhbmRvbU51bWJlcig0KSArIDE7XG4gICAgICAgICAgY291bnRzLmRvd24gPSByYW5kb21OdW1iZXIoNjQpICsgMztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb3VudHMudXAgPSByYW5kb21OdW1iZXIoOCkgKyAxO1xuICAgICAgICAgIGNvdW50cy5taWQgPSByYW5kb21OdW1iZXIoNikgLyAyO1xuICAgICAgICAgIGNvdW50cy5kb3duID0gcmFuZG9tTnVtYmVyKDgpICsgMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIGFyciA9IFsndXAnLCAnbWlkJywgJ2Rvd24nXTtcbiAgICAgIGZvciAodmFyIGQgaW4gYXJyKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGFycltkXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gY291bnRzW2luZGV4XTsgaSsrKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnNbaW5kZXhdKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBzb3VsW2luZGV4XVtyYW5kb21OdW1iZXIoc291bFtpbmRleF0ubGVuZ3RoKV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gZG9uJ3Qgc3VtbW9uIGhpbVxuICByZXR1cm4gaGVDb21lcyh0ZXh0LCBvcHRpb25zKTtcbn07XG5cbiIsIm1vZHVsZVsnZXhwb3J0cyddID0gZnVuY3Rpb24oY29sb3JzKSB7XG4gIHJldHVybiBmdW5jdGlvbihsZXR0ZXIsIGksIGV4cGxvZGVkKSB7XG4gICAgaWYgKGxldHRlciA9PT0gJyAnKSByZXR1cm4gbGV0dGVyO1xuICAgIHN3aXRjaCAoaSUzKSB7XG4gICAgICBjYXNlIDA6IHJldHVybiBjb2xvcnMucmVkKGxldHRlcik7XG4gICAgICBjYXNlIDE6IHJldHVybiBjb2xvcnMud2hpdGUobGV0dGVyKTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGNvbG9ycy5ibHVlKGxldHRlcik7XG4gICAgfVxuICB9O1xufTtcbiIsIm1vZHVsZVsnZXhwb3J0cyddID0gZnVuY3Rpb24oY29sb3JzKSB7XG4gIHJldHVybiBmdW5jdGlvbihsZXR0ZXIsIGksIGV4cGxvZGVkKSB7XG4gICAgcmV0dXJuIGkgJSAyID09PSAwID8gbGV0dGVyIDogY29sb3JzLmludmVyc2UobGV0dGVyKTtcbiAgfTtcbn07XG4iLCJtb2R1bGVbJ2V4cG9ydHMnXSA9IGZ1bmN0aW9uKGNvbG9ycykge1xuICAvLyBSb1kgRyBCaVZcbiAgdmFyIHJhaW5ib3dDb2xvcnMgPSBbJ3JlZCcsICd5ZWxsb3cnLCAnZ3JlZW4nLCAnYmx1ZScsICdtYWdlbnRhJ107XG4gIHJldHVybiBmdW5jdGlvbihsZXR0ZXIsIGksIGV4cGxvZGVkKSB7XG4gICAgaWYgKGxldHRlciA9PT0gJyAnKSB7XG4gICAgICByZXR1cm4gbGV0dGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29sb3JzW3JhaW5ib3dDb2xvcnNbaSsrICUgcmFpbmJvd0NvbG9ycy5sZW5ndGhdXShsZXR0ZXIpO1xuICAgIH1cbiAgfTtcbn07XG5cbiIsIm1vZHVsZVsnZXhwb3J0cyddID0gZnVuY3Rpb24oY29sb3JzKSB7XG4gIHZhciBhdmFpbGFibGUgPSBbJ3VuZGVybGluZScsICdpbnZlcnNlJywgJ2dyZXknLCAneWVsbG93JywgJ3JlZCcsICdncmVlbicsXG4gICAgJ2JsdWUnLCAnd2hpdGUnLCAnY3lhbicsICdtYWdlbnRhJywgJ2JyaWdodFllbGxvdycsICdicmlnaHRSZWQnLFxuICAgICdicmlnaHRHcmVlbicsICdicmlnaHRCbHVlJywgJ2JyaWdodFdoaXRlJywgJ2JyaWdodEN5YW4nLCAnYnJpZ2h0TWFnZW50YSddO1xuICByZXR1cm4gZnVuY3Rpb24obGV0dGVyLCBpLCBleHBsb2RlZCkge1xuICAgIHJldHVybiBsZXR0ZXIgPT09ICcgJyA/IGxldHRlciA6XG4gICAgICBjb2xvcnNbXG4gICAgICAgICAgYXZhaWxhYmxlW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIChhdmFpbGFibGUubGVuZ3RoIC0gMikpXVxuICAgICAgXShsZXR0ZXIpO1xuICB9O1xufTtcbiIsImltcG9ydCB7IFNlcnZlciwgT1BFTiB9IGZyb20gXCJ3c1wiO1xuaW1wb3J0IHsgemlwIH0gZnJvbSBcImxvZGFzaFwiO1xuXG5pbXBvcnQge1xuICBGQVNUX1JFTE9BRF9ERUJPVU5DSU5HX0ZSQU1FLFxuICBGQVNUX1JFTE9BRF9DQUxMUyxcbiAgRkFTVF9SRUxPQURfV0FJVCxcbiAgTkVXX0ZBU1RfUkVMT0FEX0NIUk9NRV9WRVJTSU9OLFxuICBORVdfRkFTVF9SRUxPQURfREVCT1VOQ0lOR19GUkFNRSxcbiAgTkVXX0ZBU1RfUkVMT0FEX0NBTExTXG59IGZyb20gXCIuLi9jb25zdGFudHMvZmFzdC1yZWxvYWRpbmcuY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBzaWduQ2hhbmdlIH0gZnJvbSBcIi4uL3V0aWxzL3NpZ25hbHNcIjtcbmltcG9ydCB7IGRlYm91bmNlU2lnbmFsLCBmYXN0UmVsb2FkQmxvY2tlciB9IGZyb20gXCIuLi91dGlscy9ibG9jay1wcm90ZWN0aW9uXCI7XG5pbXBvcnQgeyB3YXJuIH0gZnJvbSBcIi4uL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IHsgYnJvd3NlclZlcldyb25nRm9ybWF0TXNnIH0gZnJvbSBcIi4uL21lc3NhZ2VzL3dhcm5pbmdzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25FbWl0dGVyIHtcbiAgcHJpdmF0ZSBfc2FmZVNpZ25DaGFuZ2U6IEZ1bmN0aW9uO1xuICBwcml2YXRlIF9zZXJ2ZXI6IFNlcnZlcjtcblxuICBjb25zdHJ1Y3RvcihzZXJ2ZXI6IFNlcnZlciwgYnJvd3NlclZlcnNpb246IHN0cmluZyA9IFwiMC4wLjAuMFwiKSB7XG4gICAgdGhpcy5fc2VydmVyID0gc2VydmVyO1xuICAgIGNvbnN0IFtyZWxvYWRDYWxscywgcmVsb2FkRGVib3VjaW5nRnJhbWVdID0gdGhpcy5fc2F0aXNmaWVzKFxuICAgICAgYnJvd3NlclZlcnNpb24sXG4gICAgICBORVdfRkFTVF9SRUxPQURfQ0hST01FX1ZFUlNJT05cbiAgICApXG4gICAgICA/IFtORVdfRkFTVF9SRUxPQURfQ0FMTFMsIE5FV19GQVNUX1JFTE9BRF9ERUJPVU5DSU5HX0ZSQU1FXVxuICAgICAgOiBbRkFTVF9SRUxPQURfQ0FMTFMsIEZBU1RfUkVMT0FEX0RFQk9VTkNJTkdfRlJBTUVdO1xuXG4gICAgY29uc3QgZGVib3VuY2VyID0gZGVib3VuY2VTaWduYWwocmVsb2FkRGVib3VjaW5nRnJhbWUsIHRoaXMpO1xuICAgIGNvbnN0IGJsb2NrZXIgPSBmYXN0UmVsb2FkQmxvY2tlcihyZWxvYWRDYWxscywgRkFTVF9SRUxPQURfV0FJVCwgdGhpcyk7XG4gICAgdGhpcy5fc2FmZVNpZ25DaGFuZ2UgPSBkZWJvdW5jZXIoYmxvY2tlcih0aGlzLl9zZXR1cFNhZmVTaWduQ2hhbmdlKCkpKTtcbiAgfVxuXG4gIHNhZmVTaWduQ2hhbmdlKHJlbG9hZFBhZ2U6IGJvb2xlYW4pOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHRoaXMuX3NhZmVTaWduQ2hhbmdlKHJlbG9hZFBhZ2UsIHJlcywgcmVqKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldHVwU2FmZVNpZ25DaGFuZ2UoKSB7XG4gICAgcmV0dXJuIChyZWxvYWRQYWdlOiBib29sZWFuLCBvblN1Y2Nlc3M6IEZ1bmN0aW9uLCBvbkVycm9yOiBGdW5jdGlvbikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5fc2VuZE1zZyhzaWduQ2hhbmdlKHsgcmVsb2FkUGFnZSB9KSk7XG4gICAgICAgIG9uU3VjY2VzcygpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIG9uRXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfc2VuZE1zZyhtc2c6IGFueSkge1xuICAgIHRoaXMuX3NlcnZlci5jbGllbnRzLmZvckVhY2goY2xpZW50ID0+IHtcbiAgICAgIGlmIChjbGllbnQucmVhZHlTdGF0ZSA9PT0gT1BFTikge1xuICAgICAgICBjbGllbnQuc2VuZChKU09OLnN0cmluZ2lmeShtc2cpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3NhdGlzZmllcyhicm93c2VyVmVyc2lvbjogc3RyaW5nLCB0YXJnZXRWZXJzaW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoIS9cXGQrXFwuXFxkK1xcLlxcZCtcXC5cXGQrLy50ZXN0KGJyb3dzZXJWZXJzaW9uKSkge1xuICAgICAgd2Fybihicm93c2VyVmVyV3JvbmdGb3JtYXRNc2cuZ2V0KHsgdmVyc2lvbjogYnJvd3NlclZlcnNpb24gfSkpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHZlcnNpb25QYWlyczogQXJyYXk8VmVyc2lvblBhaXI+ID0gemlwKFxuICAgICAgYnJvd3NlclZlcnNpb24uc3BsaXQoXCIuXCIpLm1hcChuID0+IHBhcnNlSW50KG4pKSxcbiAgICAgIHRhcmdldFZlcnNpb24uc3BsaXQoXCIuXCIpLm1hcChuID0+IHBhcnNlSW50KG4pKVxuICAgICk7XG5cbiAgICBmb3IgKGxldCBbdmVyc2lvbiA9IDAsIHRhcmdldCA9IDBdIG9mIHZlcnNpb25QYWlycykge1xuICAgICAgaWYgKHZlcnNpb24gIT09IHRhcmdldCkgcmV0dXJuIHZlcnNpb24gPiB0YXJnZXQ7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iLCIvKipcbiAqIENocm9tZSBsZXRzIG9ubHkgYSBtYXggbnVtYmVyIG9mIGNhbGxzIGluIGEgdGltZSBmcmFtZVxuICogYmVmb3JlIGJsb2NrIHRoZSBwbHVnaW4gZm9yIGJlIHJlbG9hZGluZyBpdHNlbGYgdG8gbXVjaFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcnViZW5zcGdjYXZhbGNhbnRlL3dlYnBhY2stY2hyb21lLWV4dGVuc2lvbi1yZWxvYWRlci9pc3N1ZXMvMlxuICovXG5leHBvcnQgY29uc3QgRkFTVF9SRUxPQURfREVCT1VOQ0lOR19GUkFNRSA9IDIwMDA7XG5cbmV4cG9ydCBjb25zdCBGQVNUX1JFTE9BRF9DQUxMUyA9IDY7XG5leHBvcnQgY29uc3QgRkFTVF9SRUxPQURfV0FJVCA9IDEwICogMTAwMDtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbi8qKlxuICogQSBuZXcgcmVsb2FkaW5nIHJhdGUgd2FzIGNyZWF0ZWFkIGFmdGVyIG9wZW5pbmcgYSBidWcgdGlja2V0IG9uXG4gKiBDaHJvbWl1bSwgYW5kIHRoZSByZXZpc2lvbiB3YXMgbWVyZ2VkIHRvIG1hc3RlclxuICogQHNlZSBodHRwczovL2Nocm9taXVtLXJldmlldy5nb29nbGVzb3VyY2UuY29tL2MvY2hyb21pdW0vc3JjLysvMTM0MDI3MlxuICovXG5cbi8qKlxuICogVGhlIENocm9tZS9DaHJvbWl1bSB2ZXJzaW9uIG51bWJlciB0aGF0IGluY2x1ZGVzIHRoZSBuZXcgcmF0ZXNcbiAqIEBzZWUgaHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2Nocm9taXVtLWZpbmQtcmVsZWFzZXMtc3RhdGljL2QzYi5odG1sI2QzYjI1ZTEzODA5ODRiMmYxZjIzZDBlOGRjMWEzMzc3NDNjNmNhYWZcbiAqL1xuZXhwb3J0IGNvbnN0IE5FV19GQVNUX1JFTE9BRF9DSFJPTUVfVkVSU0lPTiA9IFwiNzMuMC4zNjM3LjBcIjtcblxuZXhwb3J0IGNvbnN0IE5FV19GQVNUX1JFTE9BRF9ERUJPVU5DSU5HX0ZSQU1FID0gMTAwMDtcbmV4cG9ydCBjb25zdCBORVdfRkFTVF9SRUxPQURfQ0FMTFMgPSAzMDtcbiIsImltcG9ydCB7IGRlYm91bmNlLCBydW5JbkNvbnRleHQgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyB3YXJuLCBpbmZvIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XG5cbmV4cG9ydCBjb25zdCBkZWJvdW5jZVNpZ25hbCA9IChkZWJvdWNpbmdGcmFtZTogbnVtYmVyLCBjb250ZXh0PzogT2JqZWN0KSA9PiAoXG4gIGZ1bmM6IEZ1bmN0aW9uXG4pID0+IHtcbiAgaWYgKGNvbnRleHQpIHtcbiAgICBydW5JbkNvbnRleHQoY29udGV4dCk7XG4gIH1cblxuICByZXR1cm4gZGVib3VuY2UoKC4uLmFyZ3MpID0+IHtcbiAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfSwgZGVib3VjaW5nRnJhbWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGZhc3RSZWxvYWRCbG9ja2VyID0gKG1heENhbGxzOiBudW1iZXIsIHdhaXQ6IG51bWJlciwgY29udGV4dCkgPT4gKFxuICBmdW5jOiBGdW5jdGlvblxuKSA9PiB7XG4gIGxldCBjYWxscyA9IDA7XG4gIGxldCBpbldhaXQgPSBmYWxzZTtcblxuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICBpZiAoaW5XYWl0KSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChjYWxscyA9PT0gbWF4Q2FsbHMpIHtcbiAgICAgIGNhbGxzID0gMDtcbiAgICAgIGluV2FpdCA9IHRydWU7XG5cbiAgICAgIGxldCBpbnRlcnZhbCA9IHdhaXQgLyAxMDAwO1xuICAgICAgd2FybihcbiAgICAgICAgYFBsZWFzZSB3YWl0ICR7XG4gICAgICAgICAgaW50ZXJ2YWxcbiAgICAgICAgfSBzZWNzLiBmb3IgbmV4dCByZWxvYWQgdG8gcHJldmVudCB5b3VyIGV4dGVuc2lvbiBiZWluZyBibG9ja2VkYFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGxvZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4gd2FybihgJHstLWludGVydmFsfSAuLi5gKSwgMTAwMCk7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjbGVhckludGVydmFsKGxvZ0ludGVydmFsKTtcbiAgICAgICAgaW5mbyhcIlNpZ25pbmcgZm9yIHJlbG9hZCBub3dcIik7XG4gICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGluV2FpdCA9IGZhbHNlO1xuICAgICAgfSwgd2FpdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxzKys7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9XG4gIH07XG59O1xuIiwiZXhwb3J0IGNvbnN0IFJFRl9VUkwgPVxuICBcImh0dHBzOi8vZ2l0aHViLmNvbS9ydWJlbnNwZ2NhdmFsY2FudGUvd2VicGFjay1jaHJvbWUtZXh0ZW5zaW9uLXJlbG9hZGVyL3dpa2kvR2VuZXJhbC1JbmZvcm1hdGlvblwiO1xuIiwiaW1wb3J0IHtcbiAgREVGQVVMVF9CQUNLR1JPVU5EX0VOVFJZLFxuICBERUZBVUxUX0NPTlRFTlRfU0NSSVBUX0VOVFJZLFxuICBERUZBVUxUX1BPUlQsXG4gIERFRkFVTFRfUkVMT0FEX1BBR0Vcbn0gZnJvbSBcIi4uL2NvbnN0YW50cy9vcHRpb25zLmNvbnN0YW50c1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHJlbG9hZFBhZ2U6IERFRkFVTFRfUkVMT0FEX1BBR0UsXG4gIHBvcnQ6IERFRkFVTFRfUE9SVCxcbiAgZW50cmllczoge1xuICAgIGNvbnRlbnRTY3JpcHQ6IERFRkFVTFRfQ09OVEVOVF9TQ1JJUFRfRU5UUlksXG4gICAgYmFja2dyb3VuZDogREVGQVVMVF9CQUNLR1JPVU5EX0VOVFJZXG4gIH1cbn07XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb21waWxlckV2ZW50c0ZhY2FkZSB7XG4gIHN0YXRpYyBleHRlbnNpb25OYW1lID0gXCJjaHJvbWUtZXh0ZW5zaW9uLXJlbG9hZGVyXCI7XG4gIHByaXZhdGUgX2NvbXBpbGVyOiBhbnk7XG4gIHByaXZhdGUgX2xlZ2FjeVRhcGFibGU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoY29tcGlsZXIpIHtcbiAgICB0aGlzLl9jb21waWxlciA9IGNvbXBpbGVyO1xuICAgIHRoaXMuX2xlZ2FjeVRhcGFibGUgPSAhY29tcGlsZXIuaG9va3M7XG4gIH1cblxuICBhZnRlck9wdGltaXplQ2h1bmtBc3NldHMoY2FsbDogRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy5fbGVnYWN5VGFwYWJsZVxuICAgICAgPyB0aGlzLl9jb21waWxlci5wbHVnaW4oXCJjb21waWxhdGlvblwiLCBjb21wID0+XG4gICAgICAgICAgY29tcC5wbHVnaW4oXCJhZnRlci1vcHRpbWl6ZS1jaHVuay1hc3NldHNcIiwgY2h1bmtzID0+XG4gICAgICAgICAgICBjYWxsKGNvbXAsIGNodW5rcylcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIDogdGhpcy5fY29tcGlsZXIuaG9va3MuY29tcGlsYXRpb24udGFwKFxuICAgICAgICAgIENvbXBpbGVyRXZlbnRzRmFjYWRlLmV4dGVuc2lvbk5hbWUsXG4gICAgICAgICAgY29tcCA9PlxuICAgICAgICAgICAgY29tcC5ob29rcy5hZnRlck9wdGltaXplQ2h1bmtBc3NldHMudGFwKFxuICAgICAgICAgICAgICBDb21waWxlckV2ZW50c0ZhY2FkZS5leHRlbnNpb25OYW1lLFxuICAgICAgICAgICAgICBjaHVua3MgPT4gY2FsbChjb21wLCBjaHVua3MpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gIH1cblxuICBhZnRlckVtaXQoY2FsbDogRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy5fbGVnYWN5VGFwYWJsZVxuICAgICAgPyB0aGlzLl9jb21waWxlci5wbHVnaW4oXCJhZnRlci1lbWl0XCIsIGNhbGwpXG4gICAgICA6IHRoaXMuX2NvbXBpbGVyLmhvb2tzLmFmdGVyRW1pdC50YXAoXG4gICAgICAgICAgQ29tcGlsZXJFdmVudHNGYWNhZGUuZXh0ZW5zaW9uTmFtZSxcbiAgICAgICAgICBjYWxsXG4gICAgICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCBNZXNzYWdlIGZyb20gXCIuL01lc3NhZ2VcIjtcbmltcG9ydCB7IEVSUk9SIH0gZnJvbSBcIi4uL2NvbnN0YW50cy9sb2cuY29uc3RhbnRzXCI7XG5cbmV4cG9ydCBjb25zdCBiZ1NjcmlwdFJlcXVpcmVkTXNnID0gbmV3IE1lc3NhZ2UoXG4gIEVSUk9SLFxuICAxLFxuICBcIkJhY2tncm91bmQgc2NyaXB0IGVudHJ5IGlzIHJlcXVpcmVkXCJcbik7XG4iLCJpbXBvcnQgeyBpbnN0YWxsIH0gZnJvbSBcInNvdXJjZS1tYXAtc3VwcG9ydFwiO1xuaW1wb3J0IENocm9tZUV4dGVuc2lvblJlbG9hZGVySW1wbCBmcm9tIFwiLi9DaHJvbWVFeHRlbnNpb25SZWxvYWRlclwiO1xuaW1wb3J0IHsgREVCVUcsIEVSUk9SLCBOT05FIH0gZnJvbSBcIi4vY29uc3RhbnRzL2xvZy5jb25zdGFudHNcIjtcbmltcG9ydCB7IHNldExvZ0xldmVsIH0gZnJvbSBcIi4vdXRpbHMvbG9nZ2VyXCI7XG5cbmluc3RhbGwoKTtcblxuY29uc3QgbG9nTGV2ZWwgPSBwcm9jZXNzLmVudi5OT0RFX0VOVlxuICA/IHtcbiAgICAgIHByb2R1Y3Rpb246IEVSUk9SLFxuICAgICAgZGV2ZWxvcG1lbnQ6IERFQlVHLFxuICAgICAgdGVzdDogTk9ORVxuICAgIH1bcHJvY2Vzcy5lbnYuTk9ERV9FTlZdXG4gIDogRVJST1I7XG5cbnNldExvZ0xldmVsKGxvZ0xldmVsKTtcbmV4cG9ydCA9IENocm9tZUV4dGVuc2lvblJlbG9hZGVySW1wbDtcbiJdLCJzb3VyY2VSb290IjoiIn0=