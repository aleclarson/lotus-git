var assertRepo, getCurrentBranch, getLatestCommit, log, pushVersion, semver;

semver = require("node-semver");

log = require("log");

getCurrentBranch = require("../core/getCurrentBranch");

getLatestCommit = require("../core/getLatestCommit");

pushVersion = require("../core/pushVersion");

assertRepo = require("../core/assertRepo");

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
  return assertRepo(modulePath).then(function() {
    return pushVersion({
      modulePath: modulePath,
      version: version,
      remoteName: remoteName,
      message: message,
      force: force
    });
  }).then(function() {
    return getCurrentBranch(modulePath);
  }).then(function(currentBranch) {
    return getLatestCommit(modulePath, remoteName, currentBranch).then(function(commit) {
      log.moat(1);
      log.green("Push success! ");
      log.gray.dim(remoteName + "/" + currentBranch);
      log.moat(1);
      log.yellow(commit.id.slice(0, 7));
      log.white(" ", commit.message);
      return log.moat(1);
    });
  });
};

//# sourceMappingURL=../../../map/src/methods/pushVersion.map
