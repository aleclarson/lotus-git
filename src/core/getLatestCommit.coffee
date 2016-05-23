
assertTypes = require "assertTypes"
isType = require "isType"
exec = require "exec"
Q = require "q"

getCurrentBranch = require "./getCurrentBranch"

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

  Q.try ->

    return if branchName

    getCurrentBranch modulePath

    .then (currentBranch) ->
      branchName = currentBranch

  .then ->
    args = [ "-1", "--pretty=oneline", remoteName + "/" + branchName ]
    exec "git log", args, cwd: modulePath

  .then (stdout) ->
    spaceIndex = stdout.indexOf " "
    id: stdout.slice 0, spaceIndex
    message: stdout.slice spaceIndex + 1
