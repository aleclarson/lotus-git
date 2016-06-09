
assertTypes = require "assertTypes"
Promise = require "Promise"
isType = require "isType"
exec = require "exec"

getCurrentBranch = require "./getCurrentBranch"
hasBranch = require "./hasBranch"

optionTypes =
  modulePath: String
  remoteName: String.Maybe
  branchName: String.Maybe

module.exports = (options) ->

  if isType options, String
    options =
      modulePath: arguments[0]
      remoteName: arguments[1]
      branchName: arguments[2]

  assertTypes options, optionTypes

  { modulePath, remoteName, branchName } = options

  remoteName ?= "origin"

  return Promise.try ->

    if branchName

      return hasBranch modulePath, branchName

      .then (hasBranch) ->
        branchName = null if not hasBranch

    getCurrentBranch modulePath

    .then (currentBranch) ->
      branchName = currentBranch

  .then ->

    if branchName is null
      return null

    args = [
      "-1"
      "--pretty=oneline"
      remoteName + "/" + branchName
    ]

    exec "git log", args, cwd: modulePath

    .then (stdout) ->
      spaceIndex = stdout.indexOf " "
      id: stdout.slice 0, spaceIndex
      message: stdout.slice spaceIndex + 1
