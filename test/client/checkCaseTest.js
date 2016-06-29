var options = require('config');
var rewire = require('rewire');
var checkCaseClient = rewire('../../lib/client/checkCase');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('checkCase client test', function () {

  it('should get checkCase data', function (done) {

    var responseJsonMock = '[{"kodStatusu":1,"error":false,"status":"Wniosek gotowy do odbioru","nrWniosku":"1234567890123456"}]';

    var requestMock = function requestMock(opt, callback) {
      return callback(undefined, {statusCode: 200}, responseJsonMock);
    };

    requestMock.jar = function () {
      return {'some data': 'value'};
    };

    var mainMock = {
      getMainPageData: function (options, cb) {
        return cb(null, {urlWithQuery: 'http://', auth: 'auth', jar: requestMock.jar()});
      }
    };

    checkCaseClient.__set__({
      request: requestMock,
      main: mainMock
    });

    var caseNumber = '1234567890123456';

    checkCaseClient.checkCaseStatus(caseNumber, options, function (err, data) {
      //console.log(err);
      // console.dir(data, {depth: null});
      expect(data, 'data').to.be.not.undefined;
      expect(err, 'err').to.be.null;
      done();
    });
  });


});
