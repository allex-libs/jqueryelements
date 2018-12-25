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

  applib.registerElementType ('DataAwareElement',DataAwareElement);

}

module.exports = createDataAwareElement;
