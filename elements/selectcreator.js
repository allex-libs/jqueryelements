function createSelect (execlib, applib, templatelib, htmltemplateslib) {
  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function SelectElement (id, options) {
    DomElement.call(this, id, options);
    this.options = null;
  }
  lib.inherit(SelectElement, DomElement);
  SelectElement.prototype.__cleanUp = function () {
    this.options = null;
    DomElement.prototype.__cleanUp.call(this);
  };
  SelectElement.prototype.set_options = function (data) {
    if (!this.$element) {
      return;
    }
    this.$element.find('option').remove();
    if (lib.isArray(data)) {
      data.forEach(this.setSingleOption.bind(this));
    }
    this.options = data;
  };
  SelectElement.prototype.setSingleOption = function (optiondata) {
    this.$element.append(this.singleOptionMarkup(optiondata));
  };
  SelectElement.prototype.singleOptionMarkup = function (optiondata) {
    var titlepath, valuepath;
    titlepath = this.getConfigVal('titlepath');
    valuepath = this.getConfigVal('valuepath');
    if (titlepath && valuepath) {
      return o(m.option,
        'ATTRS', 'value="'+optiondata[valuepath]+'"',
        'CONTENTS', optiondata[titlepath]
      );
    }
    if (!lib.isString(optiondata)) {
      console.error('cannot set select option', optiondata, 'because it is not a string');
      return;
    }
    return o(m.option,
      'CONTENTS', 'blah'
    );
  };
  SelectElement.prototype.htmlTemplateName = 'select';
  SelectElement.prototype.optionsConfigName = 'select';

  applib.registerElementType('SelectElement', SelectElement);
}
module.exports = createSelect;
