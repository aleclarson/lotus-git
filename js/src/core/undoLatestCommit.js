var Promise, assertTypes, exec, isType, optionTypes, popStash, pushStash;

assertTypes = require("assertTypes");

Promise = require("Promise");

isType = require("isType");

exec = require("exec");

pushStash = require("./pushStash");

popStash = require("./popStash");

optionTypes = {
  modulePath: String,
  keepChanges: Boolean.Maybe
};

module.exports = function(options) {
  var args, keepChanges, modulePath;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0]
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, keepChanges = options.keepChanges;
  args = ["HEAD^"];
  args.unshift(keepChanges === false ? "--hard" : "--soft");
  return Promise["try"](function() {
    if (keepChanges === false) {
      return pushStash(modulePath);
    }
  }).then(function() {
    return exec("git reset", args, {
      cwd: modulePath
    });
  }).fail(function(error) {
    var isFirstCommit;
    isFirstCommit = /ambiguous argument 'HEAD(\^)?'/.test(error.message);
    if (!isFirstCommit) {
      throw error;
    }
    return exec("git update-ref -d HEAD", {
      cwd: modulePath
    }).then(function() {
      if (keepChanges !== false) {
        return;
      }
      return exec("git reset --hard", {
        cwd: modulePath
      });
    });
  }).then(function() {
    if (keepChanges === false) {
      return popStash(modulePath);
    }
  });
};

//# sourceMappingURL=../../../map/src/core/undoLatestCommit.map
