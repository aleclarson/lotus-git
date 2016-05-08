var Path, Q, errorConfig, git, printBranches, sync;

Path = require("path");

sync = require("sync");

Q = require("q");

git = require("../core");

module.exports = function(options) {
  var Module, mod, mods, moduleName, modulePath;
  Module = lotus.Module;
  modulePath = options._.shift();
  if (modulePath) {
    modulePath = Module.resolvePath(modulePath);
    moduleName = Path.relative(lotus.path, modulePath);
    mod = Module(moduleName);
    printBranches(mod).then(function() {
      return process.exit();
    }).done();
    return;
  }
  mods = Module.crawl(lotus.path);
  return Q.all(sync.map(mods, printBranches)).then(function() {
    return process.exit();
  }).done();
};

printBranches = function(mod) {
  return git.branches(mod.path).then(function(branches) {
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
