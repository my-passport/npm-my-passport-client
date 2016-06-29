'use strict';

var meta = require('./lib/meta');
var checkCaseClient = require('./lib/client/checkCase');

var checkCaseStatus = function checkCaseStatus(authRequest, options, callback) {
  return checkCaseClient.checkCaseStatus(authRequest, options, callback);
};

module.exports = {
  VERSION: meta.VERSION,
  checkCaseStatus: checkCaseStatus
};