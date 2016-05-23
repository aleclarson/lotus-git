
assertTypes = require "assertTypes"
semver = require "node-semver"
isType = require "isType"

getVersions = require "./getVersions"

optionTypes =
  modulePath: String
  version: String

module.exports = (options) ->

  if isType options, String
    options =
      modulePath: arguments[0]
      version: arguments[1]

  assertTypes options, optionTypes

  { modulePath, version } = options

  getVersions modulePath

  .then (versions) ->

    for existingVersion, index in versions
      if semver.eq version, existingVersion
        return { index, versions }

    return { index: -1, versions }
