function createTextFromHashMixin (lib) {
  'use strict';

  function TextFromHashMixin (options) {
  }
  TextFromHashMixin.prototype.destroy = function () {
  };
  TextFromHashMixin.prototype.get_data = function () {
    return null;
  };
  TextFromHashMixin.prototype.set_data = function (data) {
    this.set(this.getConfigVal('text_is_html') ? 'html' : 'text', this.hashToText(data)||'');
  };
  TextFromHashMixin.prototype.hashToText = function () {
    throw new Error(this.constructor.name+' has to implement its own hashToText');
  };

  TextFromHashMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, TextFromHashMixin
      ,'get_data'
      ,'set_data'
      ,'hashToText'
    );
  };

  return TextFromHashMixin;
}
module.exports = createTextFromHashMixin;
