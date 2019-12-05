function createImg (execlib, applib, templatelib, htmltemplateslib) {

  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function ImgElement (id, options) {
    DomElement.call(this, id, options);
    this.src = null;
    this.imgLoaded = new lib.HookCollection();
    this.naturalHeight = null;
    this.naturalWidth = null;
    this.naturalSize = null;
  }
  lib.inherit(ImgElement, DomElement);
  ImgElement.prototype.__cleanUp = function () {
    this.naturalSize = null;
    this.naturalWidth = null;
    this.naturalHeight = null;
    if (this.imgLoaded) {
      this.imgLoaded.destroy();
    }
    this.imgLoaded = null;
    this.src = null;
    DomElement.prototype.__cleanUp.call(this);
  };
  ImgElement.prototype.set_src = function (src) {
    if (!this.destroyed) {
      return false;
    }
    this.src = src;
    if (this.$element[0]) {
      this.$element[0].src = src;
    }
    return true;
  };
  ImgElement.prototype.initializeOnDomElement = function () {
    this.$element.on('load', this.onLoaded.bind(this));
    if (this.getConfigVal('img.src')) {
      this.set('src', this.getConfigVal('img.src'));
    }
  };
  ImgElement.prototype.onLoaded = function (evnt_ignored) {
    var el;
    if (!this.destroyed) {
      return;
    }
    el = this.$element[0];
    this.imgLoaded.fire(el);
    this.set('naturalHeight', el.naturalHeight);
    this.set('naturalWidth', el.naturalWidth);
    this.set('naturalSize', {w: el.naturalWidth, h: el.naturalHeight});
  };
  ImgElement.prototype.htmlTemplateName = 'img';
  ImgElement.prototype.optionsConfigName = 'img';

  applib.registerElementType('ImgElement', ImgElement);
}
module.exports = createImg;
