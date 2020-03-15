function createClickable (execlib, applib, templatelib, htmltemplateslib, mymixins) {
  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement'),
    o = templatelib.override,
    m = htmltemplateslib,
    ClickableMixin = mymixins.Clickable;

  function ClickableElement (id, options) {
    //options.default_markup = options.default_markup || createClickable(options.clickable || {});
    DomElement.call(this, id, options);
    ClickableMixin.call(this, options);
  }
  lib.inherit (ClickableElement, DomElement);
  ClickableMixin.addMethods(ClickableElement);
  ClickableElement.prototype.__cleanUp = function () {
    ClickableMixin.prototype.destroy.call(this);
    DomElement.prototype.__cleanUp.call(this);
  };
  ClickableElement.prototype.set_enabled = function (val) {
    return ClickableMixin.prototype.set_enabled.call(this, val);
  };
  ClickableElement.prototype.get_enabled = function () {
    return ClickableMixin.prototype.get_enabled.call(this);
  };
  ClickableElement.prototype.createDefaultMarkup = function (htmltemplatename, options) {
    return DomElement.prototype.createDefaultMarkup.call(this, options.type || 'button', options);
  };
  ClickableElement.prototype.optionsConfigName = 'clickable';

  applib.registerElementType('ClickableElement', ClickableElement);
}

module.exports = createClickable;
