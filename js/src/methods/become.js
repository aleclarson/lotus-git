var exec, git, hasKeys, log;

hasKeys = require("hasKeys");

exec = require("exec");

git = require("git-utils");

log = require("log");

module.exports = function(options) {
  var force, fromBranch, modulePath;
  modulePath = process.cwd();
  fromBranch = options._.shift();
  force = options.force != null ? options.force : options.force = options.f;
  return git.assertRepo(modulePath).then(function() {
    return git.assertClean(modulePath);
  }).then(function() {
    if (!fromBranch) {
      log.moat(1);
      log.red("Error: ");
      log.white("Must provide a branch name!");
      log.moat(1);
      return git.getBranches(modulePath).then(function(branches) {
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
    return git.mergeBranch({
      modulePath: modulePath,
      fromBranch: fromBranch,
      force: force
    }).then(function() {
      return git.getStatus(modulePath);
    }).then(function(status) {
      var hasChanges, i, len, path, ref;
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
        return {
          error: "conflicts"
        };
      }
      hasChanges = hasKeys(status.staged) || hasKeys(status.tracked);
      if (!hasChanges) {
        log.moat(1);
        log.red("Merge did nothing!");
        log.moat(0);
        log.gray.dim("No changes were detected.");
        log.moat(1);
        return exec("git reset", {
          cwd: modulePath
        }).then(function() {
          return {
            error: "empty"
          };
        });
      }
      return git.unstageAll(modulePath).then(function() {
        return exec("git commit", {
          cwd: modulePath
        });
      }).then(function() {
        return git.stageAll(modulePath);
      }).then(function() {
        log.moat(1);
        log.green("Merge success! ");
        log.gray.dim("Changes are now staged.");
        log.moat(1);
        return {
          error: null
        };
      });
    });
  });
};

//# sourceMappingURL=../../../map/src/methods/become.map
