var expect = require('expect.js');
var muk = require('muk');
var urllib = require('urllib');

var config = require('./config');
var API = require('../').API;
var path = require('path');

describe('media', function () {
  var api = new API(config.corpid, config.corpsecret);
  before(function (done) {
    api.getAccessToken(done);
  });


  describe('upload media', function () {
    var fixture = {
      'Image': path.join(__dirname, './fixture/image.jpg'),
      'Voice': path.join(__dirname, './fixture/test.mp3'),
      'Video': path.join(__dirname, './fixture/movie.mp4'),
      'File': path.join(__dirname, './fixture/pic.jpg')
    };

    before(function () {
      muk(api, 'uploadVideo', function (filepath, callback) {
        if (filepath === path.join(__dirname, './fixture/inexist.jpg')) {
          return process.nextTick(function () {
            var err = new Error();
            err.code = 'ENOENT';
            callback(err);
          });
        }
        var data = {
          created_at: '',
          media_id: '',
          type: 'video'
        };
        var res =  {
          headers: {
            'content-type': 'image/jpeg'
          }
        };
        process.nextTick(function () {
          callback(null, data, res);
        });
      });
    });

    after(function () {
      muk.restore();
    });

    ['Image', 'Voice', 'Video', 'File'].forEach(function (method) {
      it('upload' + method + ' should ok', function (done) {
        // 上传文件比较慢
        this.timeout(60000);
        api['upload' + method](fixture[method], function (err, data, res) {
          expect(err).to.not.be.ok();
          expect(data.type).to.be(method.toLowerCase());
          if (method === 'Thumb') {
            expect(data).to.have.property('thumb_media_id');
          } else {
            expect(data).to.have.property('media_id');
          }
          expect(data).to.have.property('created_at');
          done();
        });
      });

      it('upload' + method + ' should not ok', function (done) {
        api['upload' + method](path.join(__dirname, './fixture/inexist.jpg'), function (err, data, res) {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'Error');
          expect(err).to.have.property('code', 'ENOENT');
          done();
        });
      });
    });
  });

  describe('get media with buffer', function () {
    before(function () {
      muk(urllib, 'request', function (url, args, callback) {
        var buffer = new Buffer('Hello world!');
        var res =  {
          headers: {
            'content-type': 'image/jpeg'
          }
        };
        process.nextTick(function () {
          callback(null, buffer, res);
        });
      });
    });

    after(function () {
      muk.restore();
    });

    it('getMedia with buffer', function (done) {
      api.getMedia('media_id', function (err, data, res) {
        expect(err).to.not.be.ok();
        expect(data.toString()).to.be('Hello world!');
        done();
      });
    });
  });

  describe('get media with json', function () {
    before(function () {
      muk(urllib, 'request', function (url, args, callback) {
        var data = JSON.stringify({"errcode":40007, "errmsg":"invalid media_id"});
        var res =  {
          headers: {
            'content-type': 'application/json'
          }
        };
        process.nextTick(function () {
          callback(null, data, res);
        });
      });
    });

    after(function () {
      muk.restore();
    });
    it('getMedia with json', function (done) {
      api.getMedia('media_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(err).to.have.property('name', 'WeChatAPIError');
        expect(err).to.have.property('message', 'invalid media_id');
        done();
      });
    });
  });

  describe('get media with err json', function () {
    before(function () {
      muk(urllib, 'request', function (url, args, callback) {
        var data = '{"errcode":40007, "errmsg":"invalid media_id"';
        var res =  {
          headers: {
            'content-type': 'application/json'
          }
        };
        process.nextTick(function () {
          callback(null, data, res);
        });
      });
    });

    after(function () {
      muk.restore();
    });
    it('getMedia with err json', function (done) {
      api.getMedia('media_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(err).to.have.property('name', 'SyntaxError');
        done();
      });
    });
  });
});
