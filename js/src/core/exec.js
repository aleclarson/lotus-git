var exec;

exec = require("exec");

module.exports = function(command, args, options) {
  if (isType(args, Object)) {
    options = args;
    args = [];
  } else {
    if (options == null) {
      options = {};
    }
    if (args == null) {
      args = [];
    }
  }
  assertType(command, String);
  assertType(args, Array);
  assertType(options, Object);
  args.unshift(command);
  return exec("git", args, {
    cwd: options.cwd
  });
};

//# sourceMappingURL=../../../map/src/core/exec.map
