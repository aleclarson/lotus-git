var assertTypes, exec, isType, optionTypes;

assertTypes = require("assertTypes");

isType = require("isType");

exec = require("exec");

optionTypes = {
  modulePath: String,
  tagName: String,
  remoteName: String.Maybe
};

module.exports = function(options) {
  var modulePath, remoteName, tagName;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0],
      tagName: arguments[1]
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, tagName = options.tagName, remoteName = options.remoteName;
  return exec("git tag -d " + tagName, {
    cwd: modulePath
  }).then(function() {
    if (!remoteName) {
      return;
    }
    return exec("git push " + remoteName + " :" + tagName, {
      cwd: modulePath
    });
  });
};

//# sourceMappingURL=../../../map/src/core/removeTag.map
