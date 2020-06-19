function createDataAwareElement (execlib, DataElementMixIn, applib) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement');

  function DataAwareElement (id, options) {
    WebElement.call(this, id, options);
    DataElementMixIn.call(this);
  }
  lib.inherit (DataAwareElement, WebElement);
  DataElementMixIn.addMethods (DataAwareElement);

  DataAwareElement.prototype.__cleanUp = function () {
    DataElementMixIn.prototype.__cleanUp.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };

  DataAwareElement.prototype.set_data = function (data) {
    var ret = DataElementMixIn.prototype.set_data.call(this, data),
      dkn = this.getConfigVal('datakeyname');
    if (ret && this.$element && dkn) {
      this.$element.data(dkn, data);
    }
    return ret;
  };
  DataAwareElement.prototype.onNullData = function (isnull) {
    //console.log(this.constructor.name, 'got null data', isnull);
    jQueryshowhide(this.$element, this.getConfigVal('nulldata_finder'), isnull);
  };
  DataAwareElement.prototype.onEmptyDataArray = function (isempty) {
    //console.log(this.constructor.name, 'got empty data', isempty);
    jQueryshowhide(this.$element, this.getConfigVal('emptydataarray_finder'), isempty);
  };
  function jQueryshowhide (elem, finderobj, doshow) {
    var finder, showargs, hideargs, el;
    if (!(elem && finderobj)) {
      return;
    }
    if (lib.isString(finderobj)) {
      finder = finderobj;
      showargs = [];
      hideargs = [];
    } else {
      finder = finderobj.finder;
      showargs = finderobj.showargs;
      hideargs = finderobj.hideargs;
    }
    el = elem.find(finder);
    el[doshow ? 'show' : 'hide'].apply(el, doshow ? showargs : hideargs);
  }
  DataAwareElement.prototype.getDefaultMarkup = function () {
    var ret = WebElement.prototype.getDefaultMarkup.call(this), dm;
    if (lib.isVal(ret)) {
      return ret;
    }
    dm = this.getConfigVal('data_markup');
    if (!lib.isVal(dm)) {
      return ret;
    }
    return this.produceDataMarkup(dm, this.get('data'));
  };
  DataAwareElement.prototype.preInitializationMethodNames = WebElement.prototype.preInitializationMethodNames.concat('preInitializeData');
  DataAwareElement.prototype.postInitializationMethodNames = WebElement.prototype.postInitializationMethodNames.concat('postInitializeData');

  applib.registerElementType ('DataAwareElement',DataAwareElement);

}

module.exports = createDataAwareElement;
