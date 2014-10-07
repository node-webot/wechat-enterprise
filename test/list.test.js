var expect = require('expect.js');
var List = require('../').List;

describe('list.js', function () {
  it('should ok', function () {
    var common = [
      ['选择{a}查看啥', function () {}],
      ['选择{b}查看啥', function () {}],
      ['选择{c}查看啥', function () {}]
    ];
    List.add('common', common);
    var list = List.get('common');
    expect(list.description).to.be('选择a查看啥\n选择b查看啥\n选择c查看啥');
    expect(list.get('a')).to.be(common[0][1]);
    expect(list.get('b')).to.be(common[1][1]);
    expect(list.get('c')).to.be(common[2][1]);
  });

  it('should ok when clear', function () {
    var common = [
      ['选择{a}查看啥', function () {}],
      ['选择{b}查看啥', function () {}],
      ['选择{c}查看啥', function () {}]
    ];
    List.add('common', common);
    var list = List.get('common');
    expect(list).to.be.ok();
    List.clear();
    list = List.get('common');
    expect(list).to.not.be.ok();
  });

  it('should ok with string', function () {
    var common = [
      ['welcome'],
      ['选择{a}查看啥', function () {}],
      ['选择{b}查看啥', function () {}],
      ['选择{c}查看啥', function () {}]
    ];
    List.add('welcome', common);
    var list = List.get('welcome');
    expect(list.description).to.be('welcome\n选择a查看啥\n选择b查看啥\n选择c查看啥');
    expect(list.get('a')).to.be(common[1][1]);
    expect(list.get('b')).to.be(common[2][1]);
    expect(list.get('c')).to.be(common[3][1]);
  });
});
