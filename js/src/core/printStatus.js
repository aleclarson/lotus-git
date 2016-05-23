var colorByStatus, hasKeys, isType, log, printPaths, sync;

hasKeys = require("hasKeys");

isType = require("isType");

sync = require("sync");

log = require("log");

colorByStatus = {
  added: "green",
  modified: "yellow",
  renamed: "green",
  deleted: "red",
  untracked: "cyan"
};

module.exports = function(moduleName, results) {
  var files, hasResults, key, status, value;
  if (!isType(results, Object)) {
    return;
  }
  if (!hasKeys(results)) {
    return;
  }
  hasResults = false;
  sync.each(results, function(value) {
    if (hasKeys(value)) {
      return hasResults = true;
    }
  });
  if (!hasResults) {
    return;
  }
  log.pushIndent(2);
  log.moat(1);
  log.bold(moduleName);
  log.plusIndent(2);
  for (key in results) {
    value = results[key];
    if (isType(value, Array)) {
      printPaths(key, colorByStatus[key], value);
      log.popIndent();
      continue;
    }
    for (status in value) {
      files = value[status];
      printPaths(key + "." + status, colorByStatus[status], files);
    }
  }
  log.popIndent();
  return log.moat(1);
};

printPaths = function(status, color, files) {
  var file, i, len;
  if (files.length === 0) {
    return;
  }
  log.moat(1);
  log[color](status);
  log.plusIndent(2);
  for (i = 0, len = files.length; i < len; i++) {
    file = files[i];
    log.moat(0);
    if (file.newPath) {
      log.gray.dim(file.oldPath);
      log.white(" -> ");
      log.gray.dim(file.newPath);
    } else {
      log.gray.dim(file.path);
    }
  }
  log.popIndent();
  return log.moat(1);
};

//# sourceMappingURL=../../../map/src/core/printStatus.map
