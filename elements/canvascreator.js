function createCanvas (execlib, applib, templatelib, htmltemplateslib) {

  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function CanvasElement (id, options) {
    DomElement.call(this, id, options);
    this.image = null;
  }
  lib.inherit(CanvasElement, DomElement);
  CanvasElement.prototype.__cleanUp = function () {
    this.image = null;
    DomElement.prototype.__cleanUp.call(this);
  };
  CanvasElement.prototype.set_image = function (img) {
    var cntxt;
    if (!(this.$element && this.$element[0])) {
      return false;
    }
    //this.image = img;
    this.$element.attr('width', img.naturalWidth);
    this.$element.attr('height', img.naturalHeight);
    this.$element.css('width', img.width);
    this.$element.css('height', img.height);
    cntxt = this.get2DContext();
    if (!cntxt) {
      return false;
    }
    cntxt.drawImage(img, 0, 0);
    return true;
  };
  CanvasElement.prototype.get2DContext = function () {
    var ret;
    if (!this.destroyed) {
      return null;
    }
    if (!(this.$element && this.$element[0])) {
      return null;
    }
    ret = this.$element[0].getContext('2d');
    return ret;
  };
  CanvasElement.prototype.htmlTemplateName = 'canvas';
  CanvasElement.prototype.optionsConfigName = 'canvas';

  applib.registerElementType('CanvasElement', CanvasElement);
}
module.exports = createCanvas;
