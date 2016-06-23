var become, git, pushVersion;

git = require("git-utils");

pushVersion = require("./pushVersion");

become = require("./become");

module.exports = function(options) {
  var force, modulePath, version;
  modulePath = process.cwd();
  version = options._.shift();
  force = options.force != null ? options.force : options.force = options.f;
  return git.assertRepo(modulePath).then(function() {
    return git.changeBranch(modulePath, "master");
  }).then(function() {
    var _;
    _ = ["unstable"];
    return become({
      _: _,
      force: force
    });
  }).then(function(arg) {
    var _, error;
    error = arg.error;
    if (error === "empty") {
      return git.changeBranch(modulePath, "unstable");
    }
    if (error === "conflicts") {
      return;
    }
    _ = [version];
    return pushVersion({
      _: _,
      force: force
    }).then(function() {
      return git.changeBranch(modulePath, "unstable");
    });
  }).fail(function(error) {
    return git.changeBranch(modulePath, "unstable").then(function() {
      throw error;
    });
  });
};

//# sourceMappingURL=../../../map/src/methods/updateMaster.map
