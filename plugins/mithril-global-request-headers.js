'use strict';

module.exports = function(m) {
  var request = m.request
    , noop = function() {}
    , headers = m._globalRequestHeaders = []

  m.request = function(options) {
    var config = options.config || noop
    if(options.disableGlobalHeaders) return request.apply(this, arguments)
    options.config = function() {
      addGlobalHeaders.apply(this, arguments)
      return config.apply(this, arguments)
    }
    return request.apply(this, arguments)
  }
  m.addGlobalHeader = function addGlobalHeader(key, value) {
    headers = headers.concat({ key: key, value: value })
  }
  m.getGlobalHeaders = function getGlobalHeaders() {
    return headers
  }
  m.removeGlobalHeader = function removeGlobalHeader(key, value) {
    switch(arguments.length) {
      case 1:
        headers = headers.filter(removeGlobalHeadersByKey(key))
        break
      case 2:
        headers = headers.filter(removeGlobalHeadersByKeyAndValue(key, value))
        break
      default:
        throw new Error('removeHeader should be called with one or two arguments.')
    }
  }
  function isFunction(object) {
    return typeof object === 'function'
  }
  function getAddGlobalHeaderToRequest(xhr) {
    return function addGlobalHeaderToRequest(header) {
      xhr.setRequestHeader(isFunction(header.key) ? header.key() : header.key, isFunction(header.value) ? header.value() : header.value)
    }
  }
  function addGlobalHeaders(xhr) {
    headers.forEach(getAddGlobalHeaderToRequest(xhr))
  }
  function removeGlobalHeadersByKey(key) {
    return function removeByKey(obj) {
      return !(key === obj.key)
    }
  }
  function removeGlobalHeadersByKeyAndValue(key, value) {
    return function removeByKeyAndValue(obj) {
      return !(key === obj.key && obj.value === value)
    }
  }
}
