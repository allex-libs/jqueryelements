function createReadFileJob (lib, mylib) {
  'use strict';

  var JobOnDestroyable = lib.qlib.JobOnDestroyable;

  function humanReadableFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }

  function FileRepresentation (binary, file, evnt) {
    this.binary = binary;
    this.name = file.name;
    this.lastModified = file.lastModified;
    this.size = file.size;
    this.humanReadableSize = humanReadableFileSize(file.size);
    this.type = file.type;
    this.contents = (evnt && evnt.target && evnt.target.result) ? evnt.target.result : null;
  }
  FileRepresentation.prototype.destroy = function () {
    this.contents = null;
    this.type = null;
    this.humanReadableSize = null;
    this.size = null;
    this.lastModified = null;
    this.name = null;
    this.binary = null;
  };
  FileRepresentation.prototype.lineCount = function () {
    if (this.binary) {
      return null;
    }
    return this.contents.split('\n').length;
  }
  FileRepresentation.prototype.lines = function () {

  };

  function ReadFileJob (elem, file, defer) {
    JobOnDestroyable.call(this, elem, defer);
    this.file = file;
    this.reader = new FileReader();
    this.binary = null;
    this.reader.onload = this.onLoaded.bind(this);
    this.reader.onerror = this.reject.bind(this);
    this.reader.onprogress = this.onProgress.bind(this);
  }
  lib.inherit(ReadFileJob, JobOnDestroyable);
  ReadFileJob.prototype.destroy = function () {
    this.binary = null;
    if (this.reader) {
      this.reader.onload = null;
      this.reader.onerror = null;
    }
    this.reader = null;
    this.file = null;
    JobOnDestroyable.prototype.destroy.call(this);
  };
  ReadFileJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    lib.runNext(this.init.bind(this));
    return ok.val;
  };
  ReadFileJob.prototype.init = function () {
    if (!this.file) {
      this.reject(new lib.Error('NO_FILE_TO_READ', 'There is no file to read'));
      return;
    }
    if (this.file.type.match('image.*')) {
      this.binary = true;
      this.reader.readAsDataURL(this.file);
      return;
    }
    this.binary = false;
    this.reader.readAsText(this.file, 'UTF-8');
  };
  ReadFileJob.prototype.onLoaded = function (evnt) {
    if (!this.okToProceed()) {
      return;
    }
    this.resolve(new FileRepresentation(this.binary, this.file, evnt));
  };
  ReadFileJob.prototype.onProgress = function (evnt) {
    if (!(evnt && evnt.lengthComputable)) {
      return;
    }
    this.notify(Math.round(evnt.loaded/evnt.total * 10000)/100);
  };

  mylib.ReadFileJob = ReadFileJob;
}
module.exports = createReadFileJob;
