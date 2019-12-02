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
