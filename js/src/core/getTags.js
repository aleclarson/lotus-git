var assertType, exec, log;

assertType = require("assertType");

exec = require("exec");

log = require("log");

module.exports = function(modulePath) {
  assertType(modulePath, String);
  return exec("git tag", {
    cwd: modulePath
  }).then(function(stdout) {
    if (stdout.length === 0) {
      return [];
    }
    return stdout.split(log.ln);
  });
};

//# sourceMappingURL=../../../map/src/core/getTags.map
