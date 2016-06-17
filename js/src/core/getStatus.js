var Finder, assert, assertTypes, escapeStringRegExp, exec, findNewPath, findPath, findStagingStatus, findWorkingStatus, isType, optionTypes, ref, run, statusMap;

escapeStringRegExp = require("escape-string-regexp");

assertTypes = require("assertTypes");

Finder = require("finder");

isType = require("isType");

assert = require("assert");

exec = require("exec");

run = require("run");

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
      if (stagingStatus === "C") {
        stagingStatus = "A";
        file.path = findNewPath(line);
      }
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
        status = statusMap[stagingStatus];
        assert(status, {
          reason: "Unrecognized status!",
          stagingStatus: stagingStatus,
          line: line
        });
        files = (base = results.staged)[status] != null ? base[status] : base[status] = [];
        files.push(file);
      }
      if ((workingStatus !== " ") && (workingStatus !== "?")) {
        status = statusMap[workingStatus];
        assert(status, {
          reason: "Unrecognized status!",
          workingStatus: workingStatus,
          line: line
        });
        files = (base1 = results.tracked)[status] != null ? base1[status] : base1[status] = [];
        files.push(file);
      }
    }
    return results;
  });
};

ref = run(function() {
  var charRegex, chars, regex, statusMap;
  statusMap = {
    "A": "added",
    "C": "copied",
    "R": "renamed",
    "M": "modified",
    "D": "deleted",
    "U": "unmerged",
    "?": "untracked"
  };
  chars = Object.keys(statusMap);
  charRegex = "([" + escapeStringRegExp(chars.join("")) + "\\s]{1})";
  regex = RegExp(["^[\\s]*", charRegex, charRegex, " ", "([^\\s]+)", "( -> ([^\\s]+))?"].join(""));
  return {
    statusMap: statusMap,
    findStagingStatus: Finder({
      regex: regex,
      group: 1
    }),
    findWorkingStatus: Finder({
      regex: regex,
      group: 2
    }),
    findPath: Finder({
      regex: regex,
      group: 3
    }),
    findNewPath: Finder({
      regex: regex,
      group: 5
    })
  };
}), statusMap = ref.statusMap, findStagingStatus = ref.findStagingStatus, findWorkingStatus = ref.findWorkingStatus, findPath = ref.findPath, findNewPath = ref.findNewPath;

//# sourceMappingURL=../../../map/src/core/getStatus.map
