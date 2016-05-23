var Q, assert, assertTypes, exec, getCurrentBranch, isType, log, optionTypes;

assertTypes = require("assertTypes");

isType = require("isType");

assert = require("assert");

exec = require("exec");

log = require("log");

Q = require("q");

getCurrentBranch = require("./getCurrentBranch");

optionTypes = {
  modulePath: String,
  remoteName: String.Maybe,
  upstream: Boolean.Maybe,
  force: Boolean.Maybe
};

module.exports = function(options) {
  var args, force, modulePath, remoteName, upstream;
  if (isType(options, String)) {
    options = {
      modulePath: options
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, remoteName = options.remoteName, upstream = options.upstream, force = options.force;
  if (remoteName == null) {
    remoteName = "origin";
  }
  args = [remoteName];
  return getCurrentBranch(modulePath).then(function(currentBranch) {
    if (currentBranch === null) {
      throw Error("An initial commit must exist!");
    }
    if (upstream) {
      args.push("-u", currentBranch);
    }
    if (force) {
      args.push("-f");
    }
    return exec("git push", args, {
      cwd: modulePath
    }).fail(function(error) {
      var lines, needsForce, regex;
      lines = error.message.split(log.ln);
      if (!force) {
        needsForce = /\(non-fast-forward\)$/.test(lines[1]);
        assert(!needsForce, "Must force push to overwrite remote commits!");
      }
      regex = RegExp("(\\+|\\s)[\\s]+([a-z0-9]{7})[\\.]{2,3}([a-z0-9]{7})[\\s]+(HEAD|" + currentBranch + ")[\\s]+->[\\s]+" + currentBranch);
      if (regex.test(lines[1])) {
        return;
      }
      throw error;
    });
  });
};

//# sourceMappingURL=../../../map/src/core/pushChanges.map
