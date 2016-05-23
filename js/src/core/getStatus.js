var Finder, STATUS_REGEX, assert, assertTypes, exec, findNewPath, findPath, findStagingStatus, findWorkingStatus, isType, optionTypes, statusBySymbol;

assertTypes = require("assertTypes");

Finder = require("finder");

isType = require("isType");

assert = require("assert");

exec = require("exec");

STATUS_REGEX = /^[\s]*([ARMDU\?\s]{1})([ARMDU\?\s]{1}) ([^\s]+)( \-\> ([^\s]+))?/;

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
  "U": "unmerged",
  "?": "untracked",
  " ": "unmodified"
};

optionTypes = {
  modulePath: String,
  parseOutput: Boolean.Maybe
};

module.exports = function(options) {
  var modulePath, parseOutput;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0]
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, parseOutput = options.parseOutput;
  return exec("git status --porcelain", {
    cwd: modulePath
  }).then(function(stdout) {
    var base, base1, file, files, i, len, line, ref, results, stagingStatus, status, workingStatus;
    if (parseOutput === false) {
      return stdout;
    }
    results = {
      staged: {},
      tracked: {},
      untracked: [],
      unmerged: []
    };
    if (stdout.length === 0) {
      return results;
    }
    ref = stdout.split("\n");
    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];
      file = {
        path: findPath(line)
      };
      stagingStatus = findStagingStatus(line);
      workingStatus = findWorkingStatus(line);
      if ((stagingStatus === "?") && (workingStatus === "?")) {
        results.untracked.push(file);
        continue;
      }
      if ((stagingStatus === "U") && (workingStatus === "U")) {
        results.unmerged.push(file);
        continue;
      }
      if ((stagingStatus === "R") || (workingStatus === "R")) {
        file.newPath = findNewPath(line);
        file.oldPath = file.path;
        delete file.path;
      }
      if ((stagingStatus !== " ") && (stagingStatus !== "?")) {
        status = statusBySymbol[stagingStatus];
        assert(status, "Unrecognized status: '" + stagingStatus + "'");
        files = (base = results.staged)[status] != null ? base[status] : base[status] = [];
        files.push(file);
      }
      if ((workingStatus !== " ") && (workingStatus !== "?")) {
        status = statusBySymbol[workingStatus];
        assert(status, "Unrecognized status: '" + workingStatus + "'");
        files = (base1 = results.tracked)[status] != null ? base1[status] : base1[status] = [];
        files.push(file);
      }
    }
    return results;
  });
};

//# sourceMappingURL=../../../map/src/core/getStatus.map
