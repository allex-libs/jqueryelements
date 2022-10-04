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
    files = Array.prototype.slice.call(files);
    q.all(files.map(this.readFile.bind(this))).then(
      this.set.bind(this, 'files'),
      console.error.bind(console, 'readFile Error')
    );
  };
  FileInputElement.prototype.resetInput = function () {
    if (!this.destroyed) {
      return;
    }
    this.$fileinputelement.value = '';
  };
  FileInputElement.prototype.readFile = function (file) {
    return (new jobs.ReadFileJob(this, file)).go();
  };
  FileInputElement.prototype.readImage = function (result, file) {
    var reader = new FileReader(), _r = result;
    reader.readAsDataURL(file);
  };
  //FileInputElement.prototype.optionsConfigName = 'fileinput';
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
