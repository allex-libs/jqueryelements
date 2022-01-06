function createSelect (execlib, applib, templatelib, htmltemplateslib) {
  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function SelectElement (id, options) {
    DomElement.call(this, id, options);
    this.options = null;
    this.optionsMap = new lib.Map();
    this.selectedValue = null;
  }
  lib.inherit(SelectElement, DomElement);
  SelectElement.prototype.__cleanUp = function () {
    this.selectedValue = null;
    if (this.optionsMap) {
      this.optionsMap.destroy();
    }
    this.optionsMap = null;
    this.options = null;
    DomElement.prototype.__cleanUp.call(this);
  };
  SelectElement.prototype.initializeOnDomElement = function () {
    this.$element.on('change', this.reportChanged.bind(this));
    this.set('options', this.getConfigVal('options'));
  };
  SelectElement.prototype.reportChanged = function (ev) {
    var selected = this.$element.find('option:selected'),
      t = selected.text(),
      val = this.optionsMap.get(t);
    this.set('selectedValue', val);
  };
  SelectElement.prototype.set_selectedValue = function (selval) {
    var opt;
    if (!this.optionsMap) {
      this.set('value', selval);
      this.selectedValue = selval;
      return true;
    }
    var s = this.optionsMap.traverseConditionally(function (val, name) {
      if (lib.isEqual(val,selval)) {
        return name;
      }
    });
    if (!s) {
      this.selectedValue = null;
      return false;
    }
    this.$element.find('option').each(function () {
      var myopt = jQuery(this);
      if (myopt.text() == s) {
        opt = myopt;
      }
    });
    if (opt) {
      if (!opt.is(':selected')) {
        this.$element.val(opt.val());
      }
    }
    this.selectedValue = selval;
    return true;
  };
  SelectElement.prototype.set_options = function (data) {
    if (!this.$element) {
      return false;
    }
    this.optionsMap.purge();
    this.$element.find('option').remove();
    if (lib.isArray(data)) {
      data.forEach(this.setSingleOption.bind(this));
    }
    this.options = data;
    this.reportChanged();
    return true;
  };
  SelectElement.prototype.setSingleOption = function (optiondata) {
    this.$element.append(this.singleOptionMarkup(optiondata));
  };
  SelectElement.prototype.singleOptionMarkup = function (optiondata) {
    var titlevalue, valuevalue, optionscheck;
    titlevalue = this.getTitleValue(optiondata);
    if (lib.isVal(titlevalue)) {
      valuevalue = this.getValueValue(optiondata);
      optionscheck = this.optionsMap.get(titlevalue);
      if (lib.isVal(optionscheck)) {
        console.log(this.constructor.name, this.id, 'has something on', titlevalue, optionscheck);
        console.log('Should have been', valuevalue);
        return;
      }
      this.optionsMap.add(titlevalue, valuevalue);
      return o(m.option, 'CONTENTS', titlevalue);
    }
    if (!lib.isString(optiondata)) {
      console.error('cannot set select option', optiondata, 'because it is not a string');
      return;
    }
    return o(m.option,
      'ATTRS', 'value="'+optiondata+'"',
      'CONTENTS', optiondata
    );
  };
  SelectElement.prototype.getTitleValue = function (optiondata) {
    var titlepath = this.getConfigVal('titlepath');
    if (!titlepath) {
      return null;
    }
    return optiondata[titlepath];
  };
  SelectElement.prototype.getValueValue = function (optiondata) {
    var valuepath = this.getConfigVal('valuepath'), ret;
    if (!valuepath) {
      return optiondata;
    }
    if (lib.isString(valuepath)) {
      return optiondata[valuepath];
    }
    if (lib.isArray(valuepath)) {
      ret = valuepath.reduce(function (res, propname) {
        res[propname] = optiondata[propname];
        return res;
      }, {});
      optiondata = null;
      return ret;
    }
    return optiondata;
  };
  SelectElement.prototype.htmlTemplateName = 'select';
  SelectElement.prototype.optionsConfigName = 'select';

  applib.registerElementType('SelectElement', SelectElement);
}
module.exports = createSelect;
