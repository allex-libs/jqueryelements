function createElements (execlib, applib, templatelib, htmltemplateslib, mixins, mymixins) {
  'use strict';

  var jobs = require('./jobs')(execlib.lib);

  require('./webelementcreator')(execlib, applib, templatelib);
  require('./dataawareelementcreator')(execlib, mixins.DataElementMixin, applib);
  require('./dataawarechildcreator')(execlib, mixins.DataElementFollowerMixin, applib);
  require('./fromdatacreatorcreator')(execlib, applib, mymixins);

  require('./domelementcreator')(execlib, applib, templatelib, htmltemplateslib);
  require('./divcreator')(execlib, applib, templatelib, htmltemplateslib);
  require('./canvascreator')(execlib, applib, templatelib, htmltemplateslib);
  require('./imgcreator')(execlib, applib, templatelib, htmltemplateslib);
  require('./fileinputcreator')(execlib, applib, templatelib, htmltemplateslib, jobs);
  require('./clickablecreator')(execlib, applib, templatelib, htmltemplateslib, mymixins);

  require('./splashcreator')(execlib, applib, templatelib, htmltemplateslib);
}

module.exports = createElements;
