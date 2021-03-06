'use strict'
/* global CryptoJS:false */
/* global vkbeautify:false */
/* global moment:false */
/* exported isBase64String */
/* exported decodeBase64 */
/* exported getHashAndSalt */
/* exported viewPage */
/* exported isValidMSISDN */
/* exported returnContentType */
/* exported beautifyIndent */
/* exported valueNotEmpty */
/* exported isCoreVersionCompatible */
/* exported buildBlob */
/* exported getTimeForTimezone */
/* exported getTimezoneOffset */

// eslint-disable-next-line no-unused-vars
var valueNotEmpty = function (value) {
  if (value !== null && value !== undefined && value !== '') {
    return true
  }
  return false
}

// eslint-disable-next-line no-unused-vars
function isBase64String (string) {
  var base64Matcher = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})([=]{1,2})?$')
  return base64Matcher.test(string)
}

// eslint-disable-next-line no-unused-vars
function decodeBase64 (stringToBeDecoded) {
  // decrypt
  var base64Value = CryptoJS.enc.Base64.parse(stringToBeDecoded)
  var decodeBase64Value = base64Value.toString(CryptoJS.enc.Utf8)
  return decodeBase64Value
}

// eslint-disable-next-line no-unused-vars
function getHashAndSalt (stringToBeHashed) {
  var salt = CryptoJS.lib.WordArray.random(16).toString()
  var sha512 = CryptoJS.algo.SHA512.create()
  sha512.update(salt)
  sha512.update(stringToBeHashed)
  var hash = sha512.finalize()
  return {
    hash: hash.toString(CryptoJS.enc.Hex),
    salt: salt,
    algorithm: 'sha512'
  }
}

// location provider
// eslint-disable-next-line no-unused-vars
function viewPage (path) {
  var url = window.location.href + path
  window.location = url
}

// eslint-disable-next-line no-unused-vars
function isValidMSISDN (inputtxt) {
  if (inputtxt) {
    var numRegex = /^([1-9]\d{1})([0-9]{3,13})$/
    if (inputtxt.match(numRegex)) {
      return true
    } else {
      return false
    }
  }
}

// eslint-disable-next-line no-unused-vars
function returnContentType (objectHeaders) {
  var contentType = ''

  if (objectHeaders['Content-Type']) {
    contentType = objectHeaders['Content-Type']
  } else if (objectHeaders['content-type']) {
    contentType = objectHeaders['content-type']
  }

  return contentType
}

// eslint-disable-next-line no-unused-vars
function beautifyIndent (type, content) {
  try {
    if (type.indexOf('text/xml') >= 0 || type.indexOf('application/xml') >= 0) {
      return { lang: 'xml', content: vkbeautify.xml(content, 2) }
    }

    if (type.indexOf('text/json') >= 0 || type.indexOf('application/json') >= 0) {
      return { lang: 'json', content: vkbeautify.json(content, 2) }
    }

    if (type.indexOf('text/html') >= 0 || type.indexOf('application/html') >= 0) {
      return { lang: 'html', content: vkbeautify.xml(content, 2) }
    }

    // {anything}application/{word characters}+xml{anything}.
    if (/.*application\/\w+\+xml.*/.test(type)) {
      return { lang: 'xml', content: vkbeautify.xml(content, 2) }
    }
  } catch (err) {
    return {lang: '', content: content}
  }

  // if not applicable then return as is
  return {lang: '', content: content}
}

// eslint-disable-next-line no-unused-vars
function isCoreVersionCompatible (minVersion, actualVersion) {
  var v1 = minVersion.split('.')
  var v2 = actualVersion.split('.')

  if (v1[0] === v2[0]) {
    if (v1[1] <= v2[1]) {
      return true
    }
  }
  return false
}

// eslint-disable-next-line no-unused-vars
function buildBlob (data, datatype) {
  var out
  try {
    out = new Blob([data], {type: datatype})
  } catch (e) {
    var BlobBuilder = function () {
      window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
    }

    if (e.name === 'TypeError' && window.BlobBuilder) {
      var bb = new BlobBuilder()
      bb.append(data)
      out = bb.getBlob(datatype)
    } else if (e.name === 'InvalidStateError') {
      // InvalidStateError (tested on FF13 WinXP)
      out = new Blob([data], {type: datatype})
    } else {
      out = { error: 'Browser not supported for Blob creation' }
    // We're screwed, blob constructor unsupported entirely
    }
  }
  return out
}

// eslint-disable-next-line no-unused-vars
function getTimeForTimezone (timezone) {
  if (timezone) {
    var timezoneDatetime = moment(new Date()).tz(timezone)
    return moment(timezoneDatetime).format('YYYY-MM-DD HH:mm:ss Z')
  }
}

// eslint-disable-next-line no-unused-vars
function getTimezoneOffset (timezone) {
  var timezoneDatetime = moment(new Date()).tz(timezone)
  return moment(timezoneDatetime).format('Z')
}
