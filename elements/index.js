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
