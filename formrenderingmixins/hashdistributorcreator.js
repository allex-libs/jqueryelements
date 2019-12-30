function createHashDistributorMixin (lib) {
  'use strict';

  function HashDistributorMixin (options) {
    this.hashdata = options.data || {};
  }
  HashDistributorMixin.prototype.destroy = function () {
    this.hashdata = null;
  };
  HashDistributorMixin.prototype.get_data = function () {
    return this.hashdata;
  }
  HashDistributorMixin.prototype.set_data = function (data) {
    if (!this.__children) {
      return;
    }
    this.hashdata = data;
    this.__children.traverse(datasetter.bind(null, data));
    data = null;
    return true;
  };

  HashDistributorMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, HashDistributorMixin
      ,'get_data'
      ,'set_data'
    );
  };

  function datasetter (data, chld) {
    chld.set('data', data);
  }

  return HashDistributorMixin;
}
module.exports = createHashDistributorMixin;
