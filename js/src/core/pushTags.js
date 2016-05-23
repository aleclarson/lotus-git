var assertTypes, exec, isType, log, optionTypes;

assertTypes = require("assertTypes");

isType = require("isType");

exec = require("exec");

log = require("log");

optionTypes = {
  modulePath: String,
  remoteName: String.Maybe,
  force: Boolean.Maybe
};

module.exports = function(options) {
  var args, force, modulePath, remoteName;
  if (isType(options, String)) {
    options = {
      modulePath: options
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, remoteName = options.remoteName, force = options.force;
  if (remoteName == null) {
    remoteName = "origin";
  }
  args = [remoteName, "--tags"];
  if (force) {
    args.push("-f");
  }
  return exec("git push", args, {
    cwd: modulePath
  }).fail(function(error) {
    var lines;
    lines = error.message.split(log.ln);
    if (/\(already exists\)$/.test(lines[1])) {
      throw Error("Tag already exists!");
    }
    if (/\(forced update\)$/.test(lines[1])) {
      return;
    }
    if (/\* \[new tag\]/.test(lines[1])) {
      return;
    }
    throw error;
  });
};

//# sourceMappingURL=../../../map/src/core/pushTags.map
