var git, inArray;

inArray = require("in-array");

git = require("../core");

module.exports = function(options) {
  var Module, newBranch;
  Module = lotus.Module;
  newBranch = options._.shift();
  assertType(newBranch, String);
  return Module.crawl(lotus.path).then(function(mods) {
    return Q.all(sync.map(mods, function(mod) {
      return git.getBranchNames(mod.path).then(function(branches) {
        if (branches.current === newBranch) {
          log.moat(1);
          log.yellow(mod.name);
          log.gray.dim(" *");
          log.moat(1);
          return mod;
        }
        if (!inArray(branches, newBranch)) {
          return null;
        }
        return git.status(mod.path).then(function(results) {
          var ignore, ignored, stash;
          if (!results) {
            return null;
          }
          ignored = false;
          ignore = function() {
            ignored = true;
            return prompt._close();
          };
          stash = function() {
            return git("stash", {
              cwd: mod.path
            });
          };
          git.status.printModuleStatus(mod.name, results);
          repl.sync({
            stash: stash,
            ignore: ignore
          });
          if (ignored) {
            return null;
          }
          return mod;
        });
      });
    })).then(function(mods) {
      mods = sync.filter(mods, function(mod) {
        if (!isType(mod, Module)) {
          return false;
        }
        log.moat(1);
        log.yellow(mod.name);
        log.moat(1);
        return true;
      });
      log.moat(1);
      log.white("Found ");
      log.yellow(mods.length);
      log.white(" modules with a branch named ");
      log.green(newBranch);
      log.white("!");
      return log.moat(1);
    });
  }).then(function() {
    return process.exit();
  }).done();
};

//# sourceMappingURL=../../../map/src/methods/massCheckout.map
