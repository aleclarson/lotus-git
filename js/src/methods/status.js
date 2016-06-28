var Path, Promise, exec, git, log, printStatus, sync;

Promise = require("Promise");

Path = require("path");

sync = require("sync");

exec = require("exec");

git = require("git-utils");

log = require("log");

printStatus = require("../utils/printStatus");

module.exports = function(options) {
  var Module, mods, modulePath;
  Module = lotus.Module;
  modulePath = options._.shift();
  if (modulePath) {
    modulePath = Module.resolvePath(modulePath);
    return git.assertRepo(modulePath).then(function() {
      return git.getStatus(modulePath, {
        raw: options.names !== true
      });
    }).then(function(results) {
      var moduleName;
      moduleName = Path.relative(lotus.path, modulePath);
      return printStatus(moduleName, results);
    }).fail(function(error) {
      throw error;
    });
  }
  log.clear();
  if (options.names) {
    log.moat(1);
  }
  mods = Module.crawl(lotus.path);
  log.moat(1);
  log.white("Found ");
  log.yellow(mods.length);
  log.white(" modules in ");
  log.cyan(lotus.path);
  log.moat(1);
  return Promise.map(mods, function(mod) {
    if (!git.isRepo(mod.path)) {
      return;
    }
    return git.getStatus(mod.path, {
      raw: options.names !== true
    }).then(function(status) {
      if (options.names) {
        if (!status.length) {
          return;
        }
        log.moat(0);
        log.bold(mod.name);
        return;
      }
      return printStatus(mod.name, status);
    });
  }).then(function() {
    if (options.names) {
      return log.moat(1);
    }
  });
};

//# sourceMappingURL=../../../map/src/methods/status.map
