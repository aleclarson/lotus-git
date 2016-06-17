var assertTypes, exec, getCurrentBranch, hasBranch, hasChanges, isType, optionTypes;

assertTypes = require("assertTypes");

isType = require("isType");

exec = require("exec");

getCurrentBranch = require("./getCurrentBranch");

hasChanges = require("./hasChanges");

hasBranch = require("./hasBranch");

optionTypes = {
  modulePath: String,
  branchName: String,
  force: Boolean.Maybe
};

module.exports = function(options) {
  var branchName, force, modulePath;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0],
      branchName: arguments[1]
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, branchName = options.branchName, force = options.force;
  return getCurrentBranch(modulePath).then(function(currentBranch) {
    if (currentBranch === branchName) {
      return currentBranch;
    }
    return hasChanges({
      modulePath: modulePath
    }).then(function(hasChanges) {
      if (hasChanges) {
        throw Error("The current branch has uncommitted changes!");
      }
      return hasBranch({
        modulePath: modulePath,
        branchName: branchName
      });
    }).then(function(branchExists) {
      var args;
      args = [branchName];
      if (!branchExists) {
        if (!force) {
          throw Error("Invalid branch name!");
        }
        args.unshift("-b");
      }
      return exec("git checkout", args, {
        cwd: modulePath
      }).fail(function(error) {
        if (/Switched to branch/.test(error.message)) {
          return;
        }
        throw error;
      });
    });
  });
};

//# sourceMappingURL=../../../map/src/core/changeBranch.map
