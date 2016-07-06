var options = require('config');
var checkCaseClient = require('../../lib/client/checkCase');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('checkCase client test', function () {

  it('should return not found exception', function (done) {

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
