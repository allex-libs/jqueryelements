function createFromDataCreator (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    BasicElement = applib.BasicElement,
    DataAwareElement = applib.getElementType('DataAwareElement'),
    FromDataCreatorMixin = applib.mixins.FromDataCreator;

  function FromDataCreatorElement (id, options) {
    /* need to be more delicate
    if (!(options && options.subDescriptor)) {
      console.error('error in options', options);
      throw new Error('options must have a subDescriptor field, with the descriptor for the children');
    }
    if (!(options && lib.isFunction(options.data2Name))) {
      console.error('error in options', options);
      throw new Error('options must have a data2Name field, with the naming function for the children');
    }
    */
    DataAwareElement.call(this, id, options);
    FromDataCreatorMixin.call(this);
  }
  lib.inherit(FromDataCreatorElement, DataAwareElement);
  FromDataCreatorMixin.addMethods(FromDataCreatorElement);
  FromDataCreatorElement.prototype.__cleanUp = function () {
    FromDataCreatorMixin.prototype.destroy.call(this);
    DataAwareElement.prototype.__cleanUp.call(this);
  };
  FromDataCreatorElement.prototype.super_set_data = function (data) {
    return DataAwareElement.prototype.set_data.call(this, data);
  };


  applib.registerElementType('FromDataCreator', FromDataCreatorElement);

}

module.exports = createFromDataCreator;
