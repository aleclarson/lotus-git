var Finder, assertType, exec, findName, findUri, log, regex;

assertType = require("assertType");

Finder = require("finder");

exec = require("exec");

log = require("log");

regex = /^([^\s]+)\s+([^\s]+)/g;

findName = Finder({
  regex: regex,
  group: 1
});

findUri = Finder({
  regex: regex,
  group: 2
});

module.exports = function(modulePath) {
  assertType(modulePath, String);
  return exec("git remote --verbose", {
    cwd: modulePath
  }).then(function(stdout) {
    var i, len, line, name, ref, remote, remotes;
    remotes = Object.create(null);
    if (stdout.length === 0) {
      return remotes;
    }
    ref = stdout.split(log.ln);
    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];
      name = findName(line);
      remote = remotes[name] != null ? remotes[name] : remotes[name] = {};
      if (/\(push\)$/.test(line)) {
        remote.push = findUri(line);
      } else {
        remote.fetch = findUri(line);
      }
    }
    return remotes;
  });
};

//# sourceMappingURL=../../../map/src/core/getRemotes.map
