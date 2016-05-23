
assertTypes = require "assertTypes"
ArrayOf = require "ArrayOf"
hasKeys = require "hasKeys"
isType = require "isType"
OneOf = require "OneOf"
Void = require "Void"
exec = require "exec"

getStatus = require "./getStatus"

StatusGroup = OneOf "StatusGroup", [ "untracked", "tracked", "staged" ]
StatusName = OneOf "StatusName", [ "added", "renamed", "modified", "deleted" ]

optionTypes =
  modulePath: String
  group: [ StatusGroup, Void ]
  type: [ StatusName, ArrayOf(StatusName), Void ]

module.exports = (options) ->

  if isType options, String
    arguments[1] ?= {}
    arguments[1].modulePath = options
    options = arguments[1]

  assertTypes options, optionTypes

  { modulePath, group, type } = options

  parseOutput = Boolean group or type

  getStatus { modulePath, parseOutput }

  .then (status) ->

    if not parseOutput
      return status.length isnt 0

    if group
      changes = status[group]

      if Array.isArray type
        types = type
        for type in types
          return yes if changes[type]
        return no

      else if type
        return Array.isArray changes[type]

      return hasKeys changes

    else if Array.isArray type
      types = type
      for group, changes of status
        for type in types
          return yes if changes[type]
      return no

    else if type
      for group, changes of status
        return yes if changes[type]

    return hasKeys status
