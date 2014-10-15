var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;

var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';

describe('valid corpid', function () {
  var api = new API(config.corpid, config.corpsecret);
  before(function (done) {
    api.getAccessToken(done);
  });

  it('getUser should not ok', function (done) {
    api.getUser(puling, function (err, data, res) {
      expect(err).to.be.ok();
      expect(err).to.have.property('name', 'WeChatAPIError');
      expect(err).to.have.property('message', 'userid not found');
      done();
    });
  });

  var userid = 'id_' + Math.random();

  it('createUser should not ok', function (done) {
    var user = {
      "userid": userid,
      "name": "张三",
      "department": [1, 2],
      "position": "产品经理",
      "mobile": "15913215422",
      "gender": 1,
      "tel": "62394",
      "email": "zhangsan@dev.com",
      "extattr": {
        "attrs":[
          {"name":"爱好","value":"旅游"},
          {"name":"卡号","value":"1234567234"}
        ]
      }
    };
    api.createUser(user, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'created');
      done();
    });
  });


  it('updateUser should not ok', function (done) {
    var user = {
      "userid": userid,
      "name": "new_name",
      "department": [1, 2],
      "position": "产品经理",
      "mobile": "15913215423",
      "gender": 1,
      "tel": "62394",
      "email": "zhangsan@dev.com",
      "extattr": {
        "attrs":[
          {"name":"爱好","value":"旅游"},
          {"name":"卡号","value":"1234567234"}
        ]
      }
    };
    api.updateUser(user, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'updated');
      done();
    });
  });

  it('getUser should ok', function (done) {
    api.getUser(userid, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'ok');
      expect(data).to.have.keys('userid', 'name', 'department', 'position',
        'mobile', 'gender', 'tel', 'email', 'status', 'extattr');
      done();
    });
  });

  it('deleteUser should ok', function (done) {
    api.deleteUser(userid, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'deleted');
      done();
    });
  });

  it('getDepartmentUsers should ok', function (done) {
    api.getDepartmentUsers(1, 0, 0, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'ok');
      expect(data.userlist).to.be.an('array');
      data.userlist.forEach(function (item) {
        expect(item).to.have.key('userid', 'name');
      });
      done();
    });
  });

  it('getUserIdByCode should not ok', function (done) {
    api.getUserIdByCode('code', function (err, data, res) {
      expect(err).to.be.ok();
      expect(err).to.have.property('message', 'invalid code');
      done();
    });
  });

  it('getAuthorizeURL should ok', function () {
    var url = api.getAuthorizeURL('http://baidu.com/callback');
    expect(url).to.be('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4aa3347cec528612&redirect_uri=http%3A%2F%2Fbaidu.com%2Fcallback&response_type=code&scope=snsapi_base&state=#wechat_redirect');
  });
});
