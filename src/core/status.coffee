
Finder = require "finder"
sync = require "sync"

exec = require "./exec"

STATUS_REGEX = /^[\s]*([ARMD\s\?]{1})([ARMD\s\?]{1}) ([^\s]+)( \-\> ([^\s]+))?/
# RENAME_REGEX = /^[\s]*[ARMD\s\?]{2} [^\s]+(\-\> ([^\s]+))?/

findStagingStatus = Finder { regex: STATUS_REGEX, group: 1 }
findWorkingStatus = Finder { regex: STATUS_REGEX, group: 2 }
findPath = Finder { regex: STATUS_REGEX, group: 3 }
findNewPath = Finder { regex: STATUS_REGEX, group: 5 }

statusBySymbol =
  "A": "added"
  "R": "renamed"
  "M": "modified"
  "D": "deleted"
  " ": "unmodified"
  "?": "untracked"

module.exports = exports = (modulePath, options = {}) ->

  exec "status", [ "--porcelain" ], cwd: modulePath

  .then (stdout) ->

    return if stdout.length is 0

    if options.raw
      return stdout

    lines = stdout.split "\n"

    return lines if options.parseLines is no

    results = {
      staged: {}
      tracked: {}
      untracked: []
    }

    sync.each lines, (line) ->

      path = findPath line
      stagingStatus = findStagingStatus line
      workingStatus = findWorkingStatus line

      if (stagingStatus is "?") and (workingStatus is "?")
        results.untracked.push { path }
        return

      if (stagingStatus isnt " ") and (stagingStatus isnt "?")
        status = statusBySymbol[stagingStatus]
        assert status?, "Unrecognized status: '#{stagingStatus}'"
        files = results.staged[status] ?= []
        file = { path }

      else if (workingStatus isnt " ") and (workingStatus isnt "?")
        status = statusBySymbol[workingStatus]
        assert status?, "Unrecognized status: '#{workingStatus}'"
        files = results.tracked[status] ?= []
        file = { path }

      if (stagingStatus is "R") or (workingStatus is "R")
        file.newPath = findNewPath line
        file.oldPath = file.path
        delete file.path

      files.push file

    return results

exports.printPaths = (status, color, files) ->
  return if files.length is 0
  log.moat 1
  log[color] status
  log.plusIndent 2
  for file in files
    log.moat 0
    if file.newPath
      log.gray.dim file.oldPath
      log.white " -> "
      log.gray.dim file.newPath
    else
      log.gray.dim file.path
  log.popIndent()
  log.moat 1

colorByStatus =
  added: "green"
  modified: "yellow"
  renamed: "green"
  deleted: "red"
  untracked: "cyan"

exports.printModuleStatus = (moduleName, results) ->

  return unless isType results, Object

  log.pushIndent 2
  log.moat 1
  log.bold moduleName
  log.plusIndent 2

  for key, value of results

    if isType value, Array
      exports.printPaths key, colorByStatus[key], value
      log.popIndent()
      continue

    for status, files of value
      exports.printPaths key + "." + status, colorByStatus[status], files

  log.popIndent()
  log.moat 1
