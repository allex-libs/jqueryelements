function createCheckBoxElement (execlib, applib, templatelib, htmltemplateslib, mixins) {
  'use strict';

  var lib = execlib.lib,
  DomElement = applib.getElementType('DomElement');

function CheckBoxElement (id, options) {
  DomElement.call(this, id, options);
  this.checked = null;
  this.internalChange = false;
}
lib.inherit(CheckBoxElement, DomElement);
CheckBoxElement.prototype.__cleanUp = function () {
  this.internalChange = null;
  this.checked = null;
  DomElement.prototype.__cleanUp.call(this);
};

CheckBoxElement.prototype.get_checked = function () {
  return this.checked;
};
CheckBoxElement.prototype.set_checked = function (chk) {
  this.checked = chk;
  if (this.$element) {
    this.internalChange = true;
    this.$element.prop('checked', !!chk);
    this.internalChange = false;
  }
  return true;
};

CheckBoxElement.prototype.onElementInputChanged = function () {
  if (!this.internalChange) {
    this.set('checked', this.$element.is(':checked'));
  }
};

CheckBoxElement.prototype.initInput = function () {
  this.$element.on('change', this.onElementInputChanged.bind(this));
  this.set('checked', this.getConfigVal('checked'));
};

CheckBoxElement.prototype.postInitializationMethodNames =
      CheckBoxElement.prototype.postInitializationMethodNames.concat('initInput');

CheckBoxElement.prototype.optionsConfigName = 'checkboxinput';
CheckBoxElement.prototype.htmlTemplateName = 'checkboxinput';

applib.registerElementType('CheckBoxElement', CheckBoxElement);
}
module.exports = createCheckBoxElement;