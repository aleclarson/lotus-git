var exec, log;

exec = require("exec");

log = require("log");

module.exports = function(modulePath) {
  return exec("git tag", {
    cwd: modulePath
  }).then(function(stdout) {
    var tags;
    tags = stdout.split(log.ln);
    tags.shift();
    return tags;
  });
};

//# sourceMappingURL=../../../map/src/core/getTags.map
