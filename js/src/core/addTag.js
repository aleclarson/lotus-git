var assertTypes, exec, isType, optionTypes;

assertTypes = require("assertTypes");

isType = require("isType");

exec = require("exec");

optionTypes = {
  modulePath: String,
  tagName: String,
  force: Boolean.Maybe
};

module.exports = function(options) {
  var args, force, modulePath, tagName;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0],
      tagName: arguments[1]
    };
  }
  assertTypes(options, optionTypes);
  tagName = options.tagName, modulePath = options.modulePath, force = options.force;
  args = [tagName];
  if (force) {
    args.unshift("-f");
  }
  return exec("git tag", args, {
    cwd: modulePath
  }).fail(function(error) {
    var expected;
    if (!force) {
      expected = "fatal: tag '" + tagName + "' already exists";
      if (error.message === expected) {
        throw Error("Tag already exists!");
      }
    }
    throw error;
  });
};

//# sourceMappingURL=../../../map/src/core/addTag.map
