function createWebElement (execlib, applib, templatelib) {
  'use strict';

  var $ = jQuery;

  var lib = execlib.lib,
    BasicElement = applib.BasicElement,
    resourceFactory = applib.resourceFactory,
    q = lib.q;

  function WebElement (id, options)  {
    BasicElement.call(this, id, options);
    this.$element = null;
    this.elementCreatedByMe = false;
    this._addHook ('onPreShow');
    this._addHook ('onPreHide');
    this._addHook ('onShown');
    this._addHook ('onHidden');
    this._helpers = null;

    var helperObj = this.getConfigVal ('helperObjects');
    for (var i in helperObj) {
      this.assignHelperObj (i, helperObj[i]);
    }
  }
  lib.inherit (WebElement, BasicElement);

  WebElement.prototype.__cleanUp = function () {
    if (this._helpers) {
      lib.container.destroyAll(this._helpers);
      this._helpers.destroy();
    }
    this._helpers = null;
    if (this.$element) {
      if (this.elementCreatedByMe) {
        this.$element.remove();
      }
    }
    this.$element = null;
    BasicElement.prototype.__cleanUp.call(this);
  };

  WebElement.prototype.assignHelperObj = function (name, obj) {
    if (!this._helpers) this._helpers = new lib.Map();
    this._helpers.add (name, obj);
  };

  WebElement.prototype.getHelperObj = function (name) {
    return this._helpers.get(name);
  };

  var _attribstart = 'attrib:';
  function tryComplexSelectorsForFinder (selector, id) {
    if (selector && selector.indexOf(_attribstart)===0) {
      return '['+selector.slice(_attribstart.length)+"='"+id+"']";
    }
    if (selector[0] === ':') {
      return selector;
    }
    throw new Error('Selector '+selector+' was not recognized for Finder');
  }

  function finderFrom (selector, id) {
    switch (selector) {
      case '#':
      case '.':
        return selector+id;
      default:
        return tryComplexSelectorsForFinder(selector, id);
    }
  }

  function tryComplexSelectorsForDecorator (elem, selector, id) {
    if (selector && selector.indexOf(_attribstart)===0) {
      elem.attr(selector.slice(_attribstart.length), id);
      return;
    }
    throw new Error('Selector '+selector+' was not recognized for Decorator');
  }

  function decorateElement (elem, selector, id) {
    switch (selector) {
      case '#':
        elem.attr('id', id);
        return;
      case '.':
        elem.addClass(id);
        return;
      default:
        return tryComplexSelectorsForDecorator(elem, selector, id);
    }
  }

  function fireJqueryDecorator (element, jquerydecorator) {
    if (lib.isFunction(jquerydecorator)) {
      jquerydecorator(element);
    }
  }

  WebElement.prototype.doThejQueryCreation = function () {
    this.createjQueryElement();
    WebElement.jqueryDecorators.forEach(fireJqueryDecorator.bind(null, this.$element));
  };

  WebElement.prototype.doThejQueryHooks = function () {
    this.attachHook ('onPreShow', this.getConfigVal('onPreShow'));
    this.attachHook ('onPreHide', this.getConfigVal('onPreHide'));
    this.attachHook ('onShown', this.getConfigVal('onShown'));
    this.attachHook ('onHidden', this.getConfigVal('onHidden'));
    //this.set_actual(!!this.get('actual'));
  };

  WebElement.prototype.createjQueryElement = function () {
    var selector = this.getConfigVal('self_selector')||'#';
    var finder = this.tryToCreatejQueryElement();
    if (!(this.$element && this.$element.length)) {
      if (!this.tryToCreateMarkup()) {
        throw new Error('Unable to find DOM element '+this.get('id')+' using jQuery selector '+selector+' ('+finder+')');
      }
      finder = this.tryToCreatejQueryElement();
      if (!(this.$element && this.$element.length)) {
        throw new Error('Unable to find DOM element '+this.get('id')+' using jQuery selector '+selector+' ('+finder+') even after creation with default_markup '+this.getDefaultMarkup());
      }
    }
    this.elementCreatedByMe = true;
    this.$element.attr('allexid', this.get('id'));
  };

  WebElement.prototype.tryToCreatejQueryElement = function () {
    var selector = this.getConfigVal('self_selector')||'#',
      finder = finderFrom(selector, this.get('id')),
      findingelem;
    if (this.__parent && this.__parent.$element) {
      findingelem = this.__parent.$element;
      //this.$element = this.__parent.$element.find(finder);
    } else {
      findingelem = $(document.body);
      //this.$element = $(finder);
    }
    findingelem = possiblyReposition(findingelem, this.getConfigVal('target_on_parent'));
    this.$element = findingelem.find(finder);
    return finder;
  };

  WebElement.prototype.tryToCreateMarkup = function () {
    var markup = templatelib.process(this.getDefaultMarkup()), appender, appendee;
    if (!markup) {
      return false;
    }
    if (this.__parent && this.__parent.$element) {
      appender = this.__parent.$element;
    } else {
      appender = $(document.body);
    }
    appender = possiblyReposition(appender, this.getConfigVal('target_on_parent'));
    appendee = $(markup);
    decorateElement(appendee, this.getConfigVal('self_selector')||'#', this.get('id'));
    appender.append(appendee);
    return true;
  };

  WebElement.prototype.getDefaultMarkup = function () {
    return this.getConfigVal('default_markup');
  };

  WebElement.prototype.set_actual = function (val) {
    if (!this.$element) {
      this.actual = val;
    }
    return BasicElement.prototype.set_actual.call(this, val);
  };

  WebElement.prototype.onUnloaded = function () {
    BasicElement.prototype.onUnloaded.call(this);
    this.hide();
  };

  WebElement.prototype.onLoaded = function () {
    BasicElement.prototype.onLoaded.call(this);
    if (this.get('actual')) {
      this.show();
    }
  };

  WebElement.prototype.onLoadFailed = function (reason) {
    BasicElement.prototype.onLoadFailed.call(this, reason);
  };

  WebElement.prototype.onLoadProgress = function () {
    BasicElement.prototype.onLoadProgress.call(this);
  };

  WebElement.prototype.set_loaded = function (val) {
    if (this.loaded == val) return false;
    var prev = this.loaded;
    this.loaded = val;
    if (!val && prev) {
      this.unload();
    }

    return true;
  };

  WebElement.prototype.resetElement = function (ext) {
    var resetf = this.getConfigVal('reset');
    if (lib.isFunction(resetf)) resetf(this, ext);
  };

  WebElement.prototype.show = function () {
    if (!this.$element) return;
    this.fireHook ('onPreShow', [this]);
    var visible_class = this.getConfigVal('visible_class'),
      show_jq_function = this.getConfigVal('show_jq_function');

    if (visible_class) {
      this.$element.addClass(visible_class);
    }

    if (show_jq_function) {
      if (lib.isString(show_jq_function)){
        this.$element[show_jq_function]();
      }

      if (lib.isArray(show_jq_function)){
        var name = show_jq_function[0];
        this.$element[name].apply(this.$element, show_jq_function.slice(1));
      }
    }else{
      this.$element.show();
    }
    this.fireHook ('onShown', [this]);
  };

  WebElement.prototype.hide = function () {
    if (!this.$element) return;
    this.fireHook ('onPreHide', [this]);
     var visible_class = this.getConfigVal('visible_class'),
      hide_jq_function = this.getConfigVal('hide_jq_function');

    if (visible_class) {
      this.$element.removeClass(visible_class);
    }

    if (hide_jq_function) {
      if (lib.isString(hide_jq_function)){
        this.$element[hide_jq_function]();
      }

      if (lib.isArray(hide_jq_function)){
        var name = hide_jq_function[0];
        this.$element[name].apply(this.$element, hide_jq_function.slice(1));
      }
    }else{
      this.$element.hide();
    }

    this.fireHook('onHidden');
  };

  function splitAtDot (str) {
    var dotpos = str.indexOf('.');
    if (dotpos>=0) {
      return [str.slice(0,dotpos), str.slice(dotpos+1)];
    }
    return [str, null];
  }

  WebElement.prototype.getElement = function (path) {
    //e, aj vidi u cemu je ovde fora ... jel .$element ili je $element ili sta je koji moj ... i gledaj samo pocetak sa replace ....
    var ret, elempath, splits, elem;

    if (path.indexOf('$element.') === 0){
      elempath = path.replace('$element.', '');
    }
    if (path.indexOf('.$element.') === 0) {
      elempath = path.replace('.$element.', '');
    }

    if (elempath) {
      ret = this.$element.find(elempath);
    }


    if (ret) {
      if (ret.length===0) {
        throw new lib.Error('JQUERY_FIND_FAILED', 'jQuery could not find '+elempath);
      }
      return ret;
    }

    splits = splitAtDot(path);
    //console.log(path, '=>', splits);
    if (!splits[0]) {
      elem = this;
    } else {
      elem = this.findById(splits[0]);
    }
    if (!elem) {
      throw new lib.Error('INVALID_PATH', 'Path '+path+' did not produce a valid first element');
    }
    return splits[1] ? elem.getElement(splits[1]) : elem;

    /*
    path = path.replace (/^\./, '');

    if (path === '$element')  {
      return this.$element;
    }

    if (path === '.') {
      return this.getMeAsElement();
    }

    return this.childAtPath(path);
    */
  };

  WebElement.prototype.findById = function (id) {
    if ('$element' === id) return this.$element;
    return BasicElement.prototype.findById.call(this,id);
  };

  WebElement.prototype.getMeAsElement = function () {
    //return this.$element;
    return this;
  };

  WebElement.prototype.findDomReference = function (type){
    if (!type) throw new Error('No type given');
    var id = this.id,
      jqfindstring = '#references #references_'+id+' #references_'+id+'_'+type,
      ret = jQuery(jqfindstring),
      refmarkups;
    if (!ret.length) {
      refmarkups = this.getConfigVal('reference_markups');
      if (refmarkups && refmarkups[type]) {
        ret = jQuery(refmarkups[type]);
      }
    }
    if (!ret.length) {
      console.warn(this.constructor.name, id, ': reference ', type, 'not found at', jqfindstring, 'or options.reference_markups.'+type);
    }
    return ret;
  };

  WebElement.prototype.raiseEvent = function () {
    this.$element.trigger.apply(this.$element, arguments);
  };

  WebElement.prototype.preInitializationMethodNames = BasicElement.prototype.preInitializationMethodNames.concat('doThejQueryCreation');
  WebElement.prototype.postInitializationMethodNames = BasicElement.prototype.postInitializationMethodNames.concat('doThejQueryHooks');

  WebElement.jqueryDecorators = [];

  WebElement.ResourcesSchema = {
    type : "array",
    items: {
      type: "object",
      properties : {
        type : { type : 'string' },
        name : { type : 'string' },
        options : {type : 'object'}
      },
      additionalProperties: false,
      required : ['type', 'name']
    }
  };

  function possiblyReposition (elem, reposition) {
    if (!reposition) {
      return elem;
    }
    return elem.find(reposition);
  }

  applib.registerElementType ('WebElement',WebElement);
}

module.exports = createWebElement;
