function createInputElement (execlib, applib, templateslitelib, htmltemplateslib, jobs) {
  'use strict';

  var DomElement = applib.getElementType('DomElement'),
    lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    lR = execlib.execSuite.libRegistry,
    bufferedlib = lR.get('allex_bufferedtriggerlib'),
    o = templateslitelib.override,
    p = templateslitelib.process,
    m = htmltemplateslib;

  function InputElement (id, options) {
    DomElement.call(this, id, options);
    this.value = null;
    this.waiter = new bufferedlib.BufferedWaiter(this.triggerInputChange.bind(this), 100);
    this.onInputChanger = this.onInputChange.bind(this);
    this.internalChange = false;
  }
  lib.inherit(InputElement, DomElement);
  InputElement.prototype.__cleanUp = function () {
    this.internalChange = null;
    if (this.$element) {
      this.$element.off('change', this.onInputChanger);
    }
    this.onInputChanger = null;
    if (this.waiter) {
      this.waiter.destroy();
    }
    this.waiter = null;
    this.value = null;
    DomElement.prototype.__cleanUp.call(this);
  };
  InputElement.prototype.initializeOnDomElement = function () {
    this.$element.on('keyup', this.onInputChanger);
  };

  InputElement.prototype.get_value = function () {
    return this.value;
  };
  InputElement.prototype.set_value = function (val) {
    this.value = val;
    if (!this.internalChange) {
      this.$element.val(val);
    }
    return true;
  };

  InputElement.prototype.onInputChange = function () {
    this.internalChange = true;
    this.set('value', this.$element.val());
    this.internalChange = false;
  };
  InputElement.prototype.triggerInputChange = function (ev) {
    this.set('value', this.$element.val());
  };
  InputElement.prototype.optionsConfigName = 'input';
  
  applib.registerElementType('InputElement', InputElement);

  function TextInputElement (id, options) {
    InputElement.call(this, id, options);
  }
  lib.inherit(TextInputElement, InputElement);
  TextInputElement.prototype.htmlTemplateName = 'textinput';
  applib.registerElementType('TextInputElement', TextInputElement);

  function SearchInputElement (id, options) {
    InputElement.call(this, id, options);
  }
  lib.inherit(SearchInputElement, InputElement);
  SearchInputElement.prototype.initializeOnDomElement = function () {
    InputElement.prototype.initializeOnDomElement.call(this);
    this.$element.on('search', this.onInputChanger);
  };
  SearchInputElement.prototype.__cleanUp = function () {
    if (this.$element) {
      this.$element.off('search', this.onInputChanger);
    }
    InputElement.prototype.__cleanUp.call(this);
  };
  SearchInputElement.prototype.set_actual = function (act) {
    this.set('value', null);
    return InputElement.prototype.set_actual.call(this, act);
  };
  SearchInputElement.prototype.htmlTemplateName = 'searchinput';
  applib.registerElementType('SearchInputElement', SearchInputElement);

  function PasswordInputElement (id, options) {
    InputElement.call(this, id, options);
  }
  lib.inherit(PasswordInputElement, InputElement);
  PasswordInputElement.prototype.htmlTemplateName = 'passwordinput';
  applib.registerElementType('PasswordInputElement', PasswordInputElement);

  function NumberInputElement (id, options) {
    InputElement.call(this, id, options);
  }
  lib.inherit(NumberInputElement, InputElement);
  NumberInputElement.prototype.htmlTemplateName = 'numberinput';
  applib.registerElementType('NumberInputElement', NumberInputElement);

  function EmailInputElement (id, options) {
    InputElement.call(this, id, options);
  }
  lib.inherit(EmailInputElement, InputElement);
  EmailInputElement.prototype.htmlTemplateName = 'emailinput';
  applib.registerElementType('EmailInputElement', EmailInputElement);

  function PhoneInputElement (id, options) {
    InputElement.call(this, id, options);
  }
  lib.inherit(PhoneInputElement, InputElement);
  PhoneInputElement.prototype.htmlTemplateName = 'phoneinput';
  applib.registerElementType('PhoneInputElement', PhoneInputElement);
}
module.exports = createInputElement;