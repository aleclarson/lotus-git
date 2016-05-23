var Path, assertType, exec, getCurrentBranch, hasChanges, log, pushStash;

assertType = require("assertType");

Path = require("path");

exec = require("exec");

log = require("log");

getCurrentBranch = require("./getCurrentBranch");

hasChanges = require("./hasChanges");

pushStash = require("./pushStash");

module.exports = function(modulePath) {
  assertType(modulePath, String);
  return hasChanges({
    modulePath: modulePath
  }).then(function(hasChanges) {
    if (!hasChanges) {
      return;
    }
    return getCurrentBranch(modulePath).then(function(branchName) {
      var moduleName, shouldStash;
      if (branchName === null) {
        throw Error("An initial commit must exist!");
      }
      moduleName = Path.relative(lotus.path, modulePath);
      log.moat(1);
      log.red(moduleName + "/" + branchName);
      log.white(" has uncommitted changes!");
      log.moat(1);
      log.gray.dim("Want to call ");
      log.yellow("git stash");
      log.gray.dim("?");
      shouldStash = prompt.sync({
        parseBool: true
      });
      log.moat(1);
      if (!shouldStash) {
        throw Error("The current branch has uncommitted changes!");
      }
      return pushStash(modulePath);
    });
  });
};

//# sourceMappingURL=../../../map/src/core/assertClean.map
