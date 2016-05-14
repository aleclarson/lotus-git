var Finder, assertType, exec, sync;

assertType = require("assert");

Finder = require("finder");

sync = require("sync");

exec = require("exec");

module.exports = function(modulePath) {
  assertType(modulePath, String);
  return exec("git branch", {
    cwd: modulePath
  }).then(function(stdout) {
    var branches, findName, lines;
    branches = [];
    findName = Finder(/^[\*\s]+([a-zA-Z0-9_\-\.]+)$/);
    findName.group = 1;
    lines = stdout.split("\n");
    sync.each(lines, function(line) {
      var name;
      name = findName(line);
      if (!name) {
        return;
      }
      branches.push(name);
      if (line[0] === "*") {
        return branches.current = name;
      }
    });
    return branches;
  });
};

//# sourceMappingURL=../../../map/src/core/getBranchNames.map
