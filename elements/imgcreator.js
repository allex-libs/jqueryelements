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
    this.imgError = new lib.HookCollection();
    this.naturalHeight = null;
    this.naturalWidth = null;
    this.naturalSize = null;
    this.onImgLoadeder = this.onImgLoaded.bind(this);
    this.onImgErrorer = this.onImgError.bind(this);
  }
  lib.inherit(ImgElement, DomElement);
  ImgElement.prototype.__cleanUp = function () {
    if (this.$element) {
      this.$element.off('load', this.onImgLoadeder);
      this.$element.off('error', this.onImgErrorer);
    }
    this.onImgLoadeder = null;
    this.onImgErrorer = null;
    this.naturalSize = null;
    this.naturalWidth = null;
    this.naturalHeight = null;
    if (this.imgError) {
      this.imgError.destroy();
    }
    this.imgError = null;
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
    this.$element.on('load', this.onImgLoadeder);
    this.$element.on('error', this.onImgErrorer);
    if (this.getConfigVal('img.src')) {
      this.set('src', this.getConfigVal('img.src'));
    }
  };
  ImgElement.prototype.onImgLoaded = function (evnt_ignored) {
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
  ImgElement.prototype.onImgError = function (evnt_ignored) {
    var el;
    if (!this.destroyed) {
      return;
    }
    el = this.$element[0];
    this.set('naturalHeight', el.naturalHeight);
    this.set('naturalWidth', el.naturalWidth);
    this.set('naturalSize', {w: el.naturalWidth, h: el.naturalHeight});
  };
  ImgElement.prototype.htmlTemplateName = 'img';
  ImgElement.prototype.optionsConfigName = 'img';

  applib.registerElementType('ImgElement', ImgElement);
}
module.exports = createImg;
