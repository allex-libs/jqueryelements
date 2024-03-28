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
    this._htmlcontent;
    this._tooltiptext;
    this._tooltip;

    var helperObj = this.getConfigVal ('helperObjects');
    for (var i in helperObj) {
      this.assignHelperObj (i, helperObj[i]);
    }
  }
  lib.inherit (WebElement, BasicElement);

  WebElement.prototype.__cleanUp = function () {
    this._htmlcontent = null;
    if (this._helpers) {
      lib.container.destroyAll(this._helpers);
      this._helpers.destroy();
    }
    this._helpers = null;
    if (this.$element) {
      if (this.elementCreatedByMe) {
        this.$element.remove();
      } else {
        removeAttr(this.$element, 'allexid', this.get('id'));
        removeAttr(this.$element, 'allextype', this.constructor.name);
        this.removeClassesSet();
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
    var selector, finder, classestoset, elem;
    selector = this.getConfigVal('self_selector')||'#';
    finder = this.tryToCreatejQueryElement();
    if (!(this.$element && this.$element.length)) {
      if (!this.tryToCreateMarkup()) {
        console.error('on', this.findingElement());
        throw new Error('Unable to find DOM element '+this.get('id')+' using jQuery selector '+selector+' ('+finder+')');
      }
      finder = this.tryToCreatejQueryElement();
      if (!(this.$element && this.$element.length)) {
        console.error('on', this.findingElement());
        throw new Error('Unable to find DOM element '+this.get('id')+' using jQuery selector '+selector+' ('+finder+') even after creation with default_markup '+this.getDefaultMarkup());
      }
      this.elementCreatedByMe = true;
    }
    /*
    this.$element.attr('allexid', this.get('id'));
    this.$element.attr('allextype', this.constructor.name);
    */
    appendAttr(this.$element, 'allexid', this.get('id'));
    appendAttr(this.$element, 'allextype', this.constructor.name);
    classestoset = this.getConfigVal('set_classes');
    if (lib.isArray(classestoset)) {
      elem = this.$element;
      classestoset.forEach(classsetterifnotpresent.bind(null, elem));
      elem = null;
    }
    if (this.shouldHideMarkupOnCreation()) {
      this.$element.hide();
    }
  };

  function classsetterifnotpresent (elem, classname) {
    if (!elem.hasClass(classname)) {
      elem.addClass(classname);
    }
  }

  WebElement.prototype.tryToCreatejQueryElement = function () {
    var selector = this.getConfigVal('self_selector')||'#',
      finder = finderFrom(selector, this.get('id')),
      findingelem = this.findingElement();
    this.$element = findingelem.find(finder);
    return finder;
  };

  WebElement.prototype.findingElement = function () {
    var findingelem;
    if (this.getConfigVal('force_dom_parent')) {
      findingelem = $(this.getConfigVal('force_dom_parent'));
    }
    if (!(findingelem && findingelem.length)) {
      if (this.__parent && this.__parent.$element) {
        findingelem = this.__parent.$element;
        //this.$element = this.__parent.$element.find(finder);
      } else {
        findingelem = $(document.body);
        //this.$element = $(finder);
      }
    }
    findingelem = possiblyRelocate(findingelem, this.getConfigVal('target_on_parent'));
    if (!(findingelem && findingelem.length)) {
      throw new Error(this.constructor.name+' '+this.get('id')+' misconfigured, so the parent DOM element cannot be located, check the "self_selector" or "force_dom_parent" or "target_on_parent"');
    }
    return findingelem;
  };

  var _wrappertargetclass = 'wrappertarget';
  WebElement.prototype.tryToCreateMarkup = function () {
    var markup = templatelib.process(this.getDefaultMarkup()),
      appender,
      appendee,
      dmw,
      dmwelement,
      dmwtarget,
      forcesibling,
      sibling;
    if (!markup) {
      return false;
    }
    if (this.getConfigVal('force_dom_parent')) {
      appender = $(this.getConfigVal('force_dom_parent'));
    }
    if (!(appender && appender.length)) {
      if (this.__parent && this.__parent.$element) {
        appender = this.__parent.$element;
      } else {
        appender = $(document.body);
      }
    }
    appender = possiblyRelocate(appender, this.getConfigVal('target_on_parent'));
    dmw = this.getConfigVal('default_markup_wrapper');
    if (dmw) {
      dmwelement = $(templatelib.process(dmw));
      if (dmwelement.hasClass(_wrappertargetclass)) {
        dmwtarget = dmwelement;
      }
      if (!(dmwtarget && dmwtarget[0])) {
        dmwtarget = dmwelement.find('.wrappertarget');
      }
      if (!(dmwtarget && dmwtarget[0])) {
        console.warn('default_markup_wrapper option was found', dmw, 'but it did not contain an element with class "wrappertarget"');
      } else {
        appender.append(dmwelement);
        appender = dmwtarget;
      }
    }
    appendee = $(markup);
    decorateElement(appendee, this.getConfigVal('self_selector')||'#', this.get('id'));
    forcesibling = this.getConfigVal('force_prev_sibling');
    if (forcesibling) {
      sibling = appender.find(forcesibling);
      if (!(sibling && sibling[0])) {
        console.error('on', appender);
        throw new Error ('force_prev_sibling was defined as "'+forcesibling+'", but it was not found');
      }
      sibling.after(appendee);
      return true;
    }
    forcesibling = this.getConfigVal('force_next_sibling');
    if (forcesibling) {
      sibling = appender.find(forcesibling);
      if (!(sibling && sibling[0])) {
        console.error('on', appender);
        throw new Error ('force_prev_sibling was defined as "'+forcesibling+'", but it was not found');
      }
      sibling.before(appendee);
      return true;
    }
    appender[this.getConfigVal('attach_to_parent')==='prepend' ? 'prepend' : 'append'](appendee);
    return true;
  };

  WebElement.prototype.getDefaultMarkup = function () {
    /*
    var dmw = this.getConfigVal('default_markup_wrapper');
    if (dmw) {
      if (dmw.indexOf('TARGETELEMENT')>=0) {
        return {
          template: dmw,
          replacements: {
            TARGETELEMENT: this.getConfigVal('default_markup')
          }
        };
      }
      console.warn('default_markup_wrapper option was found', dmw, 'but it did not contain the TARGETELEMENT keyword');
    }
    */
    return this.getConfigVal('default_markup');
  };

  WebElement.prototype.removeClassesSet = function () {
    var elem = this.$element, classestoset;
    if (!elem) {
      return;
    }
    classestoset = this.getConfigVal('set_classes');
    if (lib.isArray(classestoset)) {
      classestoset.forEach(classremovever.bind(null, elem));
      elem = null;
    }
  };

  function classremovever (elem, classname) {
    elem.removeClass(classname);
  }

  WebElement.prototype.set_actual = function (val) {
    if (!this.$element) {
      this.actual = val;
    }
    return BasicElement.prototype.set_actual.call(this, val);
  };

  //text start
  WebElement.prototype.set_text = function (val) {
    if (this.$element) {
      this.$element.text(val);
    }
    return true;
  };
  WebElement.prototype.get_text = function () {
    if (this.$element) {
      return this.$element.text();
    }
    return null;
  };
  //text end
  
  //html start
  WebElement.prototype.set_html = function (val) {
    if (!this.$element) {
      return false;
    }
    this.$element.html(val);
    this._htmlcontent = val;
    return true;
  };
  WebElement.prototype.get_html = function () {
    return this._htmlcontent;
  };
  //text end
  
  //value start
  WebElement.prototype.set_value = function (val) {
    if (this.$element) {
      this.$element.val(val);
    }
    return true;
  };
  WebElement.prototype.get_value = function () {
    if (this.$element) {
      return this.$element.val();
    }
    return null;
  };
  //value end
  
  //required start
  WebElement.prototype.get_required = function () {
    var req;
    if (this.$element) {
      req = this.getConfigVal('required');
      if (lib.isVal(req)) {
        return req;
      }
      return this.$element.attr('required');
    }
    return null;
  };
  //required end

  //enabled start
  WebElement.prototype.set_enabled = function (val) {
    if (this.$element) {
      this.$element.prop('disabled', !val);
    }
    return true;
  };
  WebElement.prototype.get_enabled = function () {
    if (this.$element) {
      return !this.$element.prop('disabled');
    }
    return null;
  };
  //enabled end

  //readonly start
  WebElement.prototype.set_readonly = function (val) {
    if (this.$element) {
      this.$element.prop('readonly', val);
    }
    return true;
  };
  WebElement.prototype.get_readonly = function () {
    if (this.$element) {
      return this.$element.prop('readonly');
    }
    return null;
  };
  //readonly end
  
  //checked start
  WebElement.prototype.set_checked = function (val) {
    if (this.$element) {
      this.$element.prop('checked', val);
    }
    return true;
  };
  WebElement.prototype.get_checked = function () {
    if (this.$element) {
      return this.$element.prop('checked');
    }
    return null;
  };
  WebElement.prototype.get_visible = function () {
    if (this.$element) {
      return this.$element.css('visibility') == 'visible';
    }
    return null;
  };
  WebElement.prototype.set_visible = function (vis) {
    if (this.$element) {
      this.$element.css('visibility', vis ? 'visible' : 'hidden');
    }
    return true;
  };
  //checked end

  //tooltip start
  WebElement.prototype.set_tooltip = function (ttip) {
    if (this._tooltiptext == ttip) {
      return false;
    }
    this.$element[ttip ? 'addClass' : 'removeClass']('allextooltipholder');
    this._tooltiptext = ttip;
    if (this.$element.is('input') || this.$element.is('img') || this.$element.is('button')) {
      this.$element.attr('title', ttip);
      return true;
    }
    if (ttip) {
      if (this._tooltip) {
        this._tooltip.html(ttip);
      } else {
        this._tooltip = jQuery('<span\>');
        this._tooltip.addClass('allextooltiptext');
        this._tooltip.html(ttip);
        this.$element.append(this._tooltip);
      }
    } else {
      if (this._tooltip) {
        this._tooltip.detach();
      }
      this._tooltip = null;
    }
    return true;
  };
  WebElement.prototype.get_tooltip = function () {
    return this._tooltiptext;
  };
  //tooltip end

  WebElement.prototype.onUnloaded = function () {
    BasicElement.prototype.onUnloaded.call(this);
    if (this.getConfigVal('actualnotvisual')) {
      return;
    }
    this.hide();
  };

  WebElement.prototype.onLoaded = function () {
    BasicElement.prototype.onLoaded.call(this);
    if (this.getConfigVal('actualnotvisual')) {
      return;
    }
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
      this.showElement();
    }
    this.fireHook ('onShown', [this]);
  };

  WebElement.prototype.showElement = function () {
    this.$element.show();//this.actual);
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
      this.hideElement();
    }

    this.fireHook('onHidden');
  };

  WebElement.prototype.hideElement = function () {
    this.$element.hide();
  };

  WebElement.prototype.getElement = function (path) {
    //e, aj vidi u cemu je ovde fora ... jel .$element ili je $element ili sta je koji moj ... i gledaj samo pocetak sa replace ....
    var ret, elempath;

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

    return BasicElement.prototype.getElement.call(this, path);
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

  WebElement.prototype.shouldHideMarkupOnCreation = function () {
    return !this.getConfigVal('actualnotvisual');
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

  function possiblyRelocate (elem, reposition) {
    if (!reposition) {
      return elem;
    }
    return elem.find(reposition);
  }

  function attrValueToSet (currattrval, val) {
    var valtoset;
    if (lib.isBoolean(currattrval)) {
      return currattrval+','+val;
    }
    if (lib.isNumber(currattrval)) {
      return currattrval+','+val;
    }
    if (lib.isString(currattrval) && currattrval.length>0) {
      return currattrval+','+val;
    }
    return val;
  }
  function appendAttr (elem, name, val) {
    var valtoset = attrValueToSet(elem.attr(name), val);
    elem.attr(name, attrValueToSet(elem.attr(name), val));
  }

  function removeAttr (elem, name, val) {
    var attrs = elem.attr(name), valindex;
    try {
      attrs = attrs.split(',');
    }
    catch (e) {
      attrs = [attrs];
    }
    valindex = attrs.indexOf(val);
    if (valindex>=0) {
      attrs.splice(valindex,1);
      elem.attr(name, attrs.join(','));
    }
  }

  applib.registerElementType ('WebElement',WebElement);
}

module.exports = createWebElement;
