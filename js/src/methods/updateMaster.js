var assertRepo, become, changeBranch, pushVersion;

changeBranch = require("../core/changeBranch");

pushVersion = require("./pushVersion");

assertRepo = require("../core/assertRepo");

become = require("./become");

module.exports = function(options) {
  var force, modulePath, version;
  modulePath = process.cwd();
  version = options._.shift();
  force = options.force != null ? options.force : options.force = options.f;
  return assertRepo(modulePath).then(function() {
    return changeBranch(modulePath, "master");
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
      return changeBranch(modulePath, "unstable");
    }
    if (error === "conflicts") {
      return;
    }
    _ = [version];
    return pushVersion({
      _: _,
      force: force
    }).then(function() {
      return changeBranch(modulePath, "unstable");
    });
  }).fail(function(error) {
    return changeBranch(modulePath, "unstable").then(function() {
      throw error;
    });
  });
};

//# sourceMappingURL=../../../map/src/methods/updateMaster.map
