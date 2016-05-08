var Path, syncFs;

syncFs = require("io/sync");

Path = require("path");

module.exports = function(path) {
  if (path[0] === ".") {
    path = Path.resolve(process.cwd(), path);
  } else if (path[0] !== "/") {
    path = lotus.path + "/" + path;
  }
  path = Path.join(path, ".git");
  return syncFs.isDir(path);
};

//# sourceMappingURL=../../../map/src/core/isRepo.map
