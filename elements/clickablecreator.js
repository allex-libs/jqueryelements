function createClickable (execlib, applib, templatelib, htmltemplateslib) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function createClickable (options) {
    return o(m[options.type || 'button'],
      'CLASS', options.class || '',
      'ATTRS', options.attrs || '',
      'CONTENTS', options.text
    );
  }

  function ClickableElement (id, options) {
    options.default_markup = options.default_markup || createClickable(options.clickable || {});
    WebElement.call(this, id, options);
    this.clicked = new lib.HookCollection();
    this.clickvalue = null;
    if (options && ('enabled' in options)) {
      this.set('enabled', options.enabled);
    }
  }
  lib.inherit (ClickableElement, WebElement);
  ClickableElement.prototype.__cleanUp = function () {
    this.clickvalue = null;
    if (this.clicked) {
      this.clicked.destroy();
    }
    this.clicked = null;
    WebElement.prototype.__cleanUp.call(this);
  };
  ClickableElement.prototype.createjQueryElement = function () {
    WebElement.prototype.createjQueryElement.call(this);
    this.$element.on('click', this.onElementClicked.bind(this));
  };
  ClickableElement.prototype.onElementClicked = function (jqueryevent) {
    if (!this.get('enabled')) {
      return;
    }
    this.clicked.fire.call(this.clicked, [jqueryevent, this.clickvalue]);
  };
  ClickableElement.prototype.set_enabled = function (val) {
    if (this.isButton()) {
      return this.setEnabledOnButton(val);
    }
    if (this.isAnchor()) {
      return this.setEnabledOnAnchor(val);
    }
    return false;
  };
  ClickableElement.prototype.setEnabledOnButton = function (val) {
    if (!this.$element) {
      return false;
    }
    this.$element.prop('disabled', !val);
    return true;
  };
  ClickableElement.prototype.setEnabledOnAnchor = function (val) {
    if (!this.setEnabledOnButton(val)) {
      this.$element.removeClass('disabled');
      return false;
    }
    this.$element.addClass('disabled');
  };
  ClickableElement.prototype.get_enabled = function () {
    if (this.isButton()) {
      return this.getEnabledOnButton();
    }
    if (this.isAnchor()) {
      return this.getEnabledOnAnchor();
    }
    return false;
  };
  ClickableElement.prototype.getEnabledOnButton = function () {
    return this.$element && !this.$element.prop('disabled');
  };
  ClickableElement.prototype.getEnabledOnAnchor = function () {
    return this.getEnabledOnButton();
  };
  ClickableElement.prototype.isButton = function () {
    return this.$element && this.$element.is('button');
  };
  ClickableElement.prototype.isAnchor = function () {
    return this.$element && this.$element.is('a');
  };


  applib.registerElementType('ClickableElement', ClickableElement);
}

module.exports = createClickable;
