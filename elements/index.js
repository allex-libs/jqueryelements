function createElements (execlib, applib, templatelib, htmltemplateslib, mixins) {
  'use strict';

  require('./webelementcreator')(execlib, applib, templatelib);
  require('./dataawareelementcreator')(execlib, mixins.DataElementMixin, applib);
  require('./dataawarechildcreator')(execlib, mixins.DataElementFollowerMixin, applib);
  require('./clickablecreator')(execlib, applib, templatelib, htmltemplateslib);
  require('./fromdatacreatorcreator')(execlib, applib);
}

module.exports = createElements;
