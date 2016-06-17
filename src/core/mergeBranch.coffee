
assertTypes = require "assertTypes"
OneOf = require "OneOf"
exec = require "exec"

changeBranch = require "./changeBranch"
assertClean = require "./assertClean"

optionTypes =
  modulePath: String
  fromBranch: String
  toBranch: String.Maybe
  force: Boolean.Maybe

module.exports = (options) ->

  assertTypes options, optionTypes

  { modulePath, fromBranch, toBranch, force } = options

  assertClean modulePath

  .then ->
    return if not toBranch
    changeBranch modulePath, toBranch

  .then ->
    args = [ fromBranch, "--no-commit" ]
    args.push "-X", "theirs" if force
    exec "git merge", args, cwd: modulePath

  # TODO: Fail gracefully if the merge was empty.
  .fail (error) ->

    if /Automatic merge went well/.test error.message
      return # 'git merge' incorrectly prints to 'stderr'

    throw error
