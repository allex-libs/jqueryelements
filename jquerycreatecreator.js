function createJQueryCreate (execlib, templatelib) {
  'use stict';

  var lib = execlib.lib;

  function jQueryCreate (parnt, childtemplate) {
    var parentelem = lib.isString(parnt) ? jQuery(parnt) : parnt, childelem;
    if (!(parentelem && lib.isFunction(parentelem.append))) {
      console.error(parnt, 'could not be resolved as a jQuery element');
      throw new Error('jQueryCreate could not resolve parent');
    }
    childelem = jQuery(templatelib.process(childtemplate));
    parentelem.append(childelem);
    return childelem;
  }

  return jQueryCreate;
}

module.exports = createJQueryCreate;
