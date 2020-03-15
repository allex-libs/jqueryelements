function createMixins (execlib) {
  'use strict';

  var lib = execlib.lib;
  var ret = {};

  require('./clickablecreator')(lib, ret);
  require('./siblingmanipulatorcreator')(lib, ret);
  require('./scrollablecreator')(lib, ret);
  require('./fromdatacreator')(lib, ret);

  return ret;
}
module.exports = createMixins;
