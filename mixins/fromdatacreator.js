function createFromDataCreatorMixin (lib, mylib) {
  'use strict';

  function FromDataCreatorMixin () {
  }
  FromDataCreatorMixin.prototype.destroy = function () {
  };

  FromDataCreatorMixin.addMethods = function (klass) {
  };

  mylib.FromDataCreator = FromDataCreatorMixin;
}
module.exports = createFromDataCreatorMixin;
