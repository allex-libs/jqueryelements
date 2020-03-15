function createFromDataCreator (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    BasicElement = applib.BasicElement,
    DataAwareElement = applib.getElementType('DataAwareElement'),
    FromDataCreatorMixin = mixins.FromDataCreator;

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
    this.subElements = [];
  }
  lib.inherit(FromDataCreatorElement, DataAwareElement);
  FromDataCreatorMixin.addMethods(FromDataCreatorElement);
  FromDataCreatorElement.prototype.__cleanUp = function () {
    if (this.subElements) {
      lib.arryDestroyAll(this.subElements);
    }
    this.subElements = null;
    FromDataCreatorMixin.prototype.destroy.call(this);
    DataAwareElement.prototype.__cleanUp.call(this);
  };
  FromDataCreatorElement.prototype.set_data = function (data) {
    this._purgeSubElements(data);
    if (lib.isArray(data)) {
      this.createFromArryData(data);
    }
    return this.super_set_data(data);
  };
  /*
  FromDataCreatorElement.prototype.get_prependdata = function () {
    return this.data;
  };
  */
  FromDataCreatorElement.prototype.prependData = function (data) {
    var myprependsubelements = this.getConfigVal('prependsubelements') || false;
    this.setConfigVal('prependsubelements', true, true);
    this.set('data', data);
    this.setConfigVal('prependsubelements', myprependsubelements, true);
  };
  /*
  FromDataCreatorElement.prototype.get_appenddata = function () {
    return this.data;
  };
  */
  FromDataCreatorElement.prototype.appendData = function (data) {
    var myprependsubelements = this.getConfigVal('prependsubelements') || false;
    this.setConfigVal('prependsubelements', false, true);
    this.set('data', data);
    this.setConfigVal('prependsubelements', myprependsubelements, true);
  };
  FromDataCreatorElement.prototype._purgeSubElements = function (data) {
    if (data === null || !this.getConfigVal('skip_purge_subelements')) {
      lib.arryDestroyAll(this.subElements);
      this.subElements = [];
    }
  };
  FromDataCreatorElement.prototype.super_set_data = function (data) {
    return DataAwareElement.prototype.set_data.call(this, data);
  };
  FromDataCreatorElement.prototype.createFromArryData = function (data) {
    if (this.getConfigVal('prependsubelements')) {
      data = data.slice();
      data.reverse();
    }
    data.forEach(this.createFromArryItem.bind(this));
  };
  FromDataCreatorElement.prototype.createFromArryItem = function (item) {
    var desc = this.createDescriptorFromArryItem(item),
      testel;
    if (desc) {
      try {
        testel = this.getElement(desc.name);
        if(testel) {
          testel.set('data', item);
          return;
        }
      } catch(e) {}
      desc.options = desc.options || {};
      if (this.getConfigVal('prependsubelements')) {
        desc.options.attach_to_parent = 'prepend';
      }
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
