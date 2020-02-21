function createFromDataCreator (execlib, applib) {
  'use strict';

  var lib = execlib.lib,
    BasicElement = applib.BasicElement,
    DataAwareElement = applib.getElementType('DataAwareElement');

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
    this.subElements = [];
  }
  lib.inherit(FromDataCreatorElement, DataAwareElement);
  FromDataCreatorElement.prototype.__cleanUp = function () {
    if (this.subElements) {
      lib.arryDestroyAll(this.subElements);
    }
    this.subElements = null;
    DataAwareElement.prototype.__cleanUp.call(this);
  };
  FromDataCreatorElement.prototype.set_data = function (data) {
    if (!lib.isArray(this.subElements)) {
      return this.super_set_data(data);
    }
    lib.arryDestroyAll(this.subElements);
    this.subElements = [];
    if (lib.isArray(data)) {
      this.createFromArryData(data);
    }
    this.subElements.forEach(unbuffer);
    return this.super_set_data(data);
  };
  function unbuffer(subel) {
    subel.unbufferAllBufferableHookCollections();
  }
  FromDataCreatorElement.prototype.super_set_data = function (data) {
    return DataAwareElement.prototype.set_data(data);
  };
  FromDataCreatorElement.prototype.createFromArryData = function (data) {
    data.forEach(this.createFromArryItem.bind(this));
  };
  FromDataCreatorElement.prototype.createFromArryItem = function (item) {
    var desc = this.createDescriptorFromArryItem(item);
    if (desc) {
      desc.options = desc.options || {};
      desc.options.data = item;
      BasicElement.createElement(desc, this.addFromDataChild.bind(this));
      return;
    }
    console.warn(this.constructor.name, 'created no descriptor from', item, 'so no child will be produced');
  };
  FromDataCreatorElement.prototype.addFromDataChild = function (chld) {
    this.subElements.push(this.destructableForSubElements(chld));
    this.addChild(chld);
  };
  FromDataCreatorElement.prototype.destructableForSubElements = function (chld) {
    return chld;
  };
  FromDataCreatorElement.prototype.createDescriptorFromArryItem = function (item) {
    if (lib.isFunction(this.config.subDescriptorFromData)) {
      return this.config.subDescriptorFromData(item);
    }
    /*
    lib.extend({
      name: this.config.data2Name(item)
    }, this.config.subDescriptor)
    */
  };


  applib.registerElementType('FromDataCreator', FromDataCreatorElement);

}

module.exports = createFromDataCreator;
