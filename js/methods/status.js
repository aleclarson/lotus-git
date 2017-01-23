var Path, Promise, exec, git, log, printStatus, sync;

Promise = require("Promise");

Path = require("path");

sync = require("sync");

exec = require("exec");

git = require("git-utils");

log = require("log");

printStatus = require("../utils/printStatus");

module.exports = function(options) {
  var moduleName;
  if (moduleName = options._.shift()) {
    return lotus.Module.load(moduleName).then(function(module) {
      if (!git.isRepo(module.path)) {
        throw Error("Expected a repository: '" + module.path + "'");
      }
      return git.getStatus(module.path).then(function(status) {
        return printStatus(module.name, status);
      });
    });
  }
  if (options.names) {
    log.moat(1);
  }
  return lotus.Module.crawl(lotus.path).then(function(modules) {
    log.moat(1);
    log.white("Found ");
    log.yellow(modules.length);
    log.white(" modules in ");
    log.cyan(lotus.path);
    log.moat(1);
    return Promise.chain(modules, function(module) {
      if (!git.isRepo(module.path)) {
        return;
      }
      if (lotus.isModuleIgnored(module.name)) {
        return;
      }
      return git.getStatus(module.path, {
        raw: options.names
      }).then(function(status) {
        if (options.names) {
          if (!status.length) {
            return;
          }
          log.moat(0);
          log.bold(module.name);
          return;
        }
        return printStatus(module.name, status);
      });
    }).then(function() {
      if (options.names) {
        return log.moat(1);
      }
    });
  });
};

//# sourceMappingURL=map/status.map
