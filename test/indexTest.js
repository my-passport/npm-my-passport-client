var index = require('../index');
var options = require('config');
var chai = require('chai');
var should = chai.should();

describe('index test', function () {

  it('should export checkCaseStatus', function (done) {

    var checkCaseStatus = index.checkCaseStatus;
    should.exist(checkCaseStatus);
    done();
  });

  it('should export meta version', function (done) {

    var version = index.VERSION;
    should.exist(version);
    done();
  });

});