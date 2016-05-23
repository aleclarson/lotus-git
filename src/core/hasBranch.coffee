
assertTypes = require "assertTypes"
inArray = require "in-array"

getBranches = require "./getBranches"

optionTypes =
  modulePath: String
  branchName: String
  remoteName: String.Maybe

module.exports = (options) ->

  assertTypes options, optionTypes

  { modulePath, branchName, remoteName } = options

  getBranches { modulePath, remoteName }

  .then (branchNames) ->
    inArray branchNames, branchName
