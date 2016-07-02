var Path, Promise, git, log, printBranches, sync;

Promise = require("Promise");

Path = require("path");

sync = require("sync");

git = require("git-utils");

log = require("log");

module.exports = function(options) {
  var moduleName;
  if (moduleName = options._.shift()) {
    return lotus.Module.load(moduleName).then(printBranches);
  }
  return lotus.Module.crawl(lotus.path).then(function(mods) {
    return Promise.chain(mods, function(mod) {
      return printBranches(mod);
    });
  });
};

printBranches = function(mod) {
  return git.getBranches(mod.path).then(function(branches) {
    if (branches.length === 0) {
      return;
    }
    log.moat(1);
    log.yellow(mod.name);
    log.moat(0);
    log.plusIndent(2);
    log.gray.dim(branches.join("\n"));
    log.popIndent();
    return log.moat(1);
  });
};

//# sourceMappingURL=../../../map/src/methods/branches.map
