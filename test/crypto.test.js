var rewire = require('rewire');
var expect = require('expect.js');
var WXBizMsgCrypt = require('../lib/msg_crypto');
var config = require('./config');

describe('lib/msg_crypto.js', function () {
  it('should not ok', function () {
    expect(function () {
      new WXBizMsgCrypt();
    }).to.throwException(/please check arguments/);
    expect(function () {
      new WXBizMsgCrypt('token');
    }).to.throwException(/please check arguments/);
    expect(function () {
      new WXBizMsgCrypt('token', 'encodingAESKey');
    }).to.throwException(/please check arguments/);
    expect(function () {
      new WXBizMsgCrypt('token', 'encodingAESKey', 'corpid');
    }).to.throwException(/encodingAESKey invalid/);
  });

  it('getSignature should ok', function () {
    var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpid);
    var signature = cryptor.getSignature('timestamp', 'nonce', 'encrypt');
    expect(signature).to.be('8edac0945683c119ee71c9f6256d76c48aa08a96');
  });

  it('encrypt/decrypt should ok', function () {
    var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpid);
    var text = 'hehe';
    var encrypted = cryptor.encrypt(text);
    var decrypted = cryptor.decrypt(encrypted);
    expect(decrypted.message).to.be(text);
    // expect(decrypted.corpIdFromXml).to.be(config.corpid);
  });

  describe('PKCS7Encoder', function () {
    var PKCS7Encoder = rewire('../lib/msg_crypto').__get__('PKCS7Encoder');

    it('encode should ok', function () {
      var buf = new Buffer('text');
      var encoded = PKCS7Encoder.encode(buf);
      expect((encoded.length + 1) % 32).to.be(0);
      expect((encoded[encoded.length - 1] + 4) % 32).to.be(0);
    });

    it('decode should ok', function () {
      var buf = new Buffer('text');
      var encoded = PKCS7Encoder.encode(buf);
      expect(PKCS7Encoder.decode(encoded).toString()).to.be('text');
    });
  });

});
