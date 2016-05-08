var Finder, STATUS_REGEX, colorByStatus, exec, exports, findNewPath, findPath, findStagingStatus, findWorkingStatus, statusBySymbol, sync;

Finder = require("finder");

sync = require("sync");

exec = require("./exec");

STATUS_REGEX = /^[\s]*([ARMD\s\?]{1})([ARMD\s\?]{1}) ([^\s]+)( \-\> ([^\s]+))?/;

findStagingStatus = Finder({
  regex: STATUS_REGEX,
  group: 1
});

findWorkingStatus = Finder({
  regex: STATUS_REGEX,
  group: 2
});

findPath = Finder({
  regex: STATUS_REGEX,
  group: 3
});

findNewPath = Finder({
  regex: STATUS_REGEX,
  group: 5
});

statusBySymbol = {
  "A": "added",
  "R": "renamed",
  "M": "modified",
  "D": "deleted",
  " ": "unmodified",
  "?": "untracked"
};

module.exports = exports = function(modulePath, options) {
  if (options == null) {
    options = {};
  }
  return exec("status", ["--porcelain"], {
    cwd: modulePath
  }).then(function(stdout) {
    var lines, results;
    if (stdout.length === 0) {
      return;
    }
    if (options.raw) {
      return stdout;
    }
    lines = stdout.split("\n");
    if (options.parseLines === false) {
      return lines;
    }
    results = {
      staged: {},
      tracked: {},
      untracked: []
    };
    sync.each(lines, function(line) {
      var base, base1, file, files, path, stagingStatus, status, workingStatus;
      path = findPath(line);
      stagingStatus = findStagingStatus(line);
      workingStatus = findWorkingStatus(line);
      if ((stagingStatus === "?") && (workingStatus === "?")) {
        results.untracked.push({
          path: path
        });
        return;
      }
      if ((stagingStatus !== " ") && (stagingStatus !== "?")) {
        status = statusBySymbol[stagingStatus];
        assert(status != null, "Unrecognized status: '" + stagingStatus + "'");
        files = (base = results.staged)[status] != null ? base[status] : base[status] = [];
        file = {
          path: path
        };
      } else if ((workingStatus !== " ") && (workingStatus !== "?")) {
        status = statusBySymbol[workingStatus];
        assert(status != null, "Unrecognized status: '" + workingStatus + "'");
        files = (base1 = results.tracked)[status] != null ? base1[status] : base1[status] = [];
        file = {
          path: path
        };
      }
      if ((stagingStatus === "R") || (workingStatus === "R")) {
        file.newPath = findNewPath(line);
        file.oldPath = file.path;
        delete file.path;
      }
      return files.push(file);
    });
    return results;
  });
};

exports.printPaths = function(status, color, files) {
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

colorByStatus = {
  added: "green",
  modified: "yellow",
  renamed: "green",
  deleted: "red",
  untracked: "cyan"
};

exports.printModuleStatus = function(moduleName, results) {
  var files, key, status, value;
  if (!isType(results, Object)) {
    return;
  }
  log.pushIndent(2);
  log.moat(1);
  log.bold(moduleName);
  log.plusIndent(2);
  for (key in results) {
    value = results[key];
    if (isType(value, Array)) {
      exports.printPaths(key, colorByStatus[key], value);
      log.popIndent();
      continue;
    }
    for (status in value) {
      files = value[status];
      exports.printPaths(key + "." + status, colorByStatus[status], files);
    }
  }
  log.popIndent();
  return log.moat(1);
};

//# sourceMappingURL=../../../map/src/core/status.map
