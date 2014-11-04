var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;

describe('department', function () {
  var api = new API(config.corpid, config.corpsecret);
  var id;
  before(function (done) {
    api.getAccessToken(done);
  });

  it('createDepartment(name, parentid)', function (done) {
    api.createDepartment('department_' + Math.random(), 1, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('id');
      expect(data).to.have.property('errmsg', 'created');
      id = data.id;
      done();
    });
  });

  it('createDepartment(name, opts)', function (done) {
    var opts = {
      parentid: 1,
      order: 1
    };
    api.createDepartment('department_' + Math.random(), opts, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('id');
      expect(data).to.have.property('errmsg', 'created');
      done();
    });
  });

  it('updateDepartment(id, newname) should ok', function (done) {
    api.updateDepartment(id, 'new_department_' + Math.random(), function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'updated');
      done();
    });
  });

  it('updateDepartment(id, opts) should ok', function (done) {
    api.updateDepartment(id, {}, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'updated');
      done();
    });
  });

  it('updateDepartment(id, opts) should ok', function (done) {
    var opts = {name: 'new_name', parentid: 1, order: 2};
    api.updateDepartment(id, opts, function (err, data, res) {
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
