function createDataAwareChildElement (execlib, DataElementFollowerMixin, applib) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement');

  function DataAwareChildElement (id, options) {
    WebElement.call(this, id, options);
    DataElementFollowerMixin.call(this);
  }
  lib.inherit (DataAwareChildElement, WebElement);
  DataElementFollowerMixin.addMethods (DataAwareChildElement);

  DataAwareChildElement.prototype.__cleanUp = function () {
    DataElementFollowerMixin.prototype.__cleanUp.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };

  DataAwareChildElement.prototype.postInitializationMethodNames = WebElement.prototype.postInitializationMethodNames.concat('startListeningToParentData');

  applib.registerElementType ('DataAwareChild',DataAwareChildElement);

}

module.exports = createDataAwareChildElement;
