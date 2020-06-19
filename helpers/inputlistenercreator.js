function createInputListener (lib, mylib) {
  'use strict';

  //input is a jQuery object
  function InputListener (input, changecallback) {
    this.input = input;
    this.cb = changecallback;
    this.onchanger = this.onChange.bind(this);
    this.onvirtchanger = this.onVirtualChange.bind(this);
    this.lastknownval = null;
    input.on('keyup', this.onchanger);
    input.on('paste', this.onvirtchanger);
    input.on('cut', this.onvirtchanger);
  }
  InputListener.prototype.destroy = function () {
    this.lastknownval = null;
    if (this.onvirtchanger && this.input) {
      this.input.off('cut', this.onvirtchanger);
      this.input.off('paste', this.onvirtchanger);
    }
    this.onvirtchanger = null;
    if (this.onchanger && this.input) {
      this.input.off('keyup', this.onchanger);
    }
    this.onchanger = null;
    this.cb = null;
    this.input = null;
  };
  InputListener.prototype.onChange = function (ev_ignored) {
    if (this.input.val() === this.lastknownval) {
      return;
    }
    this.lastknownval = null;
    if (lib.isFunction(this.cb)) {
      this.cb();
    }
  };
  InputListener.prototype.onVirtualChange = function (ev) {
    this.lastknownval = this.input.val();
    lib.runNext(this.onChange.bind(this), 10);
  };

  mylib.InputListener = InputListener;
}
module.exports = createInputListener;
