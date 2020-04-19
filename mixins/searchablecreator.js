function createSearchableMixin (lib, mylib) {
  'use strict';

  function SearchableMixin () {
    this.onsearchchanger = this.onSearchInputChange.bind(this);
    this.onsearchfocuser = this.onSearchFocus.bind(this);
    this.search = null;
  }
  SearchableMixin.prototype.destroy = function () {
    if (this.search && this.onsearchchanger && this.onsearchfocuser) {
      this.search.off('keyup', this.onsearchchanger);
      this.search.off('focus', this.onsearchfocuser);
    }
    this.search = null;
    this.onsearchfocuser = null;
    this.onsearchchanger = null;
  };
  SearchableMixin.prototype.init = function () {
    this.search = this.$element.find(this.getConfigVal('search_input_finder'));
    this.search.on('keyup', this.onsearchchanger);
    this.search.on('focus', this.onsearchfocuser);
  };
  SearchableMixin.prototype.onSearchInputChange = function () {
    if (!this.search) {
      return;
    }
    this.filterOnSearchInputValue(this.search.val());
  };
  SearchableMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, SearchableMixin
      ,'onSearchInputChange'
    );
  };

  mylib.Searchable = SearchableMixin;
}
module.exports = createSearchableMixin;
