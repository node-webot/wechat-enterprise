var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;

describe('department', function () {
  var api = new API(config.corpid, config.corpsecret);
  var id;
  before(function (done) {
    api.getAccessToken(done);
  });

  it('createDepartment should ok', function (done) {
    api.createDepartment('department_' + Math.random(), 1, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('id');
      expect(data).to.have.property('errmsg', 'created');
      id = data.id;
      done();
    });
  });

  it('updateDepartment should ok', function (done) {
    api.updateDepartment(id, 'new_department_' + Math.random(), function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'updated');
      done();
    });
  });

  it('deleteDepartment should ok', function (done) {
    api.deleteDepartment(id, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'deleted');
      done();
    });
  });

  it('getDepartments should ok', function (done) {
    api.getDepartments(function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'ok');
      expect(data.department).to.be.an('array');
      data.department.forEach(function (item) {
        expect(item).to.have.key('id', 'name', 'parentid');
      });
      done();
    });
  });
});
