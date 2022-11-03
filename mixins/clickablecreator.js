function createClickableMixin (lib, mylib) {
  'use strict';

  function ClickableMixin (options) {
    this.clicked = new lib.HookCollection();
    this.clickvalue = null;
    /*
    if (options && ('enabled' in options)) {
      this.set('enabled', options.enabled);
    }
    */
  }
  ClickableMixin.prototype.destroy = function () {
    this.clickvalue = null;
    if (this.clicked) {
      this.clicked.destroy();
    }
    this.clicked = null;
  };
  ClickableMixin.prototype.initClickable = function () {
    this.$element.on('click', this.onElementClicked.bind(this));
    if ('enabled' in this.config) {
      this.set_enabled(this.getConfigVal('enabled'));
    }
  };
  ClickableMixin.prototype.onElementClicked = function (jqueryevent) {
    if (!this.clickShouldHappen()) {
      return;
    }
    if (!this.getConfigVal('allowDefault')) {
      jqueryevent.preventDefault();
    }
    this.clicked.fire.call(this.clicked, [jqueryevent, this.clickvalue]);
  };
  ClickableMixin.prototype.clickShouldHappen = function () {
    if (!this.get('enabled') && !this.getConfigVal('ignore_enabled')) {
      return false;
    }
    return true;
  };
  ClickableMixin.prototype.setEnabledOnButtonFromClickable = function (val) {
    if (!this.$element) {
      return false;
    }
    this.$element.prop('disabled', !val);
    return true;
  };
  ClickableMixin.prototype.setEnabledOnAnchorFromClickable = function (val) {
    if (!this.setEnabledOnButtonFromClickable(val)) {
      this.$element.removeClass('disabled');
      return false;
    }
    this.$element.addClass('disabled');
  };
  ClickableMixin.prototype.getEnabledOnButtonFromClickable = function () {
    return this.$element && !this.$element.prop('disabled');
  };
  ClickableMixin.prototype.getEnabledOnAnchorFromClickable = function () {
    return this.getEnabledOnButtonFromClickable();
  };
  ClickableMixin.prototype.isButtonFromClickable = function () {
    return this.$element && this.$element.is('button');
  };
  ClickableMixin.prototype.isAnchorFromClickable = function () {
    return this.$element && this.$element.is('a');
  };

  //not addMethod-ed
  ClickableMixin.prototype.set_enabled = function (val) {
    if (this.isButtonFromClickable()) {
      return this.setEnabledOnButtonFromClickable(val);
    }
    if (this.isAnchorFromClickable()) {
      return this.setEnabledOnAnchorFromClickable(val);
    }
    return false;
  };
  ClickableMixin.prototype.get_enabled = function () {
    if (this.isButtonFromClickable()) {
      return this.getEnabledOnButtonFromClickable();
    }
    if (this.isAnchorFromClickable()) {
      return this.getEnabledOnAnchorFromClickable();
    }
    return false;
  };

  ClickableMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, ClickableMixin
      ,'onElementClicked'
      ,'initClickable'
      ,'clickShouldHappen'
      ,'setEnabledOnButtonFromClickable'
      ,'setEnabledOnAnchorFromClickable'
      ,'getEnabledOnButtonFromClickable'
      ,'getEnabledOnAnchorFromClickable'
      ,'isButtonFromClickable'
      ,'isAnchorFromClickable'
    );
    klass.prototype.postInitializationMethodNames =
      klass.prototype.postInitializationMethodNames.concat('initClickable');
  };

  mylib.Clickable = ClickableMixin;
}
module.exports = createClickableMixin;
