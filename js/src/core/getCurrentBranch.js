var assertType, exec;

assertType = require("assertType");

exec = require("exec");

module.exports = function(modulePath) {
  assertType(modulePath, String);
  return exec("git rev-parse --abbrev-ref HEAD", {
    cwd: modulePath
  }).fail(function(error) {
    if (/ambiguous argument 'HEAD'/.test(error.message)) {
      return null;
    }
    throw error;
  });
};

//# sourceMappingURL=../../../map/src/core/getCurrentBranch.map
