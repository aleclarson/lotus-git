var Path, Promise, exec, getTags, isType, log, sync;

Promise = require("Promise");

isType = require("isType");

Path = require("path");

sync = require("sync");

exec = require("exec");

log = require("log");

getTags = require("../core/getTags");

module.exports = function(options) {
  var Module, modulePath;
  Module = lotus.Module;
  modulePath = options._.shift();
  assert(modulePath, "Must provide a 'modulePath'!");
  modulePath = Module.resolvePath(modulePath);
  return getTags(modulePath).then(function(tags) {
    if (!tags.length) {
      log.moat(1);
      log.gray.dim("No tags exist.");
      log.moat(1);
      return;
    }
    return exec("git tag -d", tags, {
      cwd: modulePath
    }).then(function() {
      if (!isType(options.remote, String)) {
        return;
      }
      return Promise.all(sync.map(tags, function(tag) {
        return exec("git push --delete " + options.remote + " " + tag);
      }));
    }).then(function() {
      log.moat(1);
      log.white("Deleted ");
      log.red(tags.length);
      log.white(" tags!");
      return log.moat(1);
    });
  });
};

//# sourceMappingURL=../../../map/src/methods/deleteAllTags.map
