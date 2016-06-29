'use strict';

var assert = require('assert-plus');
var request = require('request');
var logger = require('../logger/logger').logger;
var myPassportModel = require('my-passport-model');
var ServiceUnavailableError = myPassportModel.error.ServiceUnavailableError;
var cheerio = require('cheerio');

var getMainPage = function getMainPage(jar, options, callback) {
  logger.debug('getMainPage');
  var mainRequestConfig = options.get('main-request');

  assert.object(mainRequestConfig, 'mainRequestConfig');
  assert.object(mainRequestConfig.headers, 'mainRequestConfig.headers');
  assert.number(mainRequestConfig.timeout, 'mainRequestConfig.timeout');

  var opts = {
    url: mainRequestConfig.url,
    method: 'GET',
    followRedirect: true,
    headers: mainRequestConfig.headers,
    gzip: true,
    jar: jar,
    timeout: mainRequestConfig.timeout
  };

  try {
    request(opts, function (error, response, body) {
      if (error) {
        logger.info('error on getMainPage: ', error);
        return callback(new ServiceUnavailableError('Unable to get main page'));
      }

      return callback(error, body);
    });
  }
  catch (err) {
    logger.info('Unable to connect: %s', err);
    return callback(new ServiceUnavailableError('Unable to get main page'));
  }
};

var getMainPageData = function getMainPageData(options, callback) {
  logger.debug('getMainPageData');
  assert.object(options, 'options');
  assert.func(callback, 'callback');

  var jar = request.jar();

  return getMainPage(jar, options, function (error, body) {

    if (error) {
      logger.error(error);
      return callback(error);
    }

    var $ = cheerio.load(body);
    var hrefData = $('div#gotowosc-paszportu-data-href');

    if (hrefData) {
      var urlWithQuery = hrefData.attr('data-href');
      var auth = hrefData.attr('data-auth');

      return callback(null, {urlWithQuery: urlWithQuery, auth: auth, jar: jar});
    }

    return callback(new ServiceUnavailableError('Unable to get main page data'));
  });
};


module.exports = {
  getMainPage: getMainPage,
  getMainPageData: getMainPageData
};