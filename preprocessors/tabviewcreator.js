function createTabViewProcessor (allex, routerlib, applib, templatelib) {
  'use strict';
  var lib = allex.lib,
    BasicElement = applib.BasicElement,
    BasicProcessor = applib.BasicProcessor,
    RouterMixIn = routerlib.RouterMixIn;

    function TabViewElement (id, options) {
      BasicElement.call(this, id, options);
      RouterMixIn.call(this);
    }
    lib.inherit (TabViewElement, BasicElement);
    RouterMixIn.addMethods (TabViewElement);

    TabViewElement.prototype.__cleanUp = function () {
      RouterMixIn.prototype.__cleanUp.call(this);
      BasicElement.prototype.__cleanUp.call(this);
    };

    TabViewElement.prototype.reinitializeRouter = function () {
      RouterMixIn.prototype.__cleanUp.call(this);
      RouterMixIn.call(this);
    };

    TabViewElement.prototype._doInitializeView = function (tabnames, tabs, config, selector){
      var bind_actual = config.bind_actual, tabroute;
      this.default_page = config.default_tab||null;
      for (var i = 0; i < tabnames.length; i++) {
        tabroute = this.tabFromMap(tabnames[i], config, selector);
        this.addPage (tabroute, tabs[i]);
      }

      if (!bind_actual || (bind_actual && selector.get('actual'))) {
        this.reset();
      }
    };

    TabViewElement.prototype.tabFromMap = function (tabkey, config, selector) {
      //config.tabs is already checked for, no need to check again
      //trivial case : return config.tabs[tabkey]
      var ret = config.tabs[tabkey], tabmarkup, tco;
      if (!lib.isString(ret)) {
        tco = config.tabcreateoptions;
        if (!(tco && tco.template && tco.routekeyname)) {
          throw new Error('If values in config.tabs are not strings, config has to have a "tabcreateoptions" property as an Object with properties "template", "routekeyname", and optionally "parentselector"');
        }
        //create tab markup
        tabmarkup = templatelib.process({template: tco.template, replacements: ret});
        console.log(tabmarkup);
        console.log('selector?', selector.$element);
        jQuery(tabmarkup).appendTo(tco.parentselector ? selector.$element.find(tco.parentselector) : selector.$element);
        ret = ret[tco.routekeyname];
      }
      return ret;
    };

    TabViewElement.prototype.getContainer = function () {
      return null;
    };

    applib.registerElementType ('TabViewElement', TabViewElement);


    function TabViewProcessor () {
      BasicProcessor.call(this);
    }
    lib.inherit (TabViewProcessor, BasicProcessor);
    TabViewProcessor.prototype.destroy = function () {
      BasicProcessor.prototype.destroy.call(this);
    };

    TabViewProcessor.prototype.process = function (desc){
      //za sad samo ovako ....
      for (var tv_name in this.config) {
        this.createTabView (tv_name, this.config[tv_name], desc);
      }
    };

    TabViewProcessor.prototype.createTabView = function (name, config, desc) {
      if (!config.tabs) throw new Error ('No tabs record in config for tab view '+ name);
      if (!('bind_actual' in config)) {
        config.bind_actual = true;
      }
      var refs = [this.elementReferenceStringOf(desc, name+'_tab_view'), config.selector];
      this.elementsOf(desc).push ({
        name : name+'_tab_view',
        type : config.type || 'TabViewElement',
        options : lib.extend({
          toggle : config.toggle || false
        }, config.options)
      });

      var tabnames = Object.keys (config.tabs);
      Array.prototype.push.apply(refs, tabnames);

      desc.logic = desc.logic || [];
      /*
      desc.logic.push ({
        triggers : '.!ready',
        references : refs.join (','),
        handler : this._initializeElement.bind(this, name, config, tabnames)
      });
      */
      desc.logic.push ({
        triggers : refs[0]+':initialized',
        references : refs.join (','),
        handler : this._initializeElement.bind(this, name, config, tabnames)
      });

      if (config.bind_actual) {
        desc.logic.push ({
          triggers : config.selector+':actual',
          references : refs.join (','),
          handler : this._onSelectorActual.bind(this, name, config, tabnames)
        });
      }


      if (!config.selector) return; //nothing more to be done ...
      desc.logic.push ({
        triggers : config.selector+'.$element!onSelected',
        references : refs[0],
        handler : this._onSelected.bind(this)
      });
    };

    TabViewProcessor.prototype._onSelectorActual = function (name, config, tabnames, element, selector) {
      var tabs = Array.prototype.slice.call(arguments, 5),
        actual = arguments[5+tabnames.length];

      if (actual) {
        element.reset();
        var ps = element.get('page');
        element.set('page', null);
        this._onSelected(element, null, ps);
      }else{
        tabs.forEach (lib.doMethod.bind(null, 'set', ['actual', false]));
      }
    };

    TabViewProcessor.prototype._initializeElement = function (name, config, tabnames, element, selector) {
      var tabs, initialized;
      initialized = arguments[arguments.length-1];
      if (!initialized) {
        return;
      }
      tabs = Array.prototype.slice.call(arguments, 5, -1);
      element._doInitializeView (tabnames, tabs, config, selector);
    };

    TabViewProcessor.prototype._onSelected = function (tabview, evnt, page) {
      page = lib.isArray(evnt) && evnt.length>1 ? evnt[1] : page;
      if (page === tabview.get('page') && tabview.getConfigVal ('toggle')){
        tabview.clear();
        return;
      }
      tabview.set('page', page);
    };

    applib.registerPreprocessor ('TabView', TabViewProcessor);
}

module.exports = createTabViewProcessor;
