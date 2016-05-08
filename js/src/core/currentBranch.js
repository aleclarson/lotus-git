var assertType, exec;

assertType = require("type-utils").assertType;

exec = require("./exec");

module.exports = function(modulePath) {
  assertType(modulePath, String);
  return exec("rev-parse", ["--abbrev-ref", "HEAD"], {
    cwd: modulePath
  });
};

//# sourceMappingURL=../../../map/src/core/currentBranch.map
