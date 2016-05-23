var Path, Q, assertRepo, exec, isRepo, log;

Path = require("path");

exec = require("exec");

log = require("log");

Q = require("q");

isRepo = require("./isRepo");

module.exports = assertRepo = function(modulePath) {
  var moduleName, shouldInit;
  if (isRepo(modulePath)) {
    return Q();
  }
  moduleName = Path.resolve(lotus.path, modulePath);
  log.moat(1);
  log.red(moduleName);
  log.white(" is not a git repository!");
  log.moat(1);
  log.gray.dim("Want to call ");
  log.yellow("git init");
  log.gray.dim("?");
  shouldInit = prompt.sync({
    parseBool: true
  });
  log.moat(1);
  if (!shouldInit) {
    return Q();
  }
  return exec("git init", {
    cwd: modulePath
  });
};

//# sourceMappingURL=../../../map/src/core/assertRepo.map
