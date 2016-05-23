var assertType, exec;

assertType = require("assertType");

exec = require("exec");

module.exports = function(modulePath) {
  assertType(modulePath, String);
  return exec("git add --all :/", {
    cwd: modulePath
  });
};

//# sourceMappingURL=../../../map/src/core/stageAll.map
