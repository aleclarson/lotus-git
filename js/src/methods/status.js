var ErrorMap, Path, Q, errors, getStatus, isType, printStatus, sync;

ErrorMap = require("ErrorMap");

isType = require("isType");

Path = require("path");

sync = require("sync");

Q = require("q");

printStatus = require("../core/printStatus");

getStatus = require("../core/getStatus");

module.exports = function(options) {
  var Module, config, mods, moduleName, modulePath;
  Module = lotus.Module;
  modulePath = options._.shift();
  if (modulePath) {
    modulePath = Module.resolvePath(modulePath);
    moduleName = Path.relative(lotus.path, modulePath);
    getStatus(modulePath).then(function(results) {
      return printStatus(moduleName, results);
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
    return getStatus(mod.path, config).then(function(results) {
      if (config.raw) {
        if (!results) {
          return;
        }
        log.moat(0);
        log.bold(mod.name);
        return;
      }
      return printStatus(mod.name, results);
    }).fail(function(error) {
      return errors.resolve(error, function() {
        return log.yellow(mod.name);
      });
    });
  })).then(function() {
    if (config.raw) {
      log.moat(1);
    }
    return process.exit();
  }).done();
};

errors = ErrorMap({
  quiet: ["fatal: Not a git repository (or any of the parent directories): .git"]
});

//# sourceMappingURL=../../../map/src/methods/status.map
