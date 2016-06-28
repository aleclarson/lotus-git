var git, log, semver;

semver = require("node-semver");

git = require("git-utils");

log = require("log");

module.exports = function(args) {
  var modulePath, options, ref, version;
  modulePath = process.cwd();
  version = args._.shift();
  if (!semver.valid(version)) {
    log.moat(1);
    log.red("Error: ");
    log.white("Invalid version formatting! ");
    log.gray.dim(version);
    log.moat(1);
    return;
  }
  options = {
    force: (ref = args.force) != null ? ref : args.f,
    remote: args.remote || args.r || "origin",
    message: args.m
  };
  return git.assertRepo(modulePath).then(function() {
    log.moat(1);
    log.gray("Pushing...");
    log.moat(1);
    return git.pushVersion(modulePath, version, {
      force: options.force,
      remote: options.remote,
      message: options.message
    });
  }).then(function() {
    return git.getBranch(modulePath);
  }).then(function(currentBranch) {
    return git.getHead(modulePath, currentBranch, options.remote).then(function(commit) {
      log.moat(1);
      log.green("Push success! ");
      log.gray.dim(options.remote + "/" + currentBranch);
      log.moat(1);
      log.yellow(commit.id.slice(0, 7));
      log.white(" ", commit.message);
      return log.moat(1);
    });
  }).fail(function(error) {
    if (error.message === "Must force push to overwrite remote commits!") {
      log.moat(1);
      log.red("Push failed!");
      log.moat(1);
      log.gray.dim("Must use ");
      log.white("--force");
      log.gray.dim(" when overwriting remote commits!");
      log.moat(1);
      return;
    }
    throw error;
  });
};

//# sourceMappingURL=../../../map/src/methods/pushVersion.map
