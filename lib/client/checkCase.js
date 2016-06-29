'use strict';

var assert = require('assert-plus');
var request = require('request');
var logger = require('../logger/logger').logger;
var main = require('./main');
var myPassportModel = require('my-passport-model');
var ServiceUnavailableError = myPassportModel.error.ServiceUnavailableError;
var CaseNotFoundError = myPassportModel.error.CaseNotFoundError;
var CaseResponseBuilder = myPassportModel.model.caseResponse.CaseResponseBuilder;
var StatusEnum = myPassportModel.enum.StatusEnum;

var buildResponse = function buildResponse(response, callback) {
  logger.debug('buildResponse');

  var status = StatusEnum.UNKNOWN;
  var caseNumber = null;

  //TODO poprawna odpowiedz tez jest w [] ?
  if (response.length > 0) {
    response = response[0];
  }

  if (response.hasOwnProperty('nrWniosku')) {
    caseNumber = response.nrWniosku;
  }

  if (response.hasOwnProperty('kodStatusu')) {
    switch (response.kodStatusu) {
      case -1:
        return callback(new CaseNotFoundError('Case "' + caseNumber + '" not found'));
      //TODO
      default:
        status = StatusEnum.PENDING;
    }
  }

  return callback(null, new CaseResponseBuilder()
    .withId(caseNumber)
    .withStatus(status)
    .build()
  );

};

var buildForm = function buildForm(caseNumber, auth) {
  logger.debug('buildForm');

  return {
    _Gotowoscpaszportu_WAR_Gotowoscpaszportuportlet_nrSprawy: caseNumber,
    _Gotowoscpaszportu_WAR_Gotowoscpaszportuportlet_p_auth: auth
  };

};

var checkCaseStatusRequest = function checkCaseStatusRequest(jar, options, urlWithQuery, caseNumber, auth, callback) {
  logger.debug('checkCaseStatusRequest');
  var checkCaseRequestConfig = options.get('check-case-request');

  assert.object(checkCaseRequestConfig, 'checkCaseRequestConfig');
  assert.object(checkCaseRequestConfig.headers, 'checkCaseRequestConfig.headers');
  assert.number(checkCaseRequestConfig.timeout, 'checkCaseRequestConfig.timeout');
  assert.string(urlWithQuery, 'urlWithQuery');
  assert.string(caseNumber, 'caseNumber');
  assert.string(auth, 'auth');

  var opts = {
    url: urlWithQuery,
    method: 'POST',
    form: buildForm(caseNumber, auth),
    followRedirect: true,
    headers: checkCaseRequestConfig.headers,
    gzip: true,
    jar: jar,
    timeout: checkCaseRequestConfig.timeout
  };

  try {
    request(opts, function (error, response, body) {
      if (error) {
        logger.info('error on checkCaseStatusRequest: ', error);
        return callback(new ServiceUnavailableError('Unable to check case status'));
      }

      return callback(error, body);
    });
  }
  catch (err) {
    logger.info('Unable to connect: %s', err);
    return callback(new ServiceUnavailableError('Unable to check case status'));
  }
};

var checkCaseStatus = function checkCaseStatus(caseNumber, options, callback) {
  logger.debug('checkCaseStatus');
  assert.object(options, 'options');
  assert.func(callback, 'callback');

  return main.getMainPageData(options, function (error, data) {

    if (error) {
      logger.error(error);
      return callback(error);
    }

    return checkCaseStatusRequest(data.jar, options, data.urlWithQuery, caseNumber, data.auth, function (error, jsonResponse) {
      if (error) {
        logger.error(error);
        return callback(error);
      }
      
      var response = JSON.parse(jsonResponse);
      return buildResponse(response, callback);
    });
  });
};


module.exports = {
  checkCaseStatusRequest: checkCaseStatusRequest,
  checkCaseStatus: checkCaseStatus
};