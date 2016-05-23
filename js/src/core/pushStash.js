var assertType, exec;

assertType = require("assertType");

exec = require("exec");

module.exports = function(modulePath) {
  assertType(modulePath, String);
  return exec("git stash", {
    cwd: modulePath
  }).fail(function(error) {
    if (/bad revision 'HEAD'/.test(error.message)) {
      throw Error("Cannot stash unless an initial commit exists!");
    }
    throw error;
  });
};

//# sourceMappingURL=../../../map/src/core/pushStash.map
