function createCheckBoxElement (execlib, applib, templatelib, htmltemplateslib, mixins) {
  'use strict';

  var lib = execlib.lib,
  DomElement = applib.getElementType('DomElement');

function CheckBoxElement (id, options) {
  DomElement.call(this, id, options);
  this.checked = null;
}
lib.inherit(CheckBoxElement, DomElement);
CheckBoxElement.prototype.__cleanUp = function () {
  this.checked = null;
  DomElement.prototype.__cleanUp.call(this);
};

CheckBoxElement.prototype.get_checked = function () {
  return this.checked;
};
CheckBoxElement.prototype.set_checked = function (chk) {
  this.checked = chk;
  return true;
};

CheckBoxElement.prototype.onElementInputChanged = function () {
  this.set('checked', this.$element.is(':checked'));
};

CheckBoxElement.prototype.initInput = function () {
  this.$element.on('change', this.onElementInputChanged.bind(this));
};

CheckBoxElement.prototype.postInitializationMethodNames =
      CheckBoxElement.prototype.postInitializationMethodNames.concat('initInput');

CheckBoxElement.prototype.optionsConfigName = 'checkboxinput';
CheckBoxElement.prototype.htmlTemplateName = 'checkboxinput';

applib.registerElementType('CheckBoxElement', CheckBoxElement);
}
module.exports = createCheckBoxElement;