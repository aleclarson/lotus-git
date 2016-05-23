var assertClean, assertRepo, exec, getBranches, getStatus, hasKeys, log, mergeBranch, stageAll, unstageAll;

hasKeys = require("hasKeys");

exec = require("exec");

log = require("log");

assertClean = require("../core/assertClean");

mergeBranch = require("../core/mergeBranch");

getBranches = require("../core/getBranches");

unstageAll = require("../core/unstageAll");

assertRepo = require("../core/assertRepo");

getStatus = require("../core/getStatus");

stageAll = require("../core/stageAll");

module.exports = function(options) {
  var force, fromBranch, modulePath;
  modulePath = process.cwd();
  fromBranch = options._.shift();
  force = options.force != null ? options.force : options.force = options.f;
  return assertRepo(modulePath).then(function() {
    return assertClean(modulePath);
  }).then(function() {
    if (!fromBranch) {
      log.moat(1);
      log.red("Error: ");
      log.white("Must provide a branch name!");
      log.moat(1);
      return getBranches(modulePath).then(function(branches) {
        var branchName, i, len;
        log.plusIndent(2);
        log.moat(1);
        for (i = 0, len = branches.length; i < len; i++) {
          branchName = branches[i];
          log.white(branchName);
          if (branchName === branches.current) {
            log.green(" *");
          }
          log.moat(1);
        }
        return log.popIndent();
      });
    }
    return mergeBranch({
      modulePath: modulePath,
      fromBranch: fromBranch,
      force: force
    }).then(function() {
      return getStatus(modulePath);
    }).then(function(status) {
      var i, len, path, ref;
      if (status.unmerged.length) {
        log.moat(1);
        log.red("Merge conflicts detected!");
        log.moat(1);
        log.plusIndent(2);
        ref = status.unmerged;
        for (i = 0, len = ref.length; i < len; i++) {
          path = ref[i].path;
          log.white(path);
          log.moat(1);
        }
        log.popIndent();
        return;
      }
      log.moat(1);
      log.green("Merge success! ");
      log.gray.dim("Changes are now staged.");
      log.moat(1);
      if (!hasKeys(status.staged)) {
        return;
      }
      return unstageAll(modulePath).then(function() {
        return exec("git commit", {
          cwd: modulePath
        });
      }).then(function() {
        return stageAll(modulePath);
      });
    });
  });
};

//# sourceMappingURL=../../../map/src/methods/become.map
