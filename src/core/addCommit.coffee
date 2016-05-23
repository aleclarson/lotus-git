
assertTypes = require "assertTypes"
isType = require "isType"
exec = require "exec"
log = require "log"

assertStaged = require "./assertStaged"

optionTypes =
  modulePath: String
  message: String

module.exports = (options) ->

  if isType options, String
    options =
      modulePath: arguments[0]
      message: arguments[1]

  assertTypes options, optionTypes

  { modulePath, message } = options

  assertStaged modulePath

  .then ->

    message = message.replace "'", "\\'"

    newline = message.indexOf log.ln

    if newline >= 0
      paragraph = message.slice newline + 1
      message = message.slice 0, newline

    args = [ "-m", message ]
    args.push "-m", paragraph if paragraph

    exec "git commit", args, cwd: modulePath
