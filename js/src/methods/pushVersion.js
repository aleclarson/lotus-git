var git, log, semver;

semver = require("node-semver");

git = require("git-utils");

log = require("log");

module.exports = function(options) {
  var force, message, modulePath, remoteName, version;
  modulePath = process.cwd();
  version = options._.shift();
  if (!semver.valid(version)) {
    log.moat(1);
    log.red("Error: ");
    log.white("Invalid version formatting! ");
    log.gray.dim(version);
    log.moat(1);
    return;
  }
  force = options.force != null ? options.force : options.force = options.f;
  message = options.m;
  remoteName = options.remote || options.r || "origin";
  return git.assertRepo(modulePath).then(function() {
    log.moat(1);
    log.gray("Pushing...");
    log.moat(1);
    return git.pushVersion({
      modulePath: modulePath,
      version: version,
      remoteName: remoteName,
      message: message,
      force: force
    });
  }).then(function() {
    return git.getCurrentBranch(modulePath);
  }).then(function(currentBranch) {
    return git.getLatestCommit(modulePath, remoteName, currentBranch).then(function(commit) {
      log.moat(1);
      log.green("Push success! ");
      log.gray.dim(remoteName + "/" + currentBranch);
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
