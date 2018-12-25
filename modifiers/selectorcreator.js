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
