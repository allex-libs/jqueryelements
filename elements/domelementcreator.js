function createDomElement (execlib, applib, templatelib, htmltemplateslib) {

  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function DomElement (id, options) {
    options.default_markup = options.default_markup || this.createDefaultMarkup(
      this.htmlTemplateName,
      this.configOptionsForDefaultMarkup(options)
    );
    WebElement.call(this, id, options);
  }
  lib.inherit(DomElement, WebElement);
  DomElement.prototype.configOptionsForDefaultMarkup = function (options) {
    var useroptions = options && lib.isVal(options) ? options[this.optionsConfigName] || {} : {};
    return lib.extend({}, this.defaultOptionsForMarkup(), useroptions);
  };
  DomElement.prototype.defaultOptionsForMarkup = function () {
    return {};
  };
  DomElement.prototype.initializeOnDomElement = function () {
  };
  DomElement.prototype.createDefaultMarkup = function (htmltemplatename, options) {
    return o( m[htmltemplatename],
      'CLASS', options.class || '',
      'ATTRS', options.attrs || '',
      'TARGET', options.target || '#',
      'CONTENTS', options.text || ''
    );
  };

  DomElement.prototype.postInitializationMethodNames = WebElement.prototype.postInitializationMethodNames.concat('initializeOnDomElement');

  applib.registerElementType('DomElement', DomElement);
}
module.exports = createDomElement;
