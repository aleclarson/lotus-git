var Path, Promise, assert, exec, git, isType, log, sync;

Promise = require("Promise");

isType = require("isType");

assert = require("assert");

Path = require("path");

sync = require("sync");

exec = require("exec");

git = require("git-utils");

log = require("log");

module.exports = function(options) {
  var moduleName;
  moduleName = options._.shift();
  assert(moduleName, "Must provide a 'moduleName'!");
  return lotus.Module.load(moduleName).then(function(module) {
    return git.getTags(module.path).then(function(tags) {
      if (!tags.length) {
        log.moat(1);
        log.gray.dim("No tags exist.");
        log.moat(1);
        return;
      }
      return exec.async("git tag -d", tags, {
        cwd: module.path
      }).then(function() {
        if (!isType(options.remote, String)) {
          return;
        }
        return Promise.all(sync.map(tags, function(tag) {
          return exec.async("git push --delete " + options.remote + " " + tag);
        }));
      }).then(function() {
        log.moat(1);
        log.white("Deleted ");
        log.red(tags.length);
        log.white(" tags!");
        return log.moat(1);
      });
    });
  });
};

//# sourceMappingURL=map/deleteAllTags.map
