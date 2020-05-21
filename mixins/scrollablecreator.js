function createScrollableMixin (lib, mylib) {
  'use strict';

  function ScrollableMixin () {
    this.scroller = this.onElementScrolled.bind(this);
    this.lastScrollPos = null;
    this.lastElementHeight = null;
    this.lastBodyHeight = null;
  }
  ScrollableMixin.prototype.destroy = function () {
    if (this.scroller && this.$element) {
      this.$element.off('scroll', this.scroller);
    }
    this.lastBodyHeight = null;
    this.lastElementHeight = null;
    this.lastScrollPos = null;
    this.scroller = null;
  };
  ScrollableMixin.prototype.startListeningToElementScroll = function () {
    if (!this.$element) {
      return;
    }
    this.lastScrollPos = this.$element.scrollTop;
    this.lastElementHeight = this.$element.height();
    this.lastBodyHeight = $('body').height();
    this.$element.on('scroll', this.scroller);
    $(window).resize(this.scrollBottomIfSmallerHeight.bind(this)).resize();
    /*
		$(window).resize(function () {
      $('.Messages').scrollTop(9999999999);
	  }).resize();
    */
  };
  ScrollableMixin.prototype.onElementScrolled = function () {
    var prevpos = this.lastScrollPos,
      sc = elementScrolledChecker.call(this),
      down;
    if (!sc) {
      return;
    }
    this.lastScrollPos = sc.pos;
    down = this.lastScrollPos > prevpos;
    if (sc.atTop && !down) {
      this.onElementScrolledToTop();
    }
    if (sc.atBottom && down) {
      this.onElementScrolledToBottom();
    }
  };
  ScrollableMixin.prototype.elementIsScrolledToTop = function (tolerance) {
    var sc = elementScrolledChecker.call(this, tolerance);
    return (sc && sc.atTop);
  };
  ScrollableMixin.prototype.elementIsScrolledToBottom = function (tolerance) {
    var sc = elementScrolledChecker.call(this, tolerance);
    return (sc && sc.atBottom);
  };
  ScrollableMixin.prototype.onElementScrolledToTop = lib.dummyFunc;
  ScrollableMixin.prototype.onElementScrolledToBottom = lib.dummyFunc;
  ScrollableMixin.prototype.scrollElementToTop = function () {
    if (!this.$element) {
      return;
    }
    this.$element.scrollTop(0);
  };
  ScrollableMixin.prototype.scrollElementToBottom = function () {
    if (!this.$element) {
      return;
    }
    this.$element.scrollTop(this.$element[0].scrollHeight);
  };
  ScrollableMixin.prototype.scrollBottomIfSmallerHeight = function () {
    //console.log('LAST HEIGHT',this.lastElementHeight,'NEW HEIGHT', this.$element.height());
    //initially element height is 0 or negative depending on margin so we use body
    if (this.lastElementHeight <= 0){
      if (this.lastBodyHeight > $('body').height()){
        this.scrollElementToBottomUnknown();
      }
    }else{
      if (this.lastElementHeight > this.$element.height()){
        this.scrollElementToBottomUnknown();
      }
    }
    this.lastElementHeight = this.$element.height();
    this.lastBodyHeight = $('body').height();
  };
  ScrollableMixin.prototype.scrollElementToBottomUnknown = function () {
    if (!this.$element) {
      return;
    }
    this.$element.scrollTop(9999999999);
  }
  ScrollableMixin.prototype.elementIsWithinTheScrollableArea = function (el, tolerance) {
    /*
    var st, ret, scrollTop, innerHeight, eltop, elheight;
    st = this.getConfigVal('scroll_tolerance');
    tolerance = lib.isNumber(tolerance) ? tolerance : (lib.isNumber(st) ? st : 0);
    scrollTop = this.$element.scrollTop();
    innerHeight = this.$element.innerHeight();
    eltop = el.offset().top;
    elheight = el.height();
    if (eltop>=scrollTop && eltop+elheight<=scrollTop+innerHeight) {
      return true;
    }
    return false;
    */
    var mytop, myheight, eltop, elheight;
    if (!this.$element) {
      return false;
    }
    mytop = this.$element.position().top;
    myheight = this.$element.innerHeight();
    eltop = el.position().top - mytop;
    elheight = el.outerHeight();
    //console.log('within?', el.attr('allexid'), 'eltop', eltop, 'elheight', elheight, 'vs myheight', myheight);
    return (eltop>=0) && (eltop+elheight<=myheight);
  };

  //static
  function elementScrolledChecker (tolerance) {
    var ret, scrollTop, innerHeight, scrollHeight, st;
    st = this.getConfigVal('scroll_tolerance');
    tolerance = lib.isNumber(tolerance) ? tolerance : (lib.isNumber(st) ? st : 0);
    ret = {
      pos: 0,
      atTop: false,
      atBottom: false
    };
    if (!this.$element) {
      return ret;
    }
    scrollTop = this.$element.scrollTop();
    ret.pos = scrollTop;
    if (scrollTop <= 0+tolerance) {
      ret.atTop = true;
    }
    innerHeight = this.$element.innerHeight();
    scrollHeight = this.$element[0].scrollHeight;
    /*
    console.log('scrollTop', scrollTop);
    console.log('innerHeight', innerHeight);
    console.log('scrollHeight', scrollHeight);
    */
    if (scrollTop+innerHeight+tolerance >= scrollHeight) {
      ret.atBottom = true;
    }
    return ret;
  }

  ScrollableMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, ScrollableMixin
      ,'startListeningToElementScroll'
      ,'onElementScrolled'
      ,'onElementScrolledToTop'
      ,'onElementScrolledToBottom'
      ,'elementIsScrolledToTop'
      ,'elementIsScrolledToBottom'
      ,'scrollElementToTop'
      ,'scrollElementToBottom'
      ,'scrollBottomIfSmallerHeight'
      ,'scrollElementToBottomUnknown'
      ,'elementIsWithinTheScrollableArea'
    );
    klass.prototype.postInitializationMethodNames = klass.prototype.postInitializationMethodNames.concat('startListeningToElementScroll');
  };

  mylib.Scrollable = ScrollableMixin;
}
module.exports = createScrollableMixin;
