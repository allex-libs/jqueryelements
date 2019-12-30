function createFormRenderingMixins (execlib) {
  'use strict';

  var lib = execlib.lib;

  return {
    HashDistributor: require('./hashdistributorcreator')(lib),
    TextFromHash: require('./textfromhashcreator')(lib)
  };

}
module.exports = createFormRenderingMixins;
