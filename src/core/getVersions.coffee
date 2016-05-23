
SortedArray = require "sorted-array"
assertType = require "assertType"
semver = require "node-semver"

getTags = require "./getTags"

module.exports = (modulePath) ->

  assertType modulePath, String

  getTags modulePath

  .then (tagNames) ->

    versions = SortedArray [], semver.compare

    for tagName in tagNames
      continue if not semver.valid tagName
      versions.insert tagName

    return versions.array
