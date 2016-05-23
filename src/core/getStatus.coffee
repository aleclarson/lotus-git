
assertTypes = require "assertTypes"
Finder = require "finder"
isType = require "isType"
assert = require "assert"
exec = require "exec"

STATUS_REGEX = /^[\s]*([ARMDU\?\s]{1})([ARMDU\?\s]{1}) ([^\s]+)( \-\> ([^\s]+))?/

findStagingStatus = Finder { regex: STATUS_REGEX, group: 1 }
findWorkingStatus = Finder { regex: STATUS_REGEX, group: 2 }
findPath = Finder { regex: STATUS_REGEX, group: 3 }
findNewPath = Finder { regex: STATUS_REGEX, group: 5 }

statusBySymbol =
  "A": "added"
  "R": "renamed"
  "M": "modified"
  "D": "deleted"
  "U": "unmerged"
  "?": "untracked"
  " ": "unmodified"

optionTypes =
  modulePath: String
  parseOutput: Boolean.Maybe

module.exports = (options) ->

  if isType options, String
    options = { modulePath: arguments[0] }

  assertTypes options, optionTypes

  { modulePath, parseOutput } = options

  exec "git status --porcelain", cwd: modulePath

  .then (stdout) ->

    if parseOutput is no
      return stdout

    results = {
      staged: {}
      tracked: {}
      untracked: []
      unmerged: []
    }

    if stdout.length is 0
      return results

    for line in stdout.split "\n"

      file = { path: findPath line }
      stagingStatus = findStagingStatus line
      workingStatus = findWorkingStatus line

      if (stagingStatus is "?") and (workingStatus is "?")
        results.untracked.push file
        continue

      if (stagingStatus is "U") and (workingStatus is "U")
        results.unmerged.push file
        continue

      if (stagingStatus is "R") or (workingStatus is "R")
        file.newPath = findNewPath line
        file.oldPath = file.path
        delete file.path

      if (stagingStatus isnt " ") and (stagingStatus isnt "?")
        status = statusBySymbol[stagingStatus]
        assert status, "Unrecognized status: '#{stagingStatus}'"
        files = results.staged[status] ?= []
        files.push file

      if (workingStatus isnt " ") and (workingStatus isnt "?")
        status = statusBySymbol[workingStatus]
        assert status, "Unrecognized status: '#{workingStatus}'"
        files = results.tracked[status] ?= []
        files.push file

    return results
