var assertType, exec;

assertType = require("assertType");

exec = require("exec");

module.exports = function(modulePath) {
  assertType(modulePath, String);
  return exec("git stash pop", {
    cwd: modulePath
  });
};

//# sourceMappingURL=../../../map/src/core/popStash.map
