var Path, addCommit, addTag, assert, assertStaged, assertTypes, exec, findVersion, log, optionTypes, pushChanges, pushTags, removeTag, semver, stageAll, undoLatestCommit;

assertTypes = require("assertTypes");

semver = require("node-semver");

assert = require("assert");

Path = require("path");

exec = require("exec");

log = require("log");

undoLatestCommit = require("./undoLatestCommit");

assertStaged = require("./assertStaged");

findVersion = require("./findVersion");

pushChanges = require("./pushChanges");

removeTag = require("./removeTag");

addCommit = require("./addCommit");

stageAll = require("./stageAll");

pushTags = require("./pushTags");

addTag = require("./addTag");

optionTypes = {
  modulePath: String,
  remoteName: String,
  version: String,
  message: String.Maybe,
  force: Boolean.Maybe
};

module.exports = function(options) {
  var force, message, modulePath, remoteName, version;
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, remoteName = options.remoteName, version = options.version, message = options.message, force = options.force;
  assert(semver.valid(version), "Invalid version formatting!");
  return assertStaged(modulePath).then(function() {
    return findVersion(modulePath, version);
  }).then(function(arg) {
    var index, versions;
    index = arg.index, versions = arg.versions;
    if (index < 0) {
      return;
    }
    if (!force) {
      throw Error("Version already exists!");
    }
    if (index !== versions.length - 1) {
      throw Error("Can only overwrite the most recent version!");
    }
    return undoLatestCommit(modulePath);
  }).then(function() {
    message = version + (message ? log.ln + message : "");
    return addCommit(modulePath, message);
  }).then(function() {
    return addTag({
      modulePath: modulePath,
      tagName: version,
      force: force
    });
  }).then(function() {
    return pushChanges({
      modulePath: modulePath,
      remoteName: remoteName,
      force: force
    });
  }).then(function() {
    return pushTags({
      modulePath: modulePath,
      remoteName: remoteName,
      force: force
    });
  }).fail(function(error) {
    if (/^fatal: The current branch [^\s]+ has no upstream branch/.test(error.message)) {
      return pushChanges({
        modulePath: modulePath,
        remoteName: remoteName,
        force: force,
        upstream: true
      }).then(function() {
        return pushTags({
          modulePath: modulePath,
          remoteName: remoteName,
          force: force
        });
      });
    }
    throw error;
  }).fail(function(error) {
    return undoLatestCommit(modulePath).then(function() {
      return removeTag(modulePath, version);
    }).then(function() {
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
  });
};

//# sourceMappingURL=../../../map/src/core/pushVersion.map
