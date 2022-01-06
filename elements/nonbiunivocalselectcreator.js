function createNonBiunivocalSelect (execlib, applib, templatelib, htmltemplateslib, mixins) {
  'use strict';

  var lib = execlib.lib;

  var SelectElement = applib.getElementType('SelectElement');

  function NonBiunivocalSelectElement (id, options) {
    SelectElement.call(this, id, options);
  }
  lib.inherit(NonBiunivocalSelectElement, SelectElement);
  NonBiunivocalSelectElement.prototype.getTitleValue = function (optiondata) {
    var titlefields = this.getConfigVal('titlefields'), ret;
    if (!lib.isArray(titlefields)) {
      return SelectElement.prototype.getTitleValue.call(thid, optiondata);
    }
    ret = titlefields.reduce(this.titleReducer.bind(this, optiondata), '');
    optiondata = null;
    return ret;
  };

  NonBiunivocalSelectElement.prototype.titleReducer = function (optiondata, result, titleelement) {
    if (!lib.isString(titleelement)) {
      return result;
    }
    return lib.joinStringsWith(result, valueFromColonSplits(optiondata, titleelement.split(':')), this.getConfigVal('titlejoiner') || ',');
  };

  function valueFromColonSplits (optiondata, splits) {
    var val = optiondata[splits[0]];
    if (splits.length<2) {
      return val+'';
    }
    val = modify(val, splits[1], 'pre');
    val = modify(val, splits[1], 'post');
    return val+'';
  }
  function modify(value, thingy, direction) {
    var intvalue = parseInt(thingy);
    if (!lib.isNumber(intvalue)) {
      return '';
    }
    return modifiers[direction+'pendToLength'](value+'', lib.isNumber(value) ? '0' : ' ', intvalue);
  }
  var modifiers = {
    prependToLength: function (str, thingy, len) {
      while(str.length < len) {
        str = thingy+str;
      }
      return str;
    },
    postpendToLength: function (str, thingy, len) {
      while(str.length < len) {
        str = str+thingy;
      }
      return str;
    }
  };

  applib.registerElementType('NonBiunivocalSelectElement', NonBiunivocalSelectElement);
}
module.exports = createNonBiunivocalSelect;