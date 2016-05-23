
assertTypes = require "assertTypes"
inArray = require "in-array"
isType = require "isType"

getBranches = require "./getBranches"

optionTypes =
  modulePath: String
  branchName: String
  remoteName: String.Maybe

module.exports = (options) ->

  if isType options, String
    options =
      modulePath: arguments[0]
      branchName: arguments[1]

  assertTypes options, optionTypes

  { modulePath, branchName, remoteName } = options

  getBranches { modulePath, remoteName }

  .then (branchNames) ->
    inArray branchNames, branchName
