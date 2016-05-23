var Finder, assertTypes, exec, isType, log, optionTypes;

assertTypes = require("assertTypes");

Finder = require("finder");

isType = require("isType");

exec = require("exec");

log = require("log");

optionTypes = {
  modulePath: String,
  remoteName: String.Maybe,
  parseOutput: Boolean.Maybe
};

module.exports = function(options) {
  var modulePath, parseOutput, remoteName;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0],
      remoteName: arguments[1]
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, remoteName = options.remoteName, parseOutput = options.parseOutput;
  if (remoteName) {
    return getRemotes(modulePath).then(function(remotes) {
      var remoteUri;
      remoteUri = remotes[remoteName].push;
      return exec("git ls-remote --heads " + remoteUri, {
        cwd: modulePath
      });
    }).then(function(stdout) {
      var branches, findName, i, len, line, name, ref;
      if (parseOutput === false) {
        return stdout;
      }
      findName = Finder(/refs\/heads\/(.+)$/);
      branches = [];
      ref = stdout.split(log.ln);
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        name = findName(line);
        if (!name) {
          continue;
        }
        branches.push(name);
      }
      return branches;
    });
  }
  return exec("git branch", {
    cwd: modulePath
  }).then(function(stdout) {
    var branches, findName, i, len, line, name, ref;
    if (parseOutput === false) {
      return stdout;
    }
    findName = Finder(/^[\*\s]+([a-zA-Z0-9_\-\.]+)$/);
    branches = [];
    ref = stdout.split(log.ln);
    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];
      name = findName(line);
      if (!name) {
        continue;
      }
      branches.push(name);
      if (line[0] === "*") {
        branches.current = name;
      }
    }
    return branches;
  });
};

//# sourceMappingURL=../../../map/src/core/getBranches.map
