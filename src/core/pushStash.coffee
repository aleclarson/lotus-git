
assertTypes = require "assertTypes"
isType = require "isType"
exec = require "exec"

optionTypes =
  modulePath: String
  keepIndex: Boolean.Maybe

module.exports = (options) ->

  if isType options, String
    options = { modulePath: options }

  assertTypes options, optionTypes

  { modulePath, keepIndex } = options

  args = []
  args.push "--keep-index" if keepIndex

  exec "git stash", args, cwd: modulePath

  .fail (error) ->

    if /bad revision 'HEAD'/.test error.message
      throw Error "Cannot stash unless an initial commit exists!"

    throw error
