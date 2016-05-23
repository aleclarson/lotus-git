var assertTypes, exec, optionTypes;

assertTypes = require("assertTypes");

exec = require("exec");

optionTypes = {
  modulePath: String,
  branchName: String,
  remoteName: String.Maybe
};

module.exports = function() {
  var branchName, modulePath, remoteName;
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, branchName = options.branchName, remoteName = options.remoteName;
  return exec("git branch -D " + branchName, {
    cwd: modulePath
  }).then(function() {
    if (!remoteName) {
      return;
    }
    return exec("git push " + remoteName + " --delete " + branchName, {
      cwd: modulePath
    });
  }).fail(function(error) {
    var expected, lines;
    expected = "error: Cannot delete the branch '" + branchName + "' which you are currently on.";
    if (error.message === expected) {
      throw Error("Cannot delete the current branch!");
    }
    lines = error.message.split(log.ln);
    expected = "fatal: '" + branchName + "' does not appear to be a git repository";
    if (lines[0] === expected) {
      throw Error("The given remote repository does not exist!");
    }
    throw error;
  });
};

//# sourceMappingURL=../../../map/src/core/removeBranch.map
