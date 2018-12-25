function createLib (execlib, applib, linkinglib, templatelib) {
  'use strict';

  var DataElementMixIn = require('./mixins/dataelementmixincreator')(execlib),
    routerlib = require('./misc/router')(execlib),
    jQueryCreate = require('./jquerycreatecreator')(execlib, templatelib);

  require('./handlers')(execlib, applib, linkinglib);

  require('./resources/urlgeneratorcreator')(execlib, applib);
  require('./resources/throbbercreator')(execlib, applib);

  require('./elements/webelementcreator')(execlib, applib, templatelib);
  require('./elements/dataawareelementcreator')(execlib, DataElementMixIn, applib);

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
    DataElementMixIn: DataElementMixIn,
    RouterMixin: routerlib.RouterMixin,
    Router: routerlib.Router,
    RoleRouter: routerlib.RoleRouter
  };
}

module.exports = createLib;
