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
  };
  ScrollableMixin.prototype.elementIsWithinTheScrollableArea = function (el, tolerance) {
    var gr = new GeometryReader(this, el), ret = gr.isChildWithinVisible();
    gr.destroy();
    return ret;
  };
  ScrollableMixin.prototype.scrollToSeeElementAtBottom = function (el) {
    var gr = new GeometryReader(this, el), scrolltop = gr.scrollTopForChildAtBottom();
    dumpGeometriesForChildren.call(this);
    console.log('should scrolltop', scrolltop, 'gr', gr, 'current', this.$element.scrollTop());
    this.$element.scrollTop(scrolltop);
    console.log('finally', this.$element.scrollTop());
    gr.destroy();
  };

  //helper classes
  function GeometryReader (scrollable, elem) {
    this.scrolltop = scrollable.$element.scrollTop();
    this.mastertop = scrollable.$element.position().top;
    this.masterheight = scrollable.$element.innerHeight();
    this.childtop = elem.position().top - this.mastertop;
    this.childheight = elem.outerHeight();
  }
  GeometryReader.prototype.destroy = function () {
    this.childheight = null;
    this.childtop = null;
    this.masterheight = null;
    this.mastertop = null;
    this.scrolltop = null;
  };
  GeometryReader.prototype.isChildWithinVisible = function () {
    return this.childtop >=0 && (this.childtop+this.childheight < this.masterheight);
  };
  GeometryReader.prototype.scrollTopForChildAtBottom = function () {
    return this.scrolltop + (this.childtop+this.childheight) - this.masterheight;
  };
  //helper classes end

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
  function dumpGeometriesForChildren () {
    console.log('children dump');
    this.$element.children().each(childGeometryDumper.bind(this));
  }
  function childGeometryDumper (index, el) {
    var gr = new GeometryReader(this, jQuery(el));
    console.log(gr);
    gr.destroy();
  }
  //static end

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
      ,'scrollToSeeElementAtBottom'
    );
    klass.prototype.postInitializationMethodNames = klass.prototype.postInitializationMethodNames.concat('startListeningToElementScroll');
  };

  mylib.Scrollable = ScrollableMixin;
}
module.exports = createScrollableMixin;
