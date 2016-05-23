var ArrayOf, OneOf, StatusGroup, StatusName, Void, assertTypes, exec, getStatus, hasKeys, isType, optionTypes;

assertTypes = require("assertTypes");

ArrayOf = require("ArrayOf");

hasKeys = require("hasKeys");

isType = require("isType");

OneOf = require("OneOf");

Void = require("Void");

exec = require("exec");

getStatus = require("./getStatus");

StatusGroup = OneOf("StatusGroup", ["untracked", "tracked", "staged"]);

StatusName = OneOf("StatusName", ["added", "renamed", "modified", "deleted"]);

optionTypes = {
  modulePath: String,
  group: [StatusGroup, Void],
  type: [StatusName, ArrayOf(StatusName), Void]
};

module.exports = function(options) {
  var group, modulePath, parseOutput, type;
  if (isType(options, String)) {
    if (arguments[1] == null) {
      arguments[1] = {};
    }
    arguments[1].modulePath = options;
    options = arguments[1];
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, group = options.group, type = options.type;
  parseOutput = Boolean(group || type);
  return getStatus({
    modulePath: modulePath,
    parseOutput: parseOutput
  }).then(function(status) {
    var changes, i, j, len, len1, types;
    if (!parseOutput) {
      return status.length !== 0;
    }
    if (group) {
      changes = status[group];
      if (Array.isArray(type)) {
        types = type;
        for (i = 0, len = types.length; i < len; i++) {
          type = types[i];
          if (changes[type]) {
            return true;
          }
        }
        return false;
      } else if (type) {
        return Array.isArray(changes[type]);
      }
      return hasKeys(changes);
    } else if (Array.isArray(type)) {
      types = type;
      for (group in status) {
        changes = status[group];
        for (j = 0, len1 = types.length; j < len1; j++) {
          type = types[j];
          if (changes[type]) {
            return true;
          }
        }
      }
      return false;
    } else if (type) {
      for (group in status) {
        changes = status[group];
        if (changes[type]) {
          return true;
        }
      }
    }
    return hasKeys(status);
  });
};

//# sourceMappingURL=../../../map/src/core/hasChanges.map
