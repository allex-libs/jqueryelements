function createHelpers (execlib) {
  'use strict';

  var ret = {};

  require('./inputlistenercreator')(execlib.lib, ret);

  return ret;
}
module.exports = createHelpers;
