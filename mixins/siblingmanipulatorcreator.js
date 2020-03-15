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
