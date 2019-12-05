function createJobs (lib) {
  'use strict';

  var ret = {};

  require('./readfilecreator')(lib, ret);

  return ret;
}
module.exports = createJobs;
