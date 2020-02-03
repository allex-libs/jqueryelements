function createFormMixin (lib, mylib) {
  'use strict';

  var HashDistributorMixin = mylib.HashDistributor,
    HashCollectorMixin = mylib.HashCollector,
    DataHolderMixin = mylib.DataHolder;

  function FormMixin (options) {
    HashDistributorMixin.call(this, options);
    HashCollectorMixin.call(this, options);
    DataHolderMixin.call(this, options);
  }
  FormMixin.prototype.destroy = function () {
    DataHolderMixin.prototype.destroy.call(this);
    HashDistributorMixin.prototype.destroy.call(this);
    HashCollectorMixin.prototype.destroy.call(this);
  };
  FormMixin.prototype.set_data = function (data) {
    var ret = true;
    this.set('initiallyvalid', null);
    this.set('valid', null);
    if (false === this.dataHolderUnderReset) {
      this.resetData();
    } else {
    }
    if (lib.isVal(data)) {
      ret = HashDistributorMixin.prototype.set_data.call(this, data);
    }
    this.recheckChildren();
    return ret;
  };

  FormMixin.addMethods = function (klass) {
    HashDistributorMixin.addMethods(klass);
    HashCollectorMixin.addMethods(klass);
    DataHolderMixin.addMethods(klass);
    lib.inheritMethods(klass, FormMixin
      ,'set_data'
    );
  };

  mylib.Form = FormMixin;
};
module.exports = createFormMixin;
