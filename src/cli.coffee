
module.exports = (options) ->
  command = options.command
  methodName = options._.shift()
  dir = __dirname + "/methods"
  lotus.callMethod methodName, { command, dir, options }
