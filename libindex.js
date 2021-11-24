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
