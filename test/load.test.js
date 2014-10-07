var rewire = require('rewire');
var wechat = rewire('../lib/wechat-enterprise');
var Readable = require('stream').Readable;
var util = require('util');
var expect = require('expect.js');

function Counter(opt) {
  Readable.call(this, opt);
}
util.inherits(Counter, Readable);

Counter.prototype._read = function() {};

var load = wechat.__get__('load');

describe('load', function () {
  it('should not error', function (done) {
    var stream = new Counter();
    load(stream, function (err, xml) {
      expect(err).to.not.be.ok();
      done();
    });
    stream.push(new Buffer('<xml>'));
    stream.push(new Buffer('</xml>'));
    stream.push(null);
  });

  it('should exist error', function (done) {
    var stream = new Counter();
    load(stream, function (err, xml) {
      expect(err).to.be.ok();
      done();
    });
    stream.emit('error', new Error('some error'));
  });
});
