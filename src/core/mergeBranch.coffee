
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
    changeBranch { modulePath, branchName: toBranch }

  .then ->
    args = [ fromBranch, "--no-commit" ]
    args.push "-X", "theirs" if force
    exec "git merge", args, cwd: modulePath

  .fail (error) ->

    expected = "Automatic merge went well; stopped before committing as requested"
    if error.message is expected
      return

    throw error
