function createDivElement (execlib, applib, templatelib, htmltemplateslib) {
  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement');

  function DivElement (id, options) {
    DomElement.call(this, id, options);
  }
  lib.inherit(DivElement, DomElement);
  DivElement.prototype.optionsConfigName = 'div';
  DivElement.prototype.htmlTemplateName = 'div';

  applib.registerElementType('DivElement', DivElement);
}
module.exports = createDivElement;
