var assertStaged, assertTypes, exec, isType, log, optionTypes;

assertTypes = require("assertTypes");

isType = require("isType");

exec = require("exec");

log = require("log");

assertStaged = require("./assertStaged");

optionTypes = {
  modulePath: String,
  message: String
};

module.exports = function(options) {
  var message, modulePath;
  if (isType(options, String)) {
    options = {
      modulePath: arguments[0],
      message: arguments[1]
    };
  }
  assertTypes(options, optionTypes);
  modulePath = options.modulePath, message = options.message;
  return assertStaged(modulePath).then(function() {
    var args, newline, paragraph;
    message = message.replace("'", "\\'");
    newline = message.indexOf(log.ln);
    if (newline >= 0) {
      paragraph = message.slice(newline + 1);
      message = message.slice(0, newline);
    }
    args = ["-m", message];
    if (paragraph) {
      args.push("-m", paragraph);
    }
    return exec("git commit", args, {
      cwd: modulePath
    });
  });
};

//# sourceMappingURL=../../../map/src/core/addCommit.map
