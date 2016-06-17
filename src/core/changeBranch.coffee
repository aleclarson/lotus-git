
assertTypes = require "assertTypes"
isType = require "isType"
exec = require "exec"

getCurrentBranch = require "./getCurrentBranch"
hasChanges = require "./hasChanges"
hasBranch = require "./hasBranch"

optionTypes =
  modulePath: String
  branchName: String
  force: Boolean.Maybe

module.exports = (options) ->

  if isType options, String
    options =
      modulePath: arguments[0]
      branchName: arguments[1]

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

      .fail (error) ->

        if /Switched to branch/.test error.message
          return # 'git checkout' incorrectly prints to 'stderr'

        throw error
