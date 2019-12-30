function createSplashElement (execlib, applib, templatelib, htmltemplateslib) {
  'use strict';

  var lib = execlib.lib,
    DivElement = applib.getElementType('DivElement');

  function SplashElement (id, options) {
    DivElement.call(this, id, options);
  }
  lib.inherit(SplashElement, DivElement);
  SplashElement.prototype.set_actual = function (actual) {
    var target;
    if (actual) {
      lib.runNext(this.set.bind(this, 'actual', false), this.getConfigVal('timeout') || lib.intervals.Second);
    }
    return DivElement.prototype.set_actual.call(this, actual);
  };

  applib.registerElementType('SplashElement', SplashElement);
}
module.exports = createSplashElement;
