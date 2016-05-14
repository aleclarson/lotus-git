var Finder, STATUS_REGEX, assert, exec, findNewPath, findPath, findStagingStatus, findWorkingStatus, statusBySymbol, sync;

Finder = require("finder");

assert = require("assert");

sync = require("sync");

exec = require("exec");

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

module.exports = function(modulePath, options) {
  if (options == null) {
    options = {};
  }
  return exec("git status --porcelain", {
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

//# sourceMappingURL=../../../map/src/core/getStatus.map
