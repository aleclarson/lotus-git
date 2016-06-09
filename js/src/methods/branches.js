var Path, Promise, errorConfig, getBranches, log, printBranches, sync;

Promise = require("Promise");

Path = require("path");

sync = require("sync");

log = require("log");

getBranches = require("../core/getBranches");

module.exports = function(options) {
  var Module, mod, mods, moduleName, modulePath;
  Module = lotus.Module;
  modulePath = options._.shift();
  if (modulePath) {
    modulePath = Module.resolvePath(modulePath);
    moduleName = Path.basename(modulePath);
    mod = Module(moduleName);
    return printBranches(mod);
  }
  mods = Module.crawl(lotus.path);
  return Promise.chain(mods, function(mod) {
    return printBranches(mod);
  });
};

printBranches = function(mod) {
  return getBranches({
    modulePath: mod.path
  }).then(function(branches) {
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
  }).fail(function(error) {
    return mod.reportError(error, errorConfig);
  });
};

errorConfig = {
  quiet: ["fatal: Not a git repository (or any of the parent directories): .git"]
};

//# sourceMappingURL=../../../map/src/methods/branches.map
