function createjQueryTraversals (lib, mylib) {
  'use strict';

  function jQueryForEachCber (cb, index, elem) {
    cb(elem, index);
  }
  function jQueryForEach (elem, finder, cb) {
    if (!lib.isFunction(cb)) {
      return;
    }
    elem.find(finder).each(jQueryForEachCber.bind(null, cb));
    cb = null;
  }
  mylib.jQueryForEach = jQueryForEach;

  function jQueryReducer (rdcr, cb, elem, index) {
    rdcr.result = cb(rdcr.result, elem, index);
  }
  function jQueryReduce (elem, finder, cb, seed) {
    var rdcr, ret;
    if (!lib.isFunction(cb)) {
      return seed;
    }
    rdcr = {result: seed};
    jQueryForEach(elem, finder, jQueryReducer.bind(null, rdcr, cb));
    ret = rdcr.result;
    rdcr = null;
    return ret;
  }
  mylib.jQueryReduce = jQueryReduce;

  function jQuerySomer (cb, res, elem) {
    if (res) {
      return res;
    }
    return cb(elem);
  }
  function jQuerySome (elem, finder, cb) {
    if (!lib.isFunction(cb)) {
      return false;
    }
    var ret = jQueryReduce(elem, finder, jQuerySomer.bind(null, cb), false);
    cb = null;
    return ret;
  }
  mylib.jQuerySome = jQuerySome;
  
  function jQueryEveryer (cb, res, elem) {
    if (!res) {
      return res;
    }
    return cb(elem);
  }
  function jQueryEvery (elem, finder, cb) {
    if (!lib.isFunction(cb)) {
      return false;
    }
    var ret = jQueryReduce(elem, finder, jQueryEveryer.bind(null, cb), true);
    cb = null;
    return ret;
  }
  mylib.jQueryEvery = jQueryEvery;

  function jQueryPicker (critcb, picker, elem, index) {
    if (critcb(elem, index)) {
      picker.pick = elem;
      return true;
    }
    return false;
  }
  function jQueryPick (elem, finder, critcb) {
    if (!critcb) {
      return;
    }
    var picker, ret;
    picker = {pick: void 0};
    jQuerySome(elem, finder, jQueryPicker.bind(null, critcb, picker));
    ret = picker.pick;
    picker = null;
    critcb = null;
    return ret;
  }
  mylib.jQueryPick = jQueryPick;
}
module.exports = createjQueryTraversals;