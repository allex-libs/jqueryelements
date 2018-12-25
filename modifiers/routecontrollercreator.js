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
