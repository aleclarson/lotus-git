
exec = require "exec"

module.exports = (command, args, options) ->

  if isType args, Object
    options = args
    args = []

  else
    options ?= {}
    args ?= []

  assertType command, String
  assertType args, Array
  assertType options, Object

  args.unshift command

  exec "git", args, cwd: options.cwd
