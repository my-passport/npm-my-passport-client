var options = require('config');
var checkCaseClient = require('../../lib/client/checkCase');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('checkCase client test', function () {

  it('should check case data', function (done) {

    var caseNumber = '1234567890123456';

    checkCaseClient.checkCaseStatus(caseNumber, options, function (err, data) {
      // console.log(err);
      // console.dir(data, {depth: null});
      // expect(data, 'data').to.be.not.undefined;
      // expect(err, 'err').to.be.null;
      expect(err, 'err').to.be.CaseNotFoundError;
      expect(data, 'data').to.be.undefined;
      done();
    });
  });

});
