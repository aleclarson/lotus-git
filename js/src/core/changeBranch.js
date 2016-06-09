var assertTypes, exec, hasChanges, optionTypes;

assertTypes = require("assertTypes");

exec = require("exec");

hasChanges = require("./hasChanges");

optionTypes = {
  modulePath: String,
  branchName: String,
  force: Boolean.Maybe
};

module.exports = function(options) {
  var branchName, force, modulePath;
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
      });
    }).then(function() {
      return currentBranch;
    });
  });
};

//# sourceMappingURL=../../../map/src/core/changeBranch.map
