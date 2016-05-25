var assertTypes, exec, isType, optionTypes;

assertTypes = require("assertTypes");

isType = require("isType");

exec = require("exec");

optionTypes = {
  modulePath: String,
  keepIndex: Boolean.Maybe
};

module.exports = function(options) {
  var args, keepIndex, modulePath;
  if (isType(options, String)) {
    options = {
      modulePath: options
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, keepIndex = options.keepIndex;
  args = [];
  if (keepIndex) {
    args.push("--keep-index");
  }
  return exec("git stash", args, {
    cwd: modulePath
  }).fail(function(error) {
    if (/bad revision 'HEAD'/.test(error.message)) {
      throw Error("Cannot stash unless an initial commit exists!");
    }
    throw error;
  });
};

//# sourceMappingURL=../../../map/src/core/pushStash.map
