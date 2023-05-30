(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var lR = ALLEX.execSuite.libRegistry;
lR.register('allex_jqueryelementslib',require('./libindex')(
  ALLEX,
  lR.get('allex_applib'),
  lR.get('allex_applinkinglib'),
  lR.get('allex_templateslitelib'),
  lR.get('allex_htmltemplateslib'),
  lR.get('allex_formvalidationlib')
));

},{"./libindex":25}],2:[function(require,module,exports){
function createCanvas (execlib, applib, templatelib, htmltemplateslib) {

  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function CanvasElement (id, options) {
    DomElement.call(this, id, options);
    this.image = null;
  }
  lib.inherit(CanvasElement, DomElement);
  CanvasElement.prototype.__cleanUp = function () {
    this.image = null;
    DomElement.prototype.__cleanUp.call(this);
  };
  CanvasElement.prototype.set_image = function (img) {
    var cntxt;
    if (!(this.$element && this.$element[0])) {
      return false;
    }
    //this.image = img;
    this.$element.attr('width', img.naturalWidth);
    this.$element.attr('height', img.naturalHeight);
    this.$element.css('width', img.width);
    this.$element.css('height', img.height);
    cntxt = this.get2DContext();
    if (!cntxt) {
      return false;
    }
    cntxt.drawImage(img, 0, 0);
    return true;
  };
  CanvasElement.prototype.get2DContext = function () {
    var ret;
    if (!this.destroyed) {
      return null;
    }
    if (!(this.$element && this.$element[0])) {
      return null;
    }
    ret = this.$element[0].getContext('2d');
    return ret;
  };
  CanvasElement.prototype.htmlTemplateName = 'canvas';
  CanvasElement.prototype.optionsConfigName = 'canvas';

  applib.registerElementType('CanvasElement', CanvasElement);
}
module.exports = createCanvas;

},{}],3:[function(require,module,exports){
function createCheckBoxElement (execlib, applib, templatelib, htmltemplateslib, mixins) {
  'use strict';

  var lib = execlib.lib,
  DomElement = applib.getElementType('DomElement');

function CheckBoxElement (id, options) {
  DomElement.call(this, id, options);
  this.checked = null;
  this.internalChange = false;
}
lib.inherit(CheckBoxElement, DomElement);
CheckBoxElement.prototype.__cleanUp = function () {
  this.internalChange = null;
  this.checked = null;
  DomElement.prototype.__cleanUp.call(this);
};

CheckBoxElement.prototype.get_checked = function () {
  return this.checked;
};
CheckBoxElement.prototype.set_checked = function (chk) {
  this.checked = chk;
  if (this.$element) {
    this.internalChange = true;
    this.$element.prop('checked', !!chk);
    this.internalChange = false;
  }
  return true;
};

CheckBoxElement.prototype.onElementInputChanged = function () {
  if (!this.internalChange) {
    this.set('checked', this.$element.is(':checked'));
  }
};

CheckBoxElement.prototype.initInput = function () {
  this.$element.on('change', this.onElementInputChanged.bind(this));
  this.set('checked', this.getConfigVal('checked'));
};

CheckBoxElement.prototype.postInitializationMethodNames =
      CheckBoxElement.prototype.postInitializationMethodNames.concat('initInput');

CheckBoxElement.prototype.optionsConfigName = 'checkboxinput';
CheckBoxElement.prototype.htmlTemplateName = 'checkboxinput';

applib.registerElementType('CheckBoxElement', CheckBoxElement);
}
module.exports = createCheckBoxElement;
},{}],4:[function(require,module,exports){
function createClickable (execlib, applib, templatelib, htmltemplateslib, mymixins) {
  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement'),
    o = templatelib.override,
    m = htmltemplateslib,
    ClickableMixin = mymixins.Clickable;

  function ClickableElement (id, options) {
    //options.default_markup = options.default_markup || createClickable(options.clickable || {});
    DomElement.call(this, id, options);
    ClickableMixin.call(this, options);
  }
  lib.inherit (ClickableElement, DomElement);
  ClickableMixin.addMethods(ClickableElement);
  ClickableElement.prototype.__cleanUp = function () {
    ClickableMixin.prototype.destroy.call(this);
    DomElement.prototype.__cleanUp.call(this);
  };
  ClickableElement.prototype.set_enabled = function (val) {
    return ClickableMixin.prototype.set_enabled.call(this, val);
  };
  ClickableElement.prototype.get_enabled = function () {
    return ClickableMixin.prototype.get_enabled.call(this);
  };
  ClickableElement.prototype.createDefaultMarkup = function (htmltemplatename, options) {
    return DomElement.prototype.createDefaultMarkup.call(this, options.type || 'button', options);
  };
  ClickableElement.prototype.optionsConfigName = 'clickable';

  applib.registerElementType('ClickableElement', ClickableElement);
}

module.exports = createClickable;

},{}],5:[function(require,module,exports){
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
    DataElementFollowerMixin.prototype.destroy.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };

  DataAwareChildElement.prototype.postInitializationMethodNames = WebElement.prototype.postInitializationMethodNames.concat('startListeningToParentData');

  applib.registerElementType ('DataAwareChild',DataAwareChildElement);

}

module.exports = createDataAwareChildElement;

},{}],6:[function(require,module,exports){
function createDataAwareElement (execlib, DataElementMixIn, applib) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement');

  function DataAwareElement (id, options) {
    WebElement.call(this, id, options);
    DataElementMixIn.call(this);
  }
  lib.inherit (DataAwareElement, WebElement);
  DataElementMixIn.addMethods (DataAwareElement);

  DataAwareElement.prototype.__cleanUp = function () {
    DataElementMixIn.prototype.__cleanUp.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };

  DataAwareElement.prototype.set_data = function (data) {
    var ret = DataElementMixIn.prototype.set_data.call(this, data),
      dkn = this.getConfigVal('datakeyname');
    if (ret && this.$element && dkn) {
      this.$element.data(dkn, data);
    }
    return ret;
  };
  DataAwareElement.prototype.onNullData = function (isnull) {
    //console.log(this.constructor.name, 'got null data', isnull);
    jQueryshowhide(this.$element, this.getConfigVal('nulldata_finder'), isnull);
  };
  DataAwareElement.prototype.onEmptyDataArray = function (isempty) {
    //console.log(this.constructor.name, 'got empty data', isempty);
    jQueryshowhide(this.$element, this.getConfigVal('emptydataarray_finder'), isempty);
  };
  function jQueryshowhide (elem, finderobj, doshow) {
    var finder, showargs, hideargs, el;
    if (!(elem && finderobj)) {
      return;
    }
    if (lib.isString(finderobj)) {
      finder = finderobj;
      showargs = [];
      hideargs = [];
    } else {
      finder = finderobj.finder;
      showargs = finderobj.showargs;
      hideargs = finderobj.hideargs;
    }
    el = elem.find(finder);
    el[doshow ? 'show' : 'hide'].apply(el, doshow ? showargs : hideargs);
  }
  DataAwareElement.prototype.getDefaultMarkup = function () {
    var ret = WebElement.prototype.getDefaultMarkup.call(this), dm;
    if (lib.isVal(ret)) {
      return ret;
    }
    dm = this.getConfigVal('data_markup');
    if (!lib.isVal(dm)) {
      return ret;
    }
    return this.produceDataMarkup(dm, this.get('data'));
  };
  DataAwareElement.prototype.preInitializationMethodNames = WebElement.prototype.preInitializationMethodNames.concat('preInitializeData');
  DataAwareElement.prototype.postInitializationMethodNames = WebElement.prototype.postInitializationMethodNames.concat('postInitializeData');

  applib.registerElementType ('DataAwareElement',DataAwareElement);

}

module.exports = createDataAwareElement;

},{}],7:[function(require,module,exports){
function createDivElement (execlib, applib, templatelib, htmltemplateslib) {
  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement');

  function DivElement (id, options) {
    DomElement.call(this, id, options);
  }
  lib.inherit(DivElement, DomElement);
  DivElement.prototype.optionsConfigName = 'div';
  DivElement.prototype.htmlTemplateName = 'div';

  applib.registerElementType('DivElement', DivElement);
}
module.exports = createDivElement;

},{}],8:[function(require,module,exports){
function createDomElement (execlib, applib, templatelib, htmltemplateslib) {

  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function DomElement (id, options) {
    options.default_markup = options.default_markup || this.createDefaultMarkup(
      this.htmlTemplateName,
      this.configOptionsForDefaultMarkup(options)
    );
    WebElement.call(this, id, options);
  }
  lib.inherit(DomElement, WebElement);
  DomElement.prototype.configOptionsForDefaultMarkup = function (options) {
    var useroptions = options && lib.isVal(options) ? options[this.optionsConfigName] || {} : {};
    return lib.extend({}, this.defaultOptionsForMarkup(), useroptions);
  };
  DomElement.prototype.defaultOptionsForMarkup = function () {
    return {};
  };
  DomElement.prototype.initializeOnDomElement = function () {
  };
  DomElement.prototype.createDefaultMarkup = function (htmltemplatename, options) {
    return o( m[htmltemplatename],
      'CLASS', options.class || '',
      'ATTRS', options.attrs || '',
      'TARGET', options.target || '#',
      'CONTENTS', options.text || ''
    );
  };

  DomElement.prototype.postInitializationMethodNames = WebElement.prototype.postInitializationMethodNames.concat('initializeOnDomElement');

  applib.registerElementType('DomElement', DomElement);
}
module.exports = createDomElement;

},{}],9:[function(require,module,exports){
function createFileInputElement (execlib, applib, templateslitelib, htmltemplateslib, jobs) {
  'use strict';

  var DomElement = applib.getElementType('DomElement'),
    lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    o = templateslitelib.override,
    p = templateslitelib.process,
    m = htmltemplateslib;

  function FileInputElement (id, options) {
    //options.default_markup = options.default_markup || createDefaultMarkup(options);
    DomElement.call(this, id, options);
    this.gotFiles = new lib.HookCollection();
    this.files = null;
    this.$fileinputelement = null;
  }
  lib.inherit(FileInputElement, DomElement);
  FileInputElement.prototype.__cleanUp = function () {
    if (this.$fileinputelement) {
      this.$fileinputelement.onchange = null;
    }
    this.$fileinputelement = null;
    if (lib.isArray(this.files)) {
      lib.arryDestroyAll(this.files);
    }
    this.files = null;
    if (this.gotFiles) {
      this.gotFiles.destroy();
    }
    this.gotFiles = null;
    DomElement.prototype.__cleanUp.call(this);
  };
  FileInputElement.prototype.initializeOnDomElement = function () {
    this.$fileinputelement = this.$element.find(':input')[0];
    if (this.$fileinputelement) {
      this.$fileinputelement.onchange = this.onFileChanged.bind(this);
      if (this.getConfigVal('cursor')) {
        this.$element.find('label').css('cursor', this.getConfigVal('cursor'));
      }
    }
  };
  FileInputElement.prototype.set_files = function (files) {
    if (lib.isArray(this.files)) {
      lib.arryDestroyAll(this.files);
    }
    this.gotFiles.fire(files);
    this.files = files;
    return true;
  };
  FileInputElement.prototype.onFileChanged = function (evnt) {
    var files;
    evnt.preventDefault();
    evnt.stopPropagation();
    if (!this.$fileinputelement) {
      return;
    }
    files = Array.prototype.slice.call(this.$fileinputelement.files);
    q.all(files.map(this.readFile.bind(this))).then(
      this.set.bind(this, 'files'),
      console.error.bind(console, 'readFile Error')
    );
  };
  FileInputElement.prototype.resetInput = function () {
    var evnt;
    if (!this.destroyed) {
      return;
    }
    this.$fileinputelement.value = null;
    evnt = new Event('change');
    this.$fileinputelement.dispatchEvent(evnt);
  };
  FileInputElement.prototype.readFile = function (file) {
    return (new jobs.ReadFileJob(this, file)).go();
  };
  FileInputElement.prototype.readImage = function (result, file) {
    var reader = new FileReader(), _r = result;
    reader.readAsDataURL(file);
  };
  FileInputElement.prototype.optionsConfigName = 'fileinput';
  FileInputElement.prototype.createDefaultMarkup = function (htmltemplatename, options) {
    return o(m.div,
      'CONTENTS', 
        o( m.label,
        'CONTENTS', [o(
          m.fileinput,
          'ATTRS', 'style="display:none;"' + (options.attrs ? ' '+options.attrs : ''),
          'NAME', options.inputname || 'file'
        ), options.label || 'File'
        ]
      )
    );
  };

  applib.registerElementType('FileInputElement', FileInputElement);
}
module.exports = createFileInputElement;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
function createImg (execlib, applib, templatelib, htmltemplateslib) {

  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function ImgElement (id, options) {
    DomElement.call(this, id, options);
    this.src = null;
    this.imgLoaded = new lib.HookCollection();
    this.imgError = new lib.HookCollection();
    this.naturalHeight = null;
    this.naturalWidth = null;
    this.naturalSize = null;
    this.onImgLoadeder = this.onImgLoaded.bind(this);
    this.onImgErrorer = this.onImgError.bind(this);
  }
  lib.inherit(ImgElement, DomElement);
  ImgElement.prototype.__cleanUp = function () {
    if (this.$element) {
      this.$element.off('load', this.onImgLoadeder);
      this.$element.off('error', this.onImgErrorer);
    }
    this.onImgLoadeder = null;
    this.onImgErrorer = null;
    this.naturalSize = null;
    this.naturalWidth = null;
    this.naturalHeight = null;
    if (this.imgError) {
      this.imgError.destroy();
    }
    this.imgError = null;
    if (this.imgLoaded) {
      this.imgLoaded.destroy();
    }
    this.imgLoaded = null;
    this.src = null;
    DomElement.prototype.__cleanUp.call(this);
  };
  ImgElement.prototype.set_src = function (src) {
    if (!this.destroyed) {
      return false;
    }
    this.src = src;
    if (this.$element[0]) {
      this.$element[0].src = src;
    }
    return true;
  };
  ImgElement.prototype.initializeOnDomElement = function () {
    this.$element.on('load', this.onImgLoadeder);
    this.$element.on('error', this.onImgErrorer);
    if (this.getConfigVal('img.src')) {
      this.set('src', this.getConfigVal('img.src'));
    }
  };
  ImgElement.prototype.onImgLoaded = function (evnt_ignored) {
    var el;
    if (!this.destroyed) {
      return;
    }
    el = this.$element[0];
    this.imgLoaded.fire(el);
    this.set('naturalHeight', el.naturalHeight);
    this.set('naturalWidth', el.naturalWidth);
    this.set('naturalSize', {w: el.naturalWidth, h: el.naturalHeight});
  };
  ImgElement.prototype.onImgError = function (evnt_ignored) {
    var el;
    if (!this.destroyed) {
      return;
    }
    el = this.$element[0];
    this.set('naturalHeight', el.naturalHeight);
    this.set('naturalWidth', el.naturalWidth);
    this.set('naturalSize', {w: el.naturalWidth, h: el.naturalHeight});
  };
  ImgElement.prototype.htmlTemplateName = 'img';
  ImgElement.prototype.optionsConfigName = 'img';

  applib.registerElementType('ImgElement', ImgElement);
}
module.exports = createImg;

},{}],12:[function(require,module,exports){
function createElements (execlib, applib, templatelib, htmltemplateslib, formvalidationlib, mixins) {
  'use strict';

  var jobs = require('./jobs')(execlib.lib);

  require('./webelementcreator')(execlib, applib, templatelib);
  require('./dataawareelementcreator')(execlib, applib.mixins.DataElementMixin, applib);
  require('./dataawarechildcreator')(execlib, applib.mixins.DataElementFollowerMixin, applib);
  require('./fromdatacreatorcreator')(execlib, applib, mixins);

  require('./domelementcreator')(execlib, applib, templatelib, htmltemplateslib);
  require('./divcreator')(execlib, applib, templatelib, htmltemplateslib);
  require('./canvascreator')(execlib, applib, templatelib, htmltemplateslib);
  require('./imgcreator')(execlib, applib, templatelib, htmltemplateslib);
  require('./inputcreator')(execlib, applib, templatelib, htmltemplateslib, jobs);
  require('./fileinputcreator')(execlib, applib, templatelib, htmltemplateslib, jobs);
  require('./clickablecreator')(execlib, applib, templatelib, htmltemplateslib, mixins);
  require('./checkboxcreator')(execlib, applib, templatelib, htmltemplateslib, mixins);

  require('./selectcreator')(execlib, applib, templatelib, htmltemplateslib, mixins);
  require('./nonbiunivocalselectcreator')(execlib, applib, templatelib, htmltemplateslib, mixins);

  require('./splashcreator')(execlib, applib, templatelib, htmltemplateslib);
}

module.exports = createElements;

},{"./canvascreator":2,"./checkboxcreator":3,"./clickablecreator":4,"./dataawarechildcreator":5,"./dataawareelementcreator":6,"./divcreator":7,"./domelementcreator":8,"./fileinputcreator":9,"./fromdatacreatorcreator":10,"./imgcreator":11,"./inputcreator":13,"./jobs":14,"./nonbiunivocalselectcreator":16,"./selectcreator":17,"./splashcreator":18,"./webelementcreator":19}],13:[function(require,module,exports){
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
    var confval = this.getConfigVal('value');
    if (lib.isVal(confval)) {
      this.set('value', confval);
    }
    //this.$element.on('keyup', this.onInputChanger);
    this.$element.on('input', this.onInputChanger);
  };

  InputElement.prototype.get_value = function () {
    return this.value;
  };
  InputElement.prototype.set_value = function (val) {
    this.value = this.valueForMe(val);
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

  InputElement.prototype.valueForMe = function (val) {
    return val;
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
  NumberInputElement.prototype.valueForMe = function (val) {
    return parseFloat(val);
  };
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
},{}],14:[function(require,module,exports){
function createJobs (lib) {
  'use strict';

  var ret = {};

  require('./readfilecreator')(lib, ret);

  return ret;
}
module.exports = createJobs;

},{"./readfilecreator":15}],15:[function(require,module,exports){
function createReadFileJob (lib, mylib) {
  'use strict';

  var JobOnDestroyable = lib.qlib.JobOnDestroyable;

  function humanReadableFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }

  function FileRepresentation (binary, file, evnt) {
    this.binary = binary;
    this.name = file.name;
    this.lastModified = file.lastModified;
    this.size = file.size;
    this.humanReadableSize = humanReadableFileSize(file.size);
    this.type = file.type;
    this.contents = (evnt && evnt.target && evnt.target.result) ? evnt.target.result : null;
  }
  FileRepresentation.prototype.destroy = function () {
    this.contents = null;
    this.type = null;
    this.humanReadableSize = null;
    this.size = null;
    this.lastModified = null;
    this.name = null;
    this.binary = null;
  };
  FileRepresentation.prototype.lineCount = function () {
    if (this.binary) {
      return null;
    }
    return this.contents.split('\n').length;
  }
  FileRepresentation.prototype.lines = function () {

  };

  function ReadFileJob (elem, file, defer) {
    JobOnDestroyable.call(this, elem, defer);
    this.file = file;
    this.reader = new FileReader();
    this.binary = null;
    this.reader.onload = this.onLoaded.bind(this);
    this.reader.onerror = this.reject.bind(this);
    this.reader.onprogress = this.onProgress.bind(this);
  }
  lib.inherit(ReadFileJob, JobOnDestroyable);
  ReadFileJob.prototype.destroy = function () {
    this.binary = null;
    if (this.reader) {
      this.reader.onload = null;
      this.reader.onerror = null;
    }
    this.reader = null;
    this.file = null;
    JobOnDestroyable.prototype.destroy.call(this);
  };
  ReadFileJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    lib.runNext(this.init.bind(this));
    return ok.val;
  };
  ReadFileJob.prototype.init = function () {
    if (!this.file) {
      this.reject(new lib.Error('NO_FILE_TO_READ', 'There is no file to read'));
      return;
    }
    if (this.file.type.match('image.*')) {
      this.binary = true;
      this.reader.readAsDataURL(this.file);
      return;
    }
    this.binary = false;
    this.reader.readAsText(this.file, 'UTF-8');
  };
  ReadFileJob.prototype.onLoaded = function (evnt) {
    if (!this.okToProceed()) {
      return;
    }
    this.resolve(new FileRepresentation(this.binary, this.file, evnt));
  };
  ReadFileJob.prototype.onProgress = function (evnt) {
    if (!(evnt && evnt.lengthComputable)) {
      return;
    }
    this.notify(Math.round(evnt.loaded/evnt.total * 10000)/100);
  };

  mylib.ReadFileJob = ReadFileJob;
}
module.exports = createReadFileJob;

},{}],16:[function(require,module,exports){
function createNonBiunivocalSelect (execlib, applib, templatelib, htmltemplateslib, mixins) {
  'use strict';

  var lib = execlib.lib;

  var SelectElement = applib.getElementType('SelectElement');

  function NonBiunivocalSelectElement (id, options) {
    SelectElement.call(this, id, options);
  }
  lib.inherit(NonBiunivocalSelectElement, SelectElement);
  NonBiunivocalSelectElement.prototype.getTitleValue = function (optiondata) {
    var titlefields = this.getConfigVal('titlefields'), ret;
    if (!lib.isArray(titlefields)) {
      return SelectElement.prototype.getTitleValue.call(thid, optiondata);
    }
    ret = titlefields.reduce(this.titleReducer.bind(this, optiondata), '');
    optiondata = null;
    return ret;
  };

  NonBiunivocalSelectElement.prototype.titleReducer = function (optiondata, result, titleelement) {
    if (!lib.isString(titleelement)) {
      return result;
    }
    return lib.joinStringsWith(result, valueFromColonSplits(optiondata, titleelement.split(':')), this.getConfigVal('titlejoiner') || ',');
  };

  function valueFromColonSplits (optiondata, splits) {
    var val = optiondata[splits[0]];
    if (splits.length<2) {
      return val+'';
    }
    val = modify(val, splits[1], 'pre');
    val = modify(val, splits[1], 'post');
    return val+'';
  }
  function modify(value, thingy, direction) {
    var intvalue = parseInt(thingy);
    if (!lib.isNumber(intvalue)) {
      return '';
    }
    return modifiers[direction+'pendToLength'](value+'', lib.isNumber(value) ? '0' : ' ', intvalue);
  }
  var modifiers = {
    prependToLength: function (str, thingy, len) {
      while(str.length < len) {
        str = thingy+str;
      }
      return str;
    },
    postpendToLength: function (str, thingy, len) {
      while(str.length < len) {
        str = str+thingy;
      }
      return str;
    }
  };

  applib.registerElementType('NonBiunivocalSelectElement', NonBiunivocalSelectElement);
}
module.exports = createNonBiunivocalSelect;
},{}],17:[function(require,module,exports){
function createSelect (execlib, applib, templatelib, htmltemplateslib) {
  'use strict';

  var lib = execlib.lib,
    DomElement = applib.getElementType('DomElement'),
    o = templatelib.override,
    m = htmltemplateslib;

  function SelectElement (id, options) {
    DomElement.call(this, id, options);
    this.options = null;
    this.optionsMap = new lib.Map();
    this.selectedValue = null;
  }
  lib.inherit(SelectElement, DomElement);
  SelectElement.prototype.__cleanUp = function () {
    this.selectedValue = null;
    if (this.optionsMap) {
      this.optionsMap.destroy();
    }
    this.optionsMap = null;
    this.options = null;
    DomElement.prototype.__cleanUp.call(this);
  };
  SelectElement.prototype.initializeOnDomElement = function () {
    this.$element.on('change', this.reportChanged.bind(this));
    this.set('options', this.getConfigVal('options'));
  };
  SelectElement.prototype.reportChanged = function (ev) {
    var selected = this.$element.find('option:selected'),
      t = selected.text(),
      val = this.optionsMap.get(t);
    this.set('selectedValue', val);
  };
  SelectElement.prototype.set_selectedValue = function (selval) {
    var opt;
    if (!this.optionsMap) {
      this.set('value', selval);
      this.selectedValue = selval;
      return true;
    }
    var s = this.optionsMap.traverseConditionally(function (val, name) {
      if (lib.isEqual(val,selval)) {
        return name;
      }
    });
    if (!s) {
      this.selectedValue = null;
      return false;
    }
    this.$element.find('option').each(function () {
      var myopt = jQuery(this);
      if (myopt.text() == s) {
        opt = myopt;
      }
    });
    if (opt) {
      if (!opt.is(':selected')) {
        this.$element.val(opt.val());
      }
    }
    this.selectedValue = selval;
    return true;
  };
  SelectElement.prototype.set_options = function (data) {
    if (!this.$element) {
      return false;
    }
    this.optionsMap.purge();
    this.$element.find('option').remove();
    if (lib.isArray(data)) {
      data.forEach(this.setSingleOption.bind(this));
    }
    this.options = data;
    this.reportChanged();
    return true;
  };
  SelectElement.prototype.setSingleOption = function (optiondata) {
    this.$element.append(this.singleOptionMarkup(optiondata));
  };
  SelectElement.prototype.singleOptionMarkup = function (optiondata) {
    var titlevalue, valuevalue, optionscheck;
    titlevalue = this.getTitleValue(optiondata);
    if (lib.isVal(titlevalue)) {
      valuevalue = this.getValueValue(optiondata);
      optionscheck = this.optionsMap.get(titlevalue);
      if (lib.isVal(optionscheck)) {
        console.log(this.constructor.name, this.id, 'has something on', titlevalue, optionscheck);
        console.log('Should have been', valuevalue);
        return;
      }
      this.optionsMap.add(titlevalue, valuevalue);
      return o(m.option, 'CONTENTS', titlevalue);
    }
    if (!lib.isString(optiondata)) {
      console.error('cannot set select option', optiondata, 'because it is not a string');
      return;
    }
    return o(m.option,
      'ATTRS', 'value="'+optiondata+'"',
      'CONTENTS', optiondata
    );
  };
  SelectElement.prototype.getTitleValue = function (optiondata) {
    var titlepath = this.getConfigVal('titlepath');
    if (!titlepath) {
      return null;
    }
    return optiondata[titlepath];
  };
  SelectElement.prototype.getValueValue = function (optiondata) {
    var valuepath = this.getConfigVal('valuepath'), ret;
    if (!valuepath) {
      return optiondata;
    }
    if (lib.isString(valuepath)) {
      return optiondata[valuepath];
    }
    if (lib.isArray(valuepath)) {
      ret = valuepath.reduce(function (res, propname) {
        res[propname] = optiondata[propname];
        return res;
      }, {});
      optiondata = null;
      return ret;
    }
    return optiondata;
  };
  SelectElement.prototype.htmlTemplateName = 'select';
  SelectElement.prototype.optionsConfigName = 'select';

  applib.registerElementType('SelectElement', SelectElement);
}
module.exports = createSelect;

},{}],18:[function(require,module,exports){
function createSplashElement (execlib, applib, templatelib, htmltemplateslib) {
  'use strict';

  var lib = execlib.lib,
    DivElement = applib.getElementType('DivElement');

  function SplashElement (id, options) {
    DivElement.call(this, id, options);
  }
  lib.inherit(SplashElement, DivElement);
  SplashElement.prototype.set_actual = function (actual) {
    var target;
    if (actual) {
      lib.runNext(this.set.bind(this, 'actual', false), this.getConfigVal('timeout') || lib.intervals.Second);
    }
    return DivElement.prototype.set_actual.call(this, actual);
  };

  applib.registerElementType('SplashElement', SplashElement);
}
module.exports = createSplashElement;

},{}],19:[function(require,module,exports){
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
  //checked end

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

},{}],20:[function(require,module,exports){
function createHandlers (execlib, applib, linkinglib) {
  'use strict';

  var lib = execlib.lib,
    EventEmitterHandler = linkinglib.eventEmitterHandlingRegistry.EventEmitterHandler,
    PropertyTargetHandler = linkinglib.propertyTargetHandlingRegistry.PropertyTargetHandler;
  
  function JQueryChangeEventEmitterHandler (eventemitter, eventname) {
    EventEmitterHandler.call(this, eventemitter, eventname); 
    this.name = eventname;
    this.listener = null;
  }
  lib.inherit(JQueryChangeEventEmitterHandler, EventEmitterHandler);
  JQueryChangeEventEmitterHandler.prototype.destroy = function () {
    if (this.listener) { 
      this.emitter.off(this.name, this.listener);
    }
    this.listener = null;
    this.name = null;
    EventEmitterHandler.prototype.destroy.call(this);
  };
  JQueryChangeEventEmitterHandler.prototype.raiseEvent = function () {
    this.emitter.trigger.call(this.emitter, this.name, Array.prototype.slice.call(arguments));
  };    
  JQueryChangeEventEmitterHandler.prototype.listenToEvent = function (cb) {
    if (!this.listener) {
      this.listener = cb;
      if (this.name === 'change') {
        this.emitter.on(this.name, this._handleChange.bind(this, cb));
      }else{
        this.emitter.on(this.name, cb);
      }
      return this;
    } 
  };
  JQueryChangeEventEmitterHandler.prototype._handleChange = function (cb, evnt) {
    cb(jQuery(evnt.target).val());
  };

  JQueryChangeEventEmitterHandler.recognizer = function (emitterwithname) {
    if (emitterwithname &&
      emitterwithname.emitter &&
      emitterwithname.emitter.is &&
      (emitterwithname.emitter.is('input')) &&
      lib.isFunction(emitterwithname.emitter.on) &&
      lib.isFunction(emitterwithname.emitter.off) &&
      lib.isFunction(emitterwithname.emitter.bind) &&
      lib.isFunction(emitterwithname.emitter.unbind) &&
      lib.isFunction(emitterwithname.emitter.trigger)) {
      return JQueryChangeEventEmitterHandler;
    }
  };
  linkinglib.eventEmitterHandlingRegistry.register(JQueryChangeEventEmitterHandler.recognizer);

 
  function JQueryEventEmitterHandler (eventemitter, eventname) {
    EventEmitterHandler.call(this, eventemitter, eventname); 
    this.name = eventname;
    this.listener = null;
  }
  lib.inherit(JQueryEventEmitterHandler, EventEmitterHandler);
  JQueryEventEmitterHandler.prototype.destroy = function () {
    if (this.listener) { 
      this.emitter.off(this.name, this.listener);
    }
    this.listener = null;
    this.name = null;
    EventEmitterHandler.prototype.destroy.call(this);
  };
  JQueryEventEmitterHandler.prototype.raiseEvent = function () {
    this.emitter.trigger.call(this.emitter, this.name, Array.prototype.slice.call(arguments));
  };    

  function jqueryEventArgsPacker (cb) {
    var args = Array.prototype.slice.call(arguments, 1);
    cb(args);
  }

  JQueryEventEmitterHandler.prototype.listenToEvent = function (cb) {
    if (!this.listener) {
      this.listener = cb;
      //console.log('subscribing ...', this.name, this.emitter.attr('id'));
      this.emitter.on(this.name, jqueryEventArgsPacker.bind(null, cb));
      return this;
    } 
  };    
  JQueryEventEmitterHandler.recognizer = function (emitterwithname) {
    if (emitterwithname &&
      emitterwithname.emitter &&
      lib.isFunction(emitterwithname.emitter.on) &&
      lib.isFunction(emitterwithname.emitter.off) &&
      lib.isFunction(emitterwithname.emitter.bind) &&
      lib.isFunction(emitterwithname.emitter.unbind) &&
      lib.isFunction(emitterwithname.emitter.trigger)) {

      return JQueryEventEmitterHandler;
    }
  };
  linkinglib.eventEmitterHandlingRegistry.register(JQueryEventEmitterHandler.recognizer);

 
  function JQueryPropertyTargetHandler (propertycarrier, propertyname) {
    PropertyTargetHandler.call(this, propertycarrier, propertyname); 
    var sp = propertyname.split('.');
    this.method = sp[0] === 'class' ? 'addClass' : sp[0];
    this.removeMethod = this._chooseRemover();
    this.prop = sp[1];
  }

  lib.inherit(JQueryPropertyTargetHandler, PropertyTargetHandler);
  JQueryPropertyTargetHandler.prototype.destroy = function () {
    this.removeMethod = null;
    this.method = null;
    this.prop = null;
    this.method = null;
    PropertyTargetHandler.prototype.destroy.call(this);
  };

  JQueryPropertyTargetHandler.prototype._chooseRemover = function () {
    switch (this.method) {
      case 'attr': return 'removeAttr';
      case 'class':return 'removeClass';
      case 'prop': return 'removeProp';
      case 'css' : return 'css';
    }
  };

  JQueryPropertyTargetHandler.prototype.handle = function (val) {
    //console.log(this.carrier, this.method, this.prop, val);
    this.carrier[lib.isUndef(val) ? this.removeMethod : this.method](this.prop, val);
  };
  
  JQueryPropertyTargetHandler.recognizer = function (carrierwithname) {
    var sp = carrierwithname.name.split('.');
    if (!(sp[0] === 'attr' || sp[0] === 'css' || sp[0] === 'prop' || sp[0] === 'class')) return;

    if (carrierwithname &&
      carrierwithname.carrier &&
      lib.isFunction(carrierwithname.carrier.on) &&
      lib.isFunction(carrierwithname.carrier.off) &&
      lib.isFunction(carrierwithname.carrier.bind) &&
      lib.isFunction(carrierwithname.carrier.unbind) &&
      lib.isFunction(carrierwithname.carrier.trigger)) {
      return JQueryPropertyTargetHandler;
    }
  };
  linkinglib.propertyTargetHandlingRegistry.register(JQueryPropertyTargetHandler.recognizer);

  function JQueryDefinedPropertyTargetHandler (propertycarrier) {
    PropertyTargetHandler.call(this, propertycarrier, this.propertyName);
  }
  lib.inherit(JQueryDefinedPropertyTargetHandler, PropertyTargetHandler);
  JQueryDefinedPropertyTargetHandler.prototype.handle = function (val) {
    this.carrier[this.propertyName](val);
  };

  function JQueryValTargetHandler (propertycarrier) {
    JQueryDefinedPropertyTargetHandler.call(this, propertycarrier);
  }
  lib.inherit(JQueryValTargetHandler, JQueryDefinedPropertyTargetHandler);
  JQueryValTargetHandler.prototype.propertyName = 'val';
  JQueryValTargetHandler.recognizer = function (carrierwithname) {
    if (carrierwithname.name !== 'val') return;
    return JQueryValTargetHandler;
  };
  linkinglib.propertyTargetHandlingRegistry.register(JQueryValTargetHandler.recognizer);

  function JQueryTextTargetHandler (propertycarrier) {
    JQueryDefinedPropertyTargetHandler.call(this, propertycarrier);
  }
  lib.inherit(JQueryTextTargetHandler, JQueryDefinedPropertyTargetHandler);
  JQueryTextTargetHandler.prototype.propertyName = 'text';
  JQueryTextTargetHandler.recognizer = function (carrierwithname) {
    if (carrierwithname.name !== 'text') return;
    return JQueryTextTargetHandler;
  };
  linkinglib.propertyTargetHandlingRegistry.register(JQueryTextTargetHandler.recognizer);

  function JQueryHtmlTargetHandler (propertycarrier) {
    JQueryDefinedPropertyTargetHandler.call(this, propertycarrier);
  }
  lib.inherit(JQueryHtmlTargetHandler, JQueryDefinedPropertyTargetHandler);
  JQueryHtmlTargetHandler.prototype.propertyName = 'html';
  JQueryHtmlTargetHandler.recognizer = function (carrierwithname) {
    if (carrierwithname.name !== 'html') return;
    return JQueryHtmlTargetHandler;
  };
  linkinglib.propertyTargetHandlingRegistry.register(JQueryHtmlTargetHandler.recognizer);
}

module.exports = createHandlers;

},{}],21:[function(require,module,exports){
function createHelpers (execlib) {
  'use strict';

  var ret = {};

  require('./inputlistenercreator')(execlib.lib, ret);
  require('./jquerytraversalscreator')(execlib.lib, ret);

  return ret;
}
module.exports = createHelpers;

},{"./inputlistenercreator":22,"./jquerytraversalscreator":23}],22:[function(require,module,exports){
function createInputListener (lib, mylib) {
  'use strict';

  //input is a jQuery object
  function InputListener (input, changecallback) {
    this.input = input;
    this.cb = changecallback;
    this.onchanger = this.onChange.bind(this);
    this.onvirtchanger = this.onVirtualChange.bind(this);
    this.lastknownval = null;
    input.on('keyup', this.onchanger);
    input.on('paste', this.onvirtchanger);
    input.on('cut', this.onvirtchanger);
  }
  InputListener.prototype.destroy = function () {
    this.lastknownval = null;
    if (this.onvirtchanger && this.input) {
      this.input.off('cut', this.onvirtchanger);
      this.input.off('paste', this.onvirtchanger);
    }
    this.onvirtchanger = null;
    if (this.onchanger && this.input) {
      this.input.off('keyup', this.onchanger);
    }
    this.onchanger = null;
    this.cb = null;
    this.input = null;
  };
  InputListener.prototype.onChange = function (ev_ignored) {
    if (this.input.val() === this.lastknownval) {
      return;
    }
    this.lastknownval = null;
    if (lib.isFunction(this.cb)) {
      this.cb();
    }
  };
  InputListener.prototype.onVirtualChange = function (ev) {
    this.lastknownval = this.input.val();
    lib.runNext(this.onChange.bind(this), 10);
  };

  mylib.InputListener = InputListener;
}
module.exports = createInputListener;

},{}],23:[function(require,module,exports){
function createjQueryTraversals (lib, mylib) {
  'use strict';

  function jQueryForEachCber (cb, index, elem) {
    cb(elem, index);
  }
  function jQueryForEach (elem, finder, cb) {
    if (!lib.isFunction(cb)) {
      return;
    }
    elem.find(finder).each(jQueryForEachCber.bind(null, cb));
    cb = null;
  }
  mylib.jQueryForEach = jQueryForEach;

  function jQueryReducer (rdcr, cb, elem, index) {
    rdcr.result = cb(rdcr.result, elem, index);
  }
  function jQueryReduce (elem, finder, cb, seed) {
    var rdcr, ret;
    if (!lib.isFunction(cb)) {
      return seed;
    }
    rdcr = {result: seed};
    jQueryForEach(elem, finder, jQueryReducer.bind(null, rdcr, cb));
    ret = rdcr.result;
    rdcr = null;
    return ret;
  }
  mylib.jQueryReduce = jQueryReduce;

  function jQuerySomer (cb, res, elem) {
    if (res) {
      return res;
    }
    return cb(elem);
  }
  function jQuerySome (elem, finder, cb) {
    if (!lib.isFunction(cb)) {
      return false;
    }
    var ret = jQueryReduce(elem, finder, jQuerySomer.bind(null, cb), false);
    cb = null;
    return ret;
  }
  mylib.jQuerySome = jQuerySome;
  
  function jQueryEveryer (cb, res, elem) {
    if (!res) {
      return res;
    }
    return cb(elem);
  }
  function jQueryEvery (elem, finder, cb) {
    if (!lib.isFunction(cb)) {
      return false;
    }
    var ret = jQueryReduce(elem, finder, jQueryEveryer.bind(null, cb), true);
    cb = null;
    return ret;
  }
  mylib.jQueryEvery = jQueryEvery;

  function jQueryPicker (critcb, picker, elem, index) {
    if (critcb(elem, index)) {
      picker.pick = elem;
      return true;
    }
    return false;
  }
  function jQueryPick (elem, finder, critcb) {
    if (!critcb) {
      return;
    }
    var picker, ret;
    picker = {pick: void 0};
    jQuerySome(elem, finder, jQueryPicker.bind(null, critcb, picker));
    ret = picker.pick;
    picker = null;
    critcb = null;
    return ret;
  }
  mylib.jQueryPick = jQueryPick;
}
module.exports = createjQueryTraversals;
},{}],24:[function(require,module,exports){
function createJQueryCreate (execlib, templatelib) {
  'use stict';

  var lib = execlib.lib;

  function jQueryCreate (parnt, childtemplate) {
    var parentelem = lib.isString(parnt) ? jQuery(parnt) : parnt, childelem;
    if (!(parentelem && lib.isFunction(parentelem.append))) {
      console.error(parnt, 'could not be resolved as a jQuery element');
      throw new Error('jQueryCreate could not resolve parent');
    }
    childelem = jQuery(templatelib.process(childtemplate));
    parentelem.append(childelem);
    return childelem;
  }

  return jQueryCreate;
}

module.exports = createJQueryCreate;

},{}],25:[function(require,module,exports){
/**
 * A library that uses {@link allex://allex_applib} and jQuery
 * to build the basic Web App functionality.
 *
 * Check the tutorials
 * - {@tutorial simplest}
 *
 * to gain a better insight in how App works.
 *
 * @namespace allex_jqueryelementslib
 */
function createLib (execlib, applib, linkinglib, templatelib, htmltemplateslib, formvalidationlib) {
  'use strict';

  var routerlib = require('./misc/router')(execlib),
    jQueryCreate = require('./jquerycreatecreator')(execlib, templatelib),
    mixins = require('./mixins')(execlib),
    helpers = require('./helpers')(execlib);

  require('./handlers')(execlib, applib, linkinglib);

  require('./resources/fontloadercreator')(execlib, applib);
  require('./resources/urlgeneratorcreator')(execlib, applib);
  require('./resources/throbbercreator')(execlib, applib);

  require('./elements')(execlib, applib, templatelib, htmltemplateslib, formvalidationlib, mixins);

  require('./modifiers/selectorcreator')(execlib, applib);
  require('./modifiers/routecontrollercreator')(execlib, applib);

  require('./preprocessors/keyboardcreator')(execlib, applib);
  require('./preprocessors/dataviewcreator')(execlib, applib);
  require('./preprocessors/logoutdeactivatorcreator')(execlib, applib);
  require('./preprocessors/pipelinecreator')(execlib, applib);
  require('./preprocessors/roleroutercreator')(execlib, routerlib, applib);
  require('./preprocessors/tabviewcreator')(execlib, routerlib, applib, templatelib);

  return {
    jQueryCreate: jQueryCreate,
    RouterMixin: routerlib.RouterMixin,
    Router: routerlib.Router,
    RoleRouter: routerlib.RoleRouter,
    helpers: helpers,
    mixins: mixins
  };
}

module.exports = createLib;

},{"./elements":12,"./handlers":20,"./helpers":21,"./jquerycreatecreator":24,"./misc/router":26,"./mixins":28,"./modifiers/routecontrollercreator":32,"./modifiers/selectorcreator":33,"./preprocessors/dataviewcreator":34,"./preprocessors/keyboardcreator":35,"./preprocessors/logoutdeactivatorcreator":36,"./preprocessors/pipelinecreator":37,"./preprocessors/roleroutercreator":38,"./preprocessors/tabviewcreator":39,"./resources/fontloadercreator":40,"./resources/throbbercreator":41,"./resources/urlgeneratorcreator":42}],26:[function(require,module,exports){
function createRouterLib (allex) {
  'use strict';

  var lib = allex.lib,
    NO_ROLE_PAGE = '#norole#page#',
    CLDestroyable = lib.CLDestroyable;

  function Page (element, onActivated, onDeactivated, router) {
    this.element = element;
    this.onActivated = onActivated;
    this.onDeactivated = onDeactivated;
    this.deactivate();
    this.router = router;
  }

  Page.prototype.destroy = function () {
    this.element = null;
    this.onDeactivated = null;
    this.onActivated = null;
    if (this.router) {
      this.router.destroy(); //I will destroy router since there is no one outside which will destroy it ...
    }
    this.router = null;
  };

  Page.prototype.activate = function () {
    this.element.set('actual', true);
    if (lib.isFunction (this.onActivated)) {
      this.onActivated (this.element);
    }
    if (this.router) {
      this.router.reset();
    }
  };

  Page.prototype.deactivate = function () {
    this.element.set('actual', false);
    if (this.router) {
      this.router.clear();
    }

    if (lib.isFunction(this.onDeactivated)) {
      this.onDeactivated (this.element);
    }

  };

  Page.prototype.gotoSubPage = function (page) {
    if (this.router) {
      if (page) {
        this.router.set('page', page);
      }else{
        this.router.reset();
      }
    }
  };


  function RouterMixIn () {
    this.default_page = null;
    this.pagesmap = new lib.Map();
    this.page = null;
  }
  RouterMixIn.prototype.__cleanUp = function () {
    this.default_page = null;
    this.page = null;
    lib.containerDestroyAll (this.pagesmap);
    this.pagesmap.destroy();
    this.pagesmap = null;
  };

  RouterMixIn.prototype.addPage = function (page, allexelement, onActivated, onDeactivated, page_router) {
    if (lib.isArray(page)) {
      page.forEach(addSinglePage.bind(null, this, allexelement, onActivated, onDeactivated, page_router));
      return;
    }
    addSinglePage(this, allexelement, onActivated, onDeactivated, page_router, page);
  };


  function addSinglePage (routermi, allexelement, onActivated, onDeactivated, page_router, page) {
    routermi.pagesmap.add(page, new Page (allexelement, onActivated, onDeactivated, page_router));
  };

  RouterMixIn.prototype._doDeactivate = function (page, item, key) {
    if (key === page) return;
    if (item) item.deactivate();
  };

  RouterMixIn.prototype.set_page = function (page) {
    if (this.page === page) return false;
    this.page = page;

    var pp = null, zp = 0, np = null;

    if (page) {
      pp = page.split('/');
      zp = pp.shift();
      np = pp.join('/');
    }

    this.pagesmap.traverse(this._doDeactivate.bind(this, zp));
    var ap = this.pagesmap.get(zp);
    if (!ap) return;
    ap.activate();
    ap.gotoSubPage (np);
    return true;
  };

  RouterMixIn.prototype.reset = function () {
    this.set('page', this.default_page);
  };

  RouterMixIn.prototype.clear = function () {
    this.set('page', null);
    if (this.getContainer()) {
      this.getContainer().set('actual', false);
    }
  };

  RouterMixIn.addMethods = function (chld) {
    lib.inheritMethods(chld, RouterMixIn, 'clear', 'reset', 'set_page', '_doDeactivate', 'addPage'); 
  };


  function Router (container) {
    RouterMixIn.call(this, container);
    this.container = container;
    CLDestroyable.call(this);
  }

  lib.inherit(Router, CLDestroyable);
  RouterMixIn.addMethods (Router);

  Router.prototype.__cleanUp = function () {
    this.container = null;
    RouterMixIn.prototype.__cleanUp.call(this);
    CLDestroyable.prototype.__cleanUp.call(this);
  };

  Router.prototype.getContainer = function () {
    return this.container;
  };

  function getUniversalPageName (name) {
    return '#universal#'+name+'#page';
  }

  function RoleRouter () {
    this.role_router = new Router();
    this.role = null;
    this.active_router = null;
    this.isonline = false;
  }

  lib.inherit (RoleRouter, Router);
  RoleRouter.prototype.destroy = function (){
    this.isonline = null;
    this.active_router = null;
    this.role = null;
    this.role_router.destroy();
    this.role_router = null;
  };

  RoleRouter.prototype.addNoRolePage = function (allexelement, onActivated, onDeactivated, router) {
    this.role_router.addPage (NO_ROLE_PAGE, allexelement, onActivated, onDeactivated, router);
  };

  RoleRouter.prototype.addUniversalRolePage = function (name, allexelement, onActivated, onDeactivated, router) {
    ///THIS_IS_NOT_NO_ROLE_PAGE ... MOVING TO THIS PAGE REQUIRES ROLE TO BE SET ;)
    var n = getUniversalPageName(name);
    this.role_router.addPage(n, allexelement, onActivated, onDeactivated, router);
  };

  RoleRouter.prototype.addRolePage = function (role, allexelement, onActivated, onDeactivated, router) {
    this.role_router.addPage(role, allexelement, onActivated, onDeactivated, router);
  };

  RoleRouter.prototype._prepareActiveRouter = function (name){
    if (this.active_router) {
      this.active_router.clear();
    }

    if (name) {
      var page = this.role_router.pagesmap.get(name);
      this.active_router = page ? page.router : null;
    }else{
      this.active_router = null;
    }

    if (this.active_router) {
      this.active_router.reset();
    }
  };


  RoleRouter.prototype.gotoUniversalRolePage = function (name) {
    if (!this.role) {
      console.warn ('going to universal page ',name,'with no role set ... no can do ...');
      return;
    }
    this._prepareActiveRouter (getUniversalPageName(name));
  };

  RoleRouter.prototype.setRole = function (role) {
    this.role = role;
    if (!this.online) {
      this._prepareActiveRouter(null);
      return;
    }
    this._prepareActiveRouter(role);
    this.role_router.set('page', role ? role : null);
  };

  RoleRouter.prototype.resetToRole = function () {
    this.setRole(this.role);
  };

  RoleRouter.prototype.setPageInRole = function (name) {
    if (!this.active_router) {
      console.warn ('No active router for role '+this.role+'?', 'No can do ...');
      return;
    }
    if (this.active_router) {
      this.active_router.set('page', name);
    }
  };

  RoleRouter.prototype._onStatusChanged = function (sttus) {
    this.online = ('established' === sttus);
    this.setRole ( this.online ? this.role : null);
  };

  return {
    RouterMixIn : RouterMixIn,
    Router : Router,
    RoleRouter : RoleRouter
  };


}

module.exports = createRouterLib;

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
function createMixins (execlib) {
  'use strict';

  var lib = execlib.lib;
  var ret = {};

  require('./clickablecreator')(lib, ret);
  require('./siblingmanipulatorcreator')(lib, ret);
  require('./scrollablecreator')(lib, ret);
  require('./searchablecreator')(lib, ret);

  return ret;
}
module.exports = createMixins;

},{"./clickablecreator":27,"./scrollablecreator":29,"./searchablecreator":30,"./siblingmanipulatorcreator":31}],29:[function(require,module,exports){
function createScrollableMixin (lib, mylib) {
  'use strict';

  function ScrollableMixin () {
    this.scroller = this.onElementScrolled.bind(this);
    this.lastScrollPos = null;
    this.lastElementHeight = null;
    this.lastBodyHeight = null;
  }
  ScrollableMixin.prototype.destroy = function () {
    if (this.scroller && this.$element) {
      this.$element.off('scroll', this.scroller);
    }
    this.lastBodyHeight = null;
    this.lastElementHeight = null;
    this.lastScrollPos = null;
    this.scroller = null;
  };
  ScrollableMixin.prototype.startListeningToElementScroll = function () {
    if (!this.$element) {
      return;
    }
    this.lastScrollPos = this.$element.scrollTop;
    this.lastElementHeight = this.$element.height();
    this.lastBodyHeight = $('body').height();
    this.$element.on('scroll', this.scroller);
    $(window).resize(this.scrollBottomIfSmallerHeight.bind(this)).resize();
    /*
		$(window).resize(function () {
      $('.Messages').scrollTop(9999999999);
	  }).resize();
    */
  };
  ScrollableMixin.prototype.onElementScrolled = function () {
    var prevpos = this.lastScrollPos,
      sc = elementScrolledChecker.call(this),
      down;
    if (!sc) {
      return;
    }
    this.lastScrollPos = sc.pos;
    down = this.lastScrollPos > prevpos;
    if (sc.atTop && !down) {
      this.onElementScrolledToTop();
    }
    if (sc.atBottom && down) {
      this.onElementScrolledToBottom();
    }
  };
  ScrollableMixin.prototype.elementIsScrolledToTop = function (tolerance) {
    var sc = elementScrolledChecker.call(this, tolerance);
    return (sc && sc.atTop);
  };
  ScrollableMixin.prototype.elementIsScrolledToBottom = function (tolerance) {
    var sc = elementScrolledChecker.call(this, tolerance);
    return (sc && sc.atBottom);
  };
  ScrollableMixin.prototype.onElementScrolledToTop = lib.dummyFunc;
  ScrollableMixin.prototype.onElementScrolledToBottom = lib.dummyFunc;
  ScrollableMixin.prototype.scrollElementToTop = function () {
    if (!this.$element) {
      return;
    }
    this.$element.scrollTop(0);
  };
  ScrollableMixin.prototype.scrollElementToBottom = function () {
    if (!this.$element) {
      return;
    }
    this.$element.scrollTop(this.$element[0].scrollHeight);
  };
  ScrollableMixin.prototype.scrollBottomIfSmallerHeight = function () {
    //console.log('LAST HEIGHT',this.lastElementHeight,'NEW HEIGHT', this.$element.height());
    //initially element height is 0 or negative depending on margin so we use body
    if (this.lastElementHeight <= 0){
      if (this.lastBodyHeight > $('body').height()){
        this.scrollElementToBottomUnknown();
      }
    }else{
      if (this.lastElementHeight > this.$element.height()){
        this.scrollElementToBottomUnknown();
      }
    }
    this.lastElementHeight = this.$element.height();
    this.lastBodyHeight = $('body').height();
  };
  ScrollableMixin.prototype.scrollElementToBottomUnknown = function () {
    if (!this.$element) {
      return;
    }
    this.$element.scrollTop(9999999999);
  };
  ScrollableMixin.prototype.elementIsWithinTheScrollableArea = function (el, tolerance) {
    var gr = new GeometryReader(this, el), ret = gr.isChildWithinVisible();
    gr.destroy();
    return ret;
  };
  ScrollableMixin.prototype.scrollToSeeElementAtBottom = function (el) {
    var gr = new GeometryReader(this, el), scrolltop = gr.scrollTopForChildAtBottom();
    dumpGeometriesForChildren.call(this);
    console.log('should scrolltop', scrolltop, 'gr', gr, 'current', this.$element.scrollTop());
    this.$element.scrollTop(scrolltop);
    console.log('finally', this.$element.scrollTop());
    gr.destroy();
  };

  //helper classes
  function GeometryReader (scrollable, elem) {
    this.scrolltop = scrollable.$element.scrollTop();
    this.mastertop = scrollable.$element.position().top;
    this.masterheight = scrollable.$element.innerHeight();
    this.childtop = elem.position().top - this.mastertop;
    this.childheight = elem.outerHeight();
  }
  GeometryReader.prototype.destroy = function () {
    this.childheight = null;
    this.childtop = null;
    this.masterheight = null;
    this.mastertop = null;
    this.scrolltop = null;
  };
  GeometryReader.prototype.isChildWithinVisible = function () {
    return this.childtop >=0 && (this.childtop+this.childheight < this.masterheight);
  };
  GeometryReader.prototype.scrollTopForChildAtBottom = function () {
    return this.scrolltop + (this.childtop+this.childheight) - this.masterheight;
  };
  //helper classes end

  //static
  function elementScrolledChecker (tolerance) {
    var ret, scrollTop, innerHeight, scrollHeight, st;
    st = this.getConfigVal('scroll_tolerance');
    tolerance = lib.isNumber(tolerance) ? tolerance : (lib.isNumber(st) ? st : 0);
    ret = {
      pos: 0,
      atTop: false,
      atBottom: false
    };
    if (!this.$element) {
      return ret;
    }
    scrollTop = this.$element.scrollTop();
    ret.pos = scrollTop;
    if (scrollTop <= 0+tolerance) {
      ret.atTop = true;
    }
    innerHeight = this.$element.innerHeight();
    scrollHeight = this.$element[0].scrollHeight;
    /*
    console.log('scrollTop', scrollTop);
    console.log('innerHeight', innerHeight);
    console.log('scrollHeight', scrollHeight);
    */
    if (scrollTop+innerHeight+tolerance >= scrollHeight) {
      ret.atBottom = true;
    }
    return ret;
  }
  function dumpGeometriesForChildren () {
    console.log('children dump');
    this.$element.children().each(childGeometryDumper.bind(this));
  }
  function childGeometryDumper (index, el) {
    var gr = new GeometryReader(this, jQuery(el));
    console.log(gr);
    gr.destroy();
  }
  //static end

  ScrollableMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, ScrollableMixin
      ,'startListeningToElementScroll'
      ,'onElementScrolled'
      ,'onElementScrolledToTop'
      ,'onElementScrolledToBottom'
      ,'elementIsScrolledToTop'
      ,'elementIsScrolledToBottom'
      ,'scrollElementToTop'
      ,'scrollElementToBottom'
      ,'scrollBottomIfSmallerHeight'
      ,'scrollElementToBottomUnknown'
      ,'elementIsWithinTheScrollableArea'
      ,'scrollToSeeElementAtBottom'
    );
    klass.prototype.postInitializationMethodNames = klass.prototype.postInitializationMethodNames.concat('startListeningToElementScroll');
  };

  mylib.Scrollable = ScrollableMixin;
}
module.exports = createScrollableMixin;

},{}],30:[function(require,module,exports){
function createSearchableMixin (lib, mylib) {
  'use strict';

  function SearchableMixin () {
    this.onsearchchanger = this.onSearchInputChange.bind(this);
    this.onsearchfocuser = this.onSearchFocus.bind(this);
    this.search = null;
  }
  SearchableMixin.prototype.destroy = function () {
    if (this.search && this.onsearchchanger && this.onsearchfocuser) {
      this.search.off('keyup', this.onsearchchanger);
      this.search.off('focus', this.onsearchfocuser);
    }
    this.search = null;
    this.onsearchfocuser = null;
    this.onsearchchanger = null;
  };
  SearchableMixin.prototype.init = function () {
    this.search = this.$element.find(this.getConfigVal('search_input_finder'));
    this.search.on('keyup', this.onsearchchanger);
    this.search.on('focus', this.onsearchfocuser);
  };
  SearchableMixin.prototype.onSearchInputChange = function () {
    if (!this.search) {
      return;
    }
    this.filterOnSearchInputValue(this.search.val());
  };
  SearchableMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, SearchableMixin
      ,'onSearchInputChange'
    );
  };

  mylib.Searchable = SearchableMixin;
}
module.exports = createSearchableMixin;

},{}],31:[function(require,module,exports){
function createSiblingManipulatorMutex (lib, mylib) {
  'use strict';

  function jQuerySiblingManipulatorMutex () {
    this.affected = null;
  }
  jQuerySiblingManipulatorMutex.prototype.destroy = function () {
    this.affected = null;
  };
  jQuerySiblingManipulatorMutex.prototype.initializejQuerySiblingManipulator = function () {
  };
  jQuerySiblingManipulatorMutex.prototype.manipulatejQuerySiblings = function (actual) {
    var shouldbeformanip, manip, affected;
    if (this.actual === actual) {
      return;
    }
    if (!this.$element) {
      return;
    }
    shouldbeformanip = actual ? ':visible' : ':hidden';
    manip = actual ? 'hide' : 'show';
    if (actual) {
      affected = [];
      this.findSiblingsForManipulation().each(deactivator.bind(null, affected, shouldbeformanip, manip));
      this.affected = affected;
      shouldbeformanip = null;
      manip = null;
      affected = null;
      return;
    }
    if (!lib.isArray(this.affected)) {
      return;
    }
    this.affected.forEach(activator.bind(null, shouldbeformanip, manip));
    shouldbeformanip = null;
    manip = null;
    this.affected = null;
  };
  jQuerySiblingManipulatorMutex.prototype.findSiblingsForManipulation = function () {
    var siblings_finder = this.getConfigVal('siblings_finder');
    if (!siblings_finder) {
      return this.$element.siblings();
    }
    return this.$element.siblings(siblings_finder);
  };

  function deactivator (affected, shouldbeformanip, manip, elindex, el) {
    el = jQuery(el);
    if (el.is(shouldbeformanip)) {
      affected.push(el);
      el[manip]();
      return;
    }
  }

  function activator (shouldbeformanip, manip, el) {
    if (!el) {
      return;
    }
    if (el.is(shouldbeformanip)) {
      el[manip]();
    }
  }

  jQuerySiblingManipulatorMutex.addMethods = function (klass) {
    lib.inheritMethods(klass, jQuerySiblingManipulatorMutex
      ,'initializejQuerySiblingManipulator'
      ,'findSiblingsForManipulation'
    );
    klass.prototype.postInitializationMethodNames = 
      klass.prototype.postInitializationMethodNames.concat('initializejQuerySiblingManipulator');
  };

  mylib.jQuerySiblingManipulator = jQuerySiblingManipulatorMutex;
}
module.exports = createSiblingManipulatorMutex;

},{}],32:[function(require,module,exports){
function createRouteController (allex, applib) {
  'use strict';

  var lib = allex.lib,
    Selector = applib.getModifier('Selector');

  function RouteController (options) {
    lib.extend (options || {}, {
      attributeVal : 'data-route'
    });
    Selector.call(this,options);
  }
  lib.inherit (RouteController, Selector);
  RouteController.prototype.__cleanUp = function () {
    Selector.prototype.__cleanUp.call(this);
  };

  RouteController.prototype.DEFAULT_CONFIG = function () {
    return lib.extend (Selector.prototype.DEFAULT_CONFIG(), {selector : 'ul li a', attributeVal : 'data-route'});
  };

  applib.registerModifier ('RouteController', RouteController);

}

module.exports = createRouteController;

},{}],33:[function(require,module,exports){
function createSelectorModifier (allex, applib) {
  'use strict';

  var $ = jQuery;

  var lib = allex.lib,
    BasicModifier = applib.BasicModifier;

  function Selector (options) {
    BasicModifier.call(this, options);
  }
  lib.inherit (Selector, BasicModifier);
  Selector.prototype.destroy = function () {
    BasicModifier.prototype.destroy.call(this);
  };

  Selector.prototype.ALLOWED_ON = function() { return null; };

  Selector.prototype.DEFAULT_CONFIG = function () {
    return {
      attributeVal : null,
      evntValProcessor : null
    };
  };

  Selector.prototype.doProcess = function (name, options, links, logic, resources){
    var selector = this.getConfigVal ('selector');
    var ret = [{
      triggers : '.$element.'+selector+'!click',
      references : '.',
      handler : this._onClicked.bind(this, this.getConfigVal ('attributeVal'), this.getConfigVal ('evntValProcessor'))
    }];
    Array.prototype.push.apply (logic, ret);
  };

  Selector.prototype._onClicked = function (attributeVal, evntValProcessor, selector, evnt) {
    var currentTarget = lib.isArray(evnt) ? evnt[0].currentTarget : evnt.currentTarget,
      raiseValue =  this.getRaiseValue($(currentTarget), attributeVal, evntValProcessor);
    if ('undefined' === typeof(raiseValue)) return;
    selector.raiseEvent ('onSelected',raiseValue);
  };

  Selector.prototype.getRaiseValue = function ($target, attributeVal, evntValProcessor) {
    if (attributeVal) {
      return $target.attr(attributeVal);
    }

    if (evntValProcessor) {
      return evntValProcessor($target);
    }

    return $target;
  };

  applib.registerModifier ('Selector', Selector);
}

module.exports = createSelectorModifier;

},{}],34:[function(require,module,exports){
function createDataViewProcessor (allex, applib) {
  'use strict';

  var lib = allex.lib,
    BasicProcessor = applib.BasicProcessor;

  function DataViewProcessor () {
    BasicProcessor.call(this);
  }
  lib.inherit (DataViewProcessor, BasicProcessor);

  DataViewProcessor.prototype.process = function (desc) {
    if (!this.config || !this.config.views) return;
    lib.traverseShallow (this.config.views, this._processView.bind(this, desc));
  };

  DataViewProcessor.prototype._applyRowEventLogic  = function (desc, path, event_descriptor, event_name) {
    applib.misc.initLogic(desc);
    if (!event_descriptor.handler) {
      throw new Error('DataView '+path+'has no event handler for event '+event_name);
    }

    if (!event_descriptor.references) {
      throw new Error('DataView '+path+'has no references for event '+event_name);
    }
    desc.logic.push ({
      triggers : eventName(path, event_name, lib.isArray(desc.environments)),
      references : event_descriptor.references,
      handler : event_descriptor.handler
    });

  };

  DataViewProcessor.prototype._applyRowEventLink = function (desc, path, event_descriptor, event_name) {
    applib.misc.initLinks (desc);
    desc.links.push ({
      source : eventName(path, event_name, lib.isArray(desc.environments)),
      target : event_descriptor.target,
      filter : event_descriptor.filter
    });
  };

  DataViewProcessor.prototype._processRowEvent = function (desc, path, event_descriptor, event_name) {
    if (event_descriptor.handler && event_descriptor.references) return this._applyRowEventLogic (desc, path, event_descriptor, event_name);
    if (event_descriptor.target) return this._applyRowEventLink (desc, path, event_descriptor, event_name);
    throw new Error('Unknow event handler for _processRowEvent: '+event_name+' in '+path);
  };

  DataViewProcessor.prototype._processView = function (desc, view, path) {
    var pspl = path.split('.'),
      view_name = pspl.pop(),
      p_arent = applib.misc.findElement (desc, pspl.join('.')),
      view_type = view.type || this.config.defaults.view_type;

    if (applib.misc.findElement (p_arent, view_name)) {
      throw new Error('Element on path '+path+' already exists');
    }

    applib.misc.initElements (p_arent);
    p_arent.options.elements.push ({
      name : view_name,
      type : view_type,
      requires: view.requires,
      options : lib.extend({}, this.config.defaults ? this.config.defaults[view_type] : {}, view.config)
    });

    if (view.rowEvents) {
      lib.traverseShallow (view.rowEvents, this._processRowEvent.bind(this, desc, path));
    }
  };

  function eventName (path, event_name, global) {
    var ret = path+'.$element!'+event_name;
    if (global) {
      return 'element.'+ret;
    }
    return ret;
  }

  applib.registerPreprocessor ('DataView', DataViewProcessor);
}

module.exports = createDataViewProcessor;

},{}],35:[function(require,module,exports){
function createKeyboardProcessor (allex, applib) {
  'use strict';

  var $ = jQuery;

  var lib = allex.lib,
    BasicElement = applib.BasicElement,
    BasicProcessor = applib.BasicProcessor;

  function bindEvents (selector, hook, val, key) {
    $(selector).jkey (key, hook.fire.bind (hook, {key : key, value : val}));
  }

  function KeyboardInputElement (id, options) {
    BasicElement.call(this, id, options);
    this.onUp = new lib.HookCollection();
    lib.traverseShallow (options.events.up, bindEvents.bind(null, options.selector || document, this.onUp));
  }
  lib.inherit (KeyboardInputElement, BasicElement);

  KeyboardInputElement.prototype.__cleanUp = function () {
    this.onUp.destroy();
    this.onUp = null;
    BasicElement.prototype.__cleanUp.call(this);
  };

  KeyboardInputElement.prototype.initialize = function () {
    BasicElement.prototype.initialize.call(this);
  };

  applib.registerElementType ('KeyboardInputElement', KeyboardInputElement);

  function KeyboardProcessor () {
    BasicProcessor.call(this);
  }
  lib.inherit (KeyboardProcessor, BasicProcessor);

  KeyboardProcessor.prototype.process = function (desc) {
    if (!this.config) return; //pa sto me uopste zoves ....
    if (!this.config.element_name) throw new Error ('No element input');
    if (!this.config.events) throw new Error ('No events listed');
    (desc.options.elements || desc.elements).push ({
      name : this.config.element_name,
      type : 'KeyboardInputElement',
      options : {
        events : this.config.events
      }
    });
  };

  applib.registerPreprocessor ('KeyboardController', KeyboardProcessor);
}

module.exports = createKeyboardProcessor;

},{}],36:[function(require,module,exports){
function createLogoutDeactivatorProcessor (allex, applib) {
  'use strict';
  var lib = allex.lib,
    BasicProcessor = applib.BasicProcessor,
    misc = applib.misc,
    q = lib.q;

    function LogoutDeactivator () {
      BasicProcessor.call(this);
      this.elements = [];
    }

    lib.inherit (LogoutDeactivator, BasicProcessor);

    LogoutDeactivator.prototype.destroy = function () {
      this.elements = null;
      BasicProcessor.prototype.destroy.call(this);
    };

    LogoutDeactivator.prototype.configure = function (config) {
      BasicProcessor.prototype.configure.call(this, config);
    };

    /*
     * possible item for elements : 
     *        - string -> direct path to element
     *        - {type : type} -> find all elements of a given type
     *        - {type : type, modifiers : modifiers} -> find all elements of a given type with given modifiers ...
     *
     */

    LogoutDeactivator.prototype.process = function (desc) {
      if (!this.config) return;
      if (!this.config.state) throw new Error('No state field in config');
      if (!this.config.elements) throw new Error('No elements field in config');

      misc.traverseElements (desc, this._onElement.bind(this), ['element']);
      desc.logic.push ({
        triggers : this.config.state,
        references : this.elements.join (','),
        handler : _processState.bind(this)
      });
    };

    function _processState () {
      var d = Array.prototype.slice.call(arguments),
        state = d.pop();

      if ('established' !== state) {
        d.forEach (lib.doMethod.bind(null, 'set', ['actual', false]));
      }
      d = null;
    }

    LogoutDeactivator.prototype._onElement = function (element, path){
      var m = path.join('.');
      if (this._match (element, m)) this.elements.push (m);
    };

    LogoutDeactivator.prototype._match = function (element, path){
      var el = null;
      for (var i = 0; i < this.config.elements.length; i++) {
        el = this.config.elements[i];
        if (lib.isString(el)) {
          if (path === el) return true;
        }
        if (el.type !== element.type) {
          continue;
        }
        if (!el.modifiers) return true;
        if (!element.modifiers) continue;
        if (lib.arryOperations.intersect(el.modifiers, element.modifiers.map(stringify)).filter(lib.isString).length) return true;
      }

      return false;
    };

    function stringify (rec) {
      return lib.isString (rec) ? rec : rec.name;
    }

    applib.registerPreprocessor('LogoutDeactivator', LogoutDeactivator);
}

module.exports = createLogoutDeactivatorProcessor;

},{}],37:[function(require,module,exports){
function createPipelineProcessor (allex, applib) {
  'use strict';
  var lib = allex.lib,
    BasicElement = applib.BasicElement,
    BasicModifier = applib.BasicModifier,
    BasicProcessor = applib.BasicProcessor,
    cntr = 0,
    misc = applib.misc,
    q = lib.q;

  function PItem (container, desc) {
    this.container = container;
    this.desc = desc;
    this.prepareData = desc.prepareData || null;
    this.defer = null;
  }

  PItem.prototype.destroy = function () {
    this.prepareData = null;
    this.desc = null;
    this.container = null;
    this.defer = null;
  };

  PItem.prototype.isExpecting = function () {
    return !!this.defer;
  };

  PItem.prototype._actualStart = function (data) {
    var ret = this._doStart(data);
    ret.done (this.doOnSuccess.bind(this), this.doOnError.bind(this));
    return ret;
  };

  PItem.prototype._onPrepareDataFunction = function (promise_provider) {
    return promise_provider().then (this._actualStart.bind(this));
  };

  PItem.prototype._onPrepareDataPromise = function (promise) {
    return promise.then (this._actualStart.bind(this));
  };

  PItem.prototype.start = function (data, index, all_data){
    var data_prepared = (lib.isFunction (this.prepareData)) ? this.prepareData(data, index, all_data) : data;

    if (lib.isFunction(data_prepared)) {
      return this._onPrepareDataFunction (data_prepared);
    }

    if (lib.isFunction(data_prepared.then)) {//this is a promise ...
      return this._onPrepareDataPromise(data_prepared);
    }

    return this._actualStart(data_prepared);
  };

  PItem.prototype.doOnSuccess = function (result) {
    this.container._reportDone(result);
    if (lib.isFunction(this.desc.onSuccess)) {
      this.desc.onSuccess.apply(null, this.getSuccessArgs(result));
      return;
    }
    if (this.desc.onSuccess === 'standard') {
      if (this.element) {
        this.element.set('actual', false);
      }
    }
  };

  PItem.prototype.doOnError = function (result){
    this.container._reportFailed(result);
    if (lib.isFunction(this.desc.onError)) this.desc.onError.apply(null, this.getErrorArgs(result));
  };

  PItem.prototype.getErrorArgs = function (result) {
    return [result, this.container.values];
  };

  PItem.prototype.getSuccessArgs = function (result) {
    return [result, this.container.values];
  };

  PItem.prototype._doStart = lib.dummyFunc;

  function FunctionPItem (container, ftion, desc) {
    PItem.call(this, container, desc);
    this.ftion = ftion;
    if (!lib.isFunction(this.prepareData)) this.prepareData = this._defaultDataPrepare.bind(this);
  }
  lib.inherit (FunctionPItem, PItem);
  FunctionPItem.prototype.destroy = function () {
    this.ftion = null;
    PItem.prototype.destroy.call(this);
  };

  FunctionPItem.prototype._doStart = function (args) {
    return this.ftion.apply (null, args);
  };

  FunctionPItem.prototype._defaultDataPrepare = function (data, index, all_data) {
    return [data];
  };

  function ObjectPItem (container, element, desc) {
    PItem.call(this, container, desc);
    this.element = element;
  }
  lib.inherit (ObjectPItem, PItem);

  ObjectPItem.prototype.destroy = function () {
    this.element = null;
    PItem.prototype.destroy.call(this);
  };

  ObjectPItem.prototype.getErrorArgs = function (result) {
    return [this.element, result, this.container.values];
  };

  ObjectPItem.prototype.getSuccessArgs = function (result) {
    return [this.element, result, this.container.values];
  };

  ObjectPItem.prototype.start = function (data, index, all_data){
    if (lib.isFunction(this.desc.onStart)) this.desc.onStart(this.element, data, all_data);
    return PItem.prototype.start.apply(this, arguments);
  };

  ObjectPItem.prototype._doStart = function () {
    this.defer = q.defer();
    return this.defer.promise;
  };


  ObjectPItem.prototype.onFailed = function (result) {
    if (!this.defer) throw new Error('Not expecting resolution');
    var d = this.defer;
    this.defer = null;
    d.reject (result);
    d = null;
  };

  ObjectPItem.prototype.onSuccess = function (result) {
    if (!this.defer) throw new Error('Not expecting resolution');
    var d = this.defer;
    this.defer = null;
    d.resolve(result);
    d = null;
  };

  function Pipeline (id, options) {
    BasicElement.call(this, id, options);
    this.items = null;
    this.values = null;
    this.index = null;
  }
  lib.inherit (Pipeline, BasicElement);
  Pipeline.prototype.__cleanUp = function () {
    this.index = null;
    this.values = null;
    this.forceStop();
    lib.arryDestroyAll(this.items);
    this.items = null;
    BasicElement.prototype.__cleanUp.call(this);
  };

  Pipeline.prototype.init = function (pipeline_desc) {
    this.items = new Array(pipeline_desc.length);
  };

  Pipeline.prototype.getCurrent = function () {
    return this.items[this.get('index')];
  };

  Pipeline.prototype.stop= function () {
    this.set('actual', false);
  };

  Pipeline.prototype._assignIndex = function (index, desc, element) {
    if (lib.isFunction (element)) {
      this.items[index] = new FunctionPItem (this, element, desc);
    }else{
      this.items[index] = new ObjectPItem (this, element, desc);
    }
  };

  Pipeline.prototype.set_actual = function (val) {
    var bl = !!val;
    if (bl === this.actual) return false;
    BasicElement.prototype.set_actual.call(this, !!val);

    if (val) {
      this.values = [val];
      this.next();
    } /*else{
      this.values = null;
    }*/
  };

  Pipeline.prototype.next = function () {
    if (!this.values) return; //zaustavljeno, bato, nema se ovde sta raditi ...
    var index = this.values.length-1;
    this.set('index', index);
    var item = this.getCurrent();

    if (!item) {
      this.stop();
      return;
    }
    item.start(this.values[index],this.get('index'), this.values).done (this.next.bind(this), this.stop.bind(this));
  };

  Pipeline.prototype._reportDone = function (result) {
    this.values.push(result);
  };

  Pipeline.prototype._reportFailed = function (result) {
    this.values.push (result);
  };

  Pipeline.prototype.onDone = function (result){
    this.getCurrent().onSuccess(result);
  };

  Pipeline.prototype.onFailed = function (result){
    this.getCurrent().onFailed(result);
  };

  applib.registerElementType ('Pipeline', Pipeline);

  function PipelineModifier (options){
    BasicModifier.call(this, options);
  }
  lib.inherit (PipelineModifier, BasicModifier);

  PipelineModifier.prototype.__cleanUp = function () {
    BasicModifier.prototype.__cleanUp.call(this);
  };

  PipelineModifier.prototype.doProcess = function (name, options, links, logic, resources) {
    var element_name = this.getConfigVal ('element_name'),
      pipeline = this.getConfigVal ('pipeline'),
      pipe_element_path = (name ? '' : 'element')+'.'+element_name,
      temp, is_object;

    var lp = [
    ];

    lp.push ({
      triggers : '.!ready',
      references : pipe_element_path,
      handler : this._initialize.bind(this, pipeline)
    });

    for (var i = 0; i < pipeline.length; i++) {
      temp = pipeline[i];
      lp.push ({
        name : 'test_ready',
        triggers : '.!ready',
        references : [temp.element, pipe_element_path].join(','),
        handler : this._onParentReady.bind(this, temp, i)
      });

      is_object = temp.element.indexOf('>') < 0;

      if (is_object  && !(temp.success && temp.error)){
        throw new Error('For object config we need success and error triggers');
      }

      if (!is_object) continue;

      lp.push ({
        triggers : temp.element+temp.success,
        references : [temp.element, pipe_element_path].join (','),
        handler : this._onElementSuccess.bind(this, i, temp.successCheck)
      },{
        triggers : temp.element+temp.error,
        references : [temp.element, pipe_element_path].join (','),
        handler : this._onElementError.bind(this, i, temp.errorCheck)
      });
    }

    Array.prototype.push.apply (logic, lp);
  };

  PipelineModifier.prototype._onElementError = function (elindex, errorCheck, elementInstance, pipelineInstance) {
    if (pipelineInstance.get('index') !== elindex) return;
    if (!pipelineInstance.getCurrent().isExpecting()) return;
    var args = Array.prototype.slice.call(arguments, 4);

    if (lib.isFunction(errorCheck)) {
      if (!errorCheck.apply(null, args)) return;
    }
    pipelineInstance.onFailed(args);
  };

  PipelineModifier.prototype._onElementSuccess = function (elindex, successCheck, elementInstance, pipelineInstance){
    if (pipelineInstance.get('index') !== elindex) return; ///simply ignore this one ....
    if (!pipelineInstance.getCurrent().isExpecting()) return;
    var args = Array.prototype.slice.call(arguments, 4);

    if (lib.isFunction(successCheck)){
      if (!successCheck(args)) return;
    }
    pipelineInstance.onDone(args);
  };

  PipelineModifier.prototype._initialize = function (pipeline, pipelineInstance){
    pipelineInstance.init(pipeline);
  };

  PipelineModifier.prototype._onParentReady = function (item, index, elementInstance, pipelineInstance) {
    pipelineInstance._assignIndex (index, item, elementInstance);
  };

  PipelineModifier.prototype.DEFAULT_CONFIG = function () {
    return null;
  };


  function PipelineSearcher (){
    BasicProcessor.call(this);
  }
  lib.inherit (PipelineSearcher, BasicProcessor);

  PipelineSearcher.prototype.destroy = function () {
    BasicProcessor.prototype.destroy.call(this);
  };

  PipelineSearcher.prototype.process = function (desc) {
    misc.traverseElements (desc, this._processElement.bind(this));
  };

  PipelineSearcher.prototype._processElement = function (desc) {
    if (!desc.modifiers) return;
    this.pipelineNames.forEach(this._processNamedElement.bind(this, desc));
  };

  PipelineSearcher.prototype._processNamedElement = function (desc, pipelinename) {
    var pps = misc.findModifier (desc, pipelinename);
    if (!pps) return;
    misc.initAll (desc);

    var ne, elements_arr = misc.getElementsArr(desc);
    for (var i = 0; i < pps.length; i++) {
      ne = {
        name : pps[i].options.element_name ? pps[i].options.element_name : desc.name ? desc.name+'_pipeline_'+i : '_pipeline_'+i,
        type : 'Pipeline'
      };
      pps[i].options.element_name = ne.name;
      elements_arr.push (ne);
    }
  };
  
  PipelineSearcher.prototype.pipelineNames = ['Pipeline'];

  applib.registerModifier ('Pipeline', PipelineModifier);
  applib.registerPreprocessor ('Pipeline', PipelineSearcher);

}

module.exports = createPipelineProcessor;


},{}],38:[function(require,module,exports){
function createRoleRouterPreprocessor (allex, routerlib, applib) {
  'use strict';
  var lib = allex.lib,
    BasicElement = applib.BasicElement,
    BasicModifier = applib.BasicModifier,
    BasicProcessor = applib.BasicProcessor,
    cntr = 0,
    misc = applib.misc,
    q = lib.q;

  function RoleRouterElement (id, options) {
    BasicElement.call(this, id, options);
    this.role_router = new routerlib.RoleRouter();
    this.path_prefix = null;
    this.path = null;
  }
  lib.inherit (RoleRouterElement, BasicElement);
  RoleRouterElement.prototype.__cleanUp = function () {
    this.path_prefix = null;
    this.path = null;
    this.role_router.destroy ();
    this.role_router = null;
    BasicElement.prototype.__cleanUp.call(this);
  };

  RoleRouterElement.prototype.gotoPage = function (page) {
    this.role_router.setPageInRole (page);
    this.set('path', page);
  };

  RoleRouterElement.prototype.gotoUniversalRolePage = function (page) {
    this.role_router.gotoUniversalRolePage.apply (this.role_router, arguments);
    this.set('path_prefix', page);
    this.set('path', this.role_router.active_router.default_page);
  };

  RoleRouterElement.prototype.resetToRole = function () {
    this.role_router.resetToRole.apply (this.role_router, arguments);
    this.set('path_prefix', null);
    this._checkInitialPath();
  };

  RoleRouterElement.prototype.set_path = function (path) {
    this.path = path;
  };

  RoleRouterElement.prototype._checkInitialPath = function () {
    if (this.role_router.role && this.role_router.online) {
      if (this.role_router.active_router) {
        this.set('path', this.role_router.active_router.default_page);
      } else {
        console.warn('no active_router');
      }
    }
  };

  applib.registerElementType ('RoleRouterElement', RoleRouterElement);

  function validateRoleChange (router, role, sttus) {
    router.role_router._onStatusChanged (sttus);

    if ('established' === sttus) {
      router.role_router.setRole(role);
    }else{
      router.role_router.setRole(null);
    }
    router._checkInitialPath();
  }

  function prepareRole (role, data, pageslist, router, container) {
    var len = pageslist.length,
      pages = Array.prototype.slice.call (arguments, 5, 5+len),
      rr;
      
    if (!container) {
      console.warn('Role', role, 'has no container defined');
    }
    rr = new routerlib.Router(container);

    for (var i in pageslist) {
      rr.addPage (data.pages[pageslist[i]], pages[i]);
    }
    rr.default_page = data.default_page;
    router.role_router.addRolePage(role, container, null, null, rr);
  }

  function RoleRouterPreprocessor () {
    BasicProcessor.call(this);
  }
  lib.inherit (RoleRouterPreprocessor, BasicProcessor);
  RoleRouterPreprocessor.prototype.destroy = function () {
    BasicProcessor.prototype.destroy.call(this);
  };

  RoleRouterPreprocessor.prototype.processRoleRouter = function (rr_name, rr_data, desc) {
    if (!rr_data.sttusSource) throw new Error("Missing sttusSource");
    if (!rr_data.roleSource) throw new Error('Missing roleSource');
    var name = rr_name+'_router';
    desc.elements.push ({
      name : name,
      type : 'RoleRouterElement'
    });

    desc.logic.push ({
      triggers : rr_data.roleSource+','+rr_data.sttusSource,
      references : 'element.'+name,
      handler : validateRoleChange
    });

    if (rr_data.roles) lib.traverseShallow (rr_data.roles, this.processRole.bind(this, desc.logic, 'element.'+name));
    if (rr_data.anyRole) lib.traverseShallow (rr_data.anyRole, this.processAnyRole.bind(this, desc.logic, 'element.'+name));
  };

  RoleRouterPreprocessor.prototype.processAnyRole = function (logic, element_name, data, name) {
    if (!data) return;

    var list = Object.keys (data.pages);

    logic.push({
      triggers : '.!ready',
      references : ([element_name, data.container].concat(list)).join (','),
      handler : suiteUpAnyRole.bind(null, data, list, name)
    });
  };

  function suiteUpAnyRole (data, list, name, router, container) {
    var refs = Array.prototype.slice.call (arguments, 5, 5+list.length);
    var rr = new routerlib.Router(container);

    for (var i = 0; i < list.length; i++) {
      rr.addPage(data.pages[list[i]], refs[i]);
    }

    rr.default_page = data.default_page;
    router.role_router.addUniversalRolePage (name, container, null, null, rr);
  }

  RoleRouterPreprocessor.prototype.processRole = function (logic, element_name, data, role) {
    if (!data.pages) {
      console.warn ('No page for role ',role);
      return;
    }
    var refs = [element_name, data.container], pageslist = Object.keys (data.pages);
    Array.prototype.push.apply (refs, pageslist);

    logic.push ({
      triggers : '.!ready',
      references : refs.join(','),
      handler : prepareRole.bind(null, role, data, pageslist)
    });
  };

  RoleRouterPreprocessor.prototype.process = function (desc) {
    for (var rr_name in this.config) {
      this.processRoleRouter(rr_name, this.config[rr_name], desc);
    }
  };

  applib.registerPreprocessor ('RoleRouter', RoleRouterPreprocessor);

}

module.exports = createRoleRouterPreprocessor;

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
function createFontLoader(allex, applib, $) {
  'use strict';

  var lib = allex.lib,
    BasicResourceLoader = applib.BasicResourceLoader,
    q = lib.q;

  var CONFIG_SCHEMA = {
    type : 'object',
    properties: {
      urls : {
        type: 'array',
        items: {type: 'string'}
      },
      families : {
        type : 'array',
        items: {type: 'string'}
      },
      ispermanent : {type : 'boolean'}
    }
  };

  function FontLoader (options) {
    BasicResourceLoader.call(this, lib.extend ({} , options, {ispermanent : true}));
    if (!window.WebFont) throw new Error('No WebFont component loaded, unable to load resource');
  }
  lib.inherit(FontLoader, BasicResourceLoader);
  FontLoader.prototype.__cleanUp = function () {
    BasicResourceLoader.prototype.__cleanUp.call(this);
  };

  FontLoader.prototype.CONFIG_SCHEMA = function () { return CONFIG_SCHEMA; };
  FontLoader.prototype.DEFAULT_CONFIG = function () { return null; };

  FontLoader.prototype.doLoad = function () {
    var d = q.defer();
    jQuery(document).ready(this._go.bind(this, d));
    return d;
  };

  FontLoader.prototype._go = function (defer) {
    WebFont.load({
      custom : {
        families: this.getConfigVal('families'),
        urls : this.getConfigVal('urls')
      },
      active: defer.resolve.bind(defer, 'ok')
    });
  };

  //module.resources.FontLoader = FontLoader;
  applib.registerResourceType('FontLoader', FontLoader);

}

module.exports = createFontLoader;

},{}],41:[function(require,module,exports){
function createThrobberResource (allex, applib) {
  'use strict';

  var lib = allex.lib,
    BasicResourceLoader = applib.BasicResourceLoader,
    q = lib.q;


    var CONFIG_SCHEMA = {
      type: 'object',
      properties: {
        'selector': {type:'string'},
        'searchForCurrent' : {type: 'boolean'}
      },
      required : ['selector']
    };

    function Throbber (options){
      BasicResourceLoader.call(this,options);
      this.$element = null;
      this.pending = [];
    }
    lib.inherit (Throbber, BasicResourceLoader);
    Throbber.prototype.__cleanUp = function () {
      this.pending = null;
      this.$element = null;
      BasicResourceLoader.prototype.__cleanUp.call(this);
    };


    Throbber.prototype.CONFIG_SCHEMA = function () { return CONFIG_SCHEMA; };
    Throbber.prototype.DEFAULT_CONFIG = function () { return null; };

    Throbber.prototype.load = function () {
      var d = q.defer();
      jQuery(document).ready(this._go.bind(this, d));
      return d.promise;
    };

    Throbber.prototype._go = function (defer){
      this.$element = jQuery(this.getConfigVal('selector'));
      if (!this.$element || !this.$element.length) return defer.reject(new Error('Unable to find throbber'));
      if (!this.getConfigVal('searchForCurrent')) {
        this.$element.hide();
        defer.resolve('ok');
        return defer.promise;
      }
      applib.traverseResources(this._inspectResource.bind(this));
      this.recheckPendings();
      return defer.resolve('ok');
    };

    Throbber.prototype._inspectResource = function (res, id){
      if (this === res.instance) return;
      this.addPromise (res.promise);
    };

    Throbber.prototype.addPromise = function (promise) {
      this.pending.push (promise);
      promise.done(this._onPromiseDone.bind(this, promise), this._onPromiseDone.bind(this, promise));
      this.recheckPendings();
    };

    Throbber.prototype._onPromiseDone = function (promise) {
      var index = this.pending.indexOf(promise);
      if (index < 0) return; //nothing to be done
      this.pending.splice(index, 1);
      this.recheckPendings();
    };

    Throbber.prototype.recheckPendings = function () {
      if (this.pending.length) {
        this.$element.show();
      }else{
        this.$element.hide();
      }
    };

    applib.registerResourceType('Throbber', Throbber);
} //)(ALLEX, ALLEX.WEB_COMPONENTS.allex_web_webappcomponent, ALLEX.WEB_COMPONENTS.allex_applib, jQuery);

module.exports = createThrobberResource;

},{}],42:[function(require,module,exports){
function createURLGeneratorResource (execlib, applib) {
  var lib = execlib.lib,
  BasicResourceLoader = applib.BasicResourceLoader,
  q = lib.q,
  CONFIG_SCHEMA = {
    type : 'object',
    properties : {
      url : {type : 'string'}
    },
    required : ['url']
  };

  function URLGenerator (options) {
    BasicResourceLoader.call(this, options);
  }
  lib.inherit (URLGenerator, BasicResourceLoader);
  URLGenerator.prototype.__cleanUp = function () {
    BasicResourceLoader.prototype.__cleanUp.call(this);
  };

  URLGenerator.prototype.doLoad = function () {
    var ret = q.defer();
    ret.resolve(true);
    return ret;
  };

  URLGenerator.prototype.DEFAULT_CONFIG = function () {return null;};
  URLGenerator.prototype.CONFIG_SCHEMA = function () {return CONFIG_SCHEMA;};
  URLGenerator.prototype.getFullUrl = function (path, query) {
    var url = this.getConfigVal ('url');
    url = url.charAt(url.length) === '/' ? url+path : url+'/'+path;
    ///TODO: fali query ...
    return url;
  };

  applib.registerResourceType('URLGenerator', URLGenerator);
} //)(ALLEX, ALLEX.WEB_COMPONENTS.allex_web_webappcomponent, ALLEX.WEB_COMPONENTS.allex_applib);

module.exports = createURLGeneratorResource;

},{}]},{},[1]);
