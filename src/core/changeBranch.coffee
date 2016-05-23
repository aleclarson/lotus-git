
assertTypes = require "assertTypes"
exec = require "exec"
Q = require "q"

hasChanges = require "./hasChanges"

optionTypes =
  modulePath: String
  branchName: String
  force: Boolean.Maybe

module.exports = (options) ->

  assertTypes options, optionTypes

  { modulePath, branchName, force } = options

  getCurrentBranch modulePath

  .then (currentBranch) ->

    if currentBranch is branchName
      return currentBranch

    hasChanges { modulePath }

    .then (hasChanges) ->

      if hasChanges
        throw Error "The current branch has uncommitted changes!"

      hasBranch { modulePath, branchName }

    .then (branchExists) ->

      args = [ branchName ]

      if not branchExists

        if not force
          throw Error "Invalid branch name!"

        args.unshift "-b"

      exec "git checkout", args, cwd: modulePath

    .then ->
      currentBranch
