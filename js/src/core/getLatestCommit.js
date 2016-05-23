var Q, assertTypes, exec, getCurrentBranch, hasBranch, isType, optionTypes;

assertTypes = require("assertTypes");

isType = require("isType");

exec = require("exec");

Q = require("q");

getCurrentBranch = require("./getCurrentBranch");

hasBranch = require("./hasBranch");

optionTypes = {
  modulePath: String,
  remoteName: String.Maybe,
  branchName: String.Maybe
};

module.exports = function(options) {
  var branchName, modulePath, remoteName;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0],
      remoteName: arguments[1],
      branchName: arguments[2]
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, remoteName = options.remoteName, branchName = options.branchName;
  if (remoteName == null) {
    remoteName = "origin";
  }
  return Q["try"](function() {
    if (branchName) {
      return hasBranch(modulePath, branchName).then(function(hasBranch) {
        if (!hasBranch) {
          return branchName = null;
        }
      });
    }
    return getCurrentBranch(modulePath).then(function(currentBranch) {
      return branchName = currentBranch;
    });
  }).then(function() {
    var args;
    if (branchName === null) {
      return null;
    }
    args = ["-1", "--pretty=oneline", remoteName + "/" + branchName];
    return exec("git log", args, {
      cwd: modulePath
    }).then(function(stdout) {
      var spaceIndex;
      spaceIndex = stdout.indexOf(" ");
      return {
        id: stdout.slice(0, spaceIndex),
        message: stdout.slice(spaceIndex + 1)
      };
    });
  });
};

//# sourceMappingURL=../../../map/src/core/getLatestCommit.map
