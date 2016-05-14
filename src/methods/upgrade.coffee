
exec = require "exec"

module.exports = (options) ->

  # { Module } = lotus
  #
  # try mod = Module process.cwd()
  # catch error then errors.resolve error
  #
  # moduleName = options._.shift()
  # version = options._.shift()
  #
  # mod.load [ "config" ]
  #
  # .then ->
  #   mod.

errors = ErrorMap()
