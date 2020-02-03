function createFormRenderingMixins (execlib) {
  'use strict';

  var lib = execlib.lib,
    ret = {
      HashDistributor: require('./hashdistributorcreator')(lib),
      HashCollector: require('./hashcollectorcreator')(lib),
      DataHolder: require('./dataholdercreator')(lib),
      BitMaskCheckboxes: require('./bitmaskcheckboxescreator')(lib),
      Radios: require('./radioscreator')(lib),
      TextFromHash: require('./textfromhashcreator')(lib),
      InputHandler: require('./inputhandlercreator')(lib),
      NumericSpinner: require('./numericspinnercreator')(lib)
    };

  require('./formcreator')(lib, ret);
  return ret;
}
module.exports = createFormRenderingMixins;
