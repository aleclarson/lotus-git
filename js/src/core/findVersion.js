var assertTypes, getVersions, isType, optionTypes, semver;

assertTypes = require("assertTypes");

semver = require("node-semver");

isType = require("isType");

getVersions = require("./getVersions");

optionTypes = {
  modulePath: String,
  version: String
};

module.exports = function(options) {
  var modulePath, version;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0],
      version: arguments[1]
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, version = options.version;
  return getVersions(modulePath).then(function(versions) {
    var existingVersion, i, index, len;
    for (index = i = 0, len = versions.length; i < len; index = ++i) {
      existingVersion = versions[index];
      if (semver.eq(version, existingVersion)) {
        return {
          index: index,
          versions: versions
        };
      }
    }
    return {
      index: -1,
      versions: versions
    };
  });
};

//# sourceMappingURL=../../../map/src/core/findVersion.map
