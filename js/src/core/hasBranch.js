var assertTypes, getBranches, inArray, isType, optionTypes;

assertTypes = require("assertTypes");

inArray = require("in-array");

isType = require("isType");

getBranches = require("./getBranches");

optionTypes = {
  modulePath: String,
  branchName: String,
  remoteName: String.Maybe
};

module.exports = function(options) {
  var branchName, modulePath, remoteName;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0],
      branchName: arguments[1]
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, branchName = options.branchName, remoteName = options.remoteName;
  return getBranches({
    modulePath: modulePath,
    remoteName: remoteName
  }).then(function(branchNames) {
    return inArray(branchNames, branchName);
  });
};

//# sourceMappingURL=../../../map/src/core/hasBranch.map
