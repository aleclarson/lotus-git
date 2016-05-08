var Path, Q, errorConfig, git, isType, sync;

isType = require("type-utils").isType;

Path = require("path");

sync = require("sync");

Q = require("q");

git = require("../core");

module.exports = function(options) {
  var Module, config, mods, moduleName, modulePath;
  Module = lotus.Module;
  modulePath = options._.shift();
  if (modulePath) {
    modulePath = Module.resolvePath(modulePath);
    moduleName = Path.relative(lotus.path, modulePath);
    git.status(modulePath).then(function(results) {
      return git.status.printModuleStatus(moduleName, results);
    }).fail(function(error) {
      log.moat(1);
      log.red(moduleName);
      log.moat(0);
      log.gray.dim(error.stack);
      return log.moat(1);
    }).then(function() {
      return process.exit();
    }).done();
    return;
  }
  config = {
    raw: options.names === true
  };
  log.clear();
  mods = Module.crawl(lotus.path);
  if (config.raw) {
    log.moat(1);
  }
  return Q.all(sync.map(mods, function(mod) {
    return git.status(mod.path, config).then(function(results) {
      if (config.raw) {
        if (!results) {
          return;
        }
        log.moat(0);
        log.bold(mod.name);
        return;
      }
      return git.status.printModuleStatus(mod.name, results);
    }).fail(function(error) {
      return mod.reportError(error, errorConfig);
    });
  })).then(function() {
    if (config.raw) {
      log.moat(1);
    }
    return process.exit();
  }).done();
};

errorConfig = {
  quiet: ["fatal: Not a git repository (or any of the parent directories): .git"]
};

//# sourceMappingURL=../../../map/src/methods/status.map
