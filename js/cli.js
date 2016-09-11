module.exports = function(options) {
  var command, dir, methodName;
  command = options.command;
  methodName = options._.shift();
  dir = __dirname + "/methods";
  return lotus.callMethod(methodName, {
    command: command,
    dir: dir,
    options: options
  });
};

//# sourceMappingURL=map/cli.map
