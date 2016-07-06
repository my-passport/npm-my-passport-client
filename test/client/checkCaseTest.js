var options = require('config');
var rewire = require('rewire');
var checkCaseClient = rewire('../../lib/client/checkCase');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('checkCase client test', function () {

  var mainMock = {
    getMainPageData: function (options, cb) {
      return cb(null, {urlWithQuery: 'http://', auth: 'auth', jar: {}});
    }
  };

  it('should check case with PENDING status', function (done) {

    var responseJsonMock = '[{"kodStatusu":"h","error":false,"status":"Twój paszport jest w realizacji. Nie możesz go jeszcze odebrać.","nrWniosku":"1234567890123456"}]';

    var requestMock = function requestMock(opt, callback) {
      return callback(undefined, {statusCode: 200}, responseJsonMock);
    };

    requestMock.jar = function () {
      return {'some data': 'value'};
    };

    checkCaseClient.__set__({
      request: requestMock,
      main: mainMock
    });

    var caseNumber = '1234567890123456';

    checkCaseClient.checkCaseStatus(caseNumber, options, function (err, data) {
      //console.log(err);
      // console.dir(data, {depth: null});
      expect(err, 'err').to.be.null;
      expect(data, 'data').to.be.not.undefined;
      expect(data.id, 'data.id').to.be.equal(caseNumber);
      expect(data.status, 'data.status').to.be.equal('PENDING');
      done();
    });
  });

  it('should check case with READY status', function (done) {

    var responseJsonMock = '[{"kodStatusu":"1","error":false,"status":"Twój paszport jest w gotowy do odbioru.","nrWniosku":"1234567890123456"}]';

    var requestMock = function requestMock(opt, callback) {
      return callback(undefined, {statusCode: 200}, responseJsonMock);
    };

    requestMock.jar = function () {
      return {'some data': 'value'};
    };

    checkCaseClient.__set__({
      request: requestMock,
      main: mainMock
    });

    var caseNumber = '1234567890123456';

    checkCaseClient.checkCaseStatus(caseNumber, options, function (err, data) {
      //console.log(err);
      // console.dir(data, {depth: null});
      expect(err, 'err').to.be.null;
      expect(data, 'data').to.be.not.undefined;
      expect(data.id, 'data.id').to.be.equal(caseNumber);
      expect(data.status, 'data.status').to.be.equal('READY');
      done();
    });
  });

  it('should return not found exception', function (done) {

    var responseJsonMock = '[{"kodStatusu":-1,"error":false,"status":"Nie znaleziono danych dla wniosku","nrWniosku":"1234567890123456"}]';

    var requestMock = function requestMock(opt, callback) {
      return callback(undefined, {statusCode: 200}, responseJsonMock);
    };

    requestMock.jar = function () {
      return {'some data': 'value'};
    };

    checkCaseClient.__set__({
      request: requestMock,
      main: mainMock
    });

    var caseNumber = '1234567890123456';

    checkCaseClient.checkCaseStatus(caseNumber, options, function (err, data) {
      // console.log(err);
      // console.dir(data, {depth: null});
      expect(data, 'data').to.be.undefined;
      expect(err, 'err').to.be.not.undefined;
      expect(err.name, 'err.name').to.be.equal('CaseNotFoundError');
      expect(err.message, 'err.message').to.be.equal('Case "1234567890123456" not found');
      expect(err.userMessage, 'err.userMessage').to.be.equal('Nie znaleziono danych dla wniosku');
      done();
    });
  });


});
