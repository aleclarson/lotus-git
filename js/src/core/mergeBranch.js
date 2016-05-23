var OneOf, assertClean, assertTypes, changeBranch, exec, optionTypes;

assertTypes = require("assertTypes");

OneOf = require("OneOf");

exec = require("exec");

changeBranch = require("./changeBranch");

assertClean = require("./assertClean");

optionTypes = {
  modulePath: String,
  fromBranch: String,
  toBranch: String.Maybe,
  force: Boolean.Maybe
};

module.exports = function(options) {
  var force, fromBranch, modulePath, toBranch;
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, fromBranch = options.fromBranch, toBranch = options.toBranch, force = options.force;
  return assertClean(modulePath).then(function() {
    if (!toBranch) {
      return;
    }
    return changeBranch({
      modulePath: modulePath,
      branchName: toBranch
    });
  }).then(function() {
    var args;
    args = [fromBranch, "--no-commit"];
    if (force) {
      args.push("-X", "theirs");
    }
    return exec("git merge", args, {
      cwd: modulePath
    });
  }).fail(function(error) {
    var expected;
    expected = "Automatic merge went well; stopped before committing as requested";
    if (error.message === expected) {
      return;
    }
    throw error;
  });
};

//# sourceMappingURL=../../../map/src/core/mergeBranch.map
