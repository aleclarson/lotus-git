
hasKeys = require "hasKeys"
isType = require "isType"
sync = require "sync"
log = require "log"

colorByStatus =
  added: "green"
  modified: "yellow"
  renamed: "green"
  deleted: "red"
  untracked: "cyan"

module.exports = (moduleName, results) ->

  return if not isType results, Object
  return if not hasKeys results
  hasResults = no
  sync.each results, (value) ->
    hasResults = yes if hasKeys value
  return if not hasResults

  log.pushIndent 2
  log.moat 1
  log.bold moduleName
  log.plusIndent 2

  for key, value of results

    if isType value, Array
      printPaths key, colorByStatus[key], value
      log.popIndent()
      continue

    for status, files of value
      printPaths key + "." + status, colorByStatus[status], files

  log.popIndent()
  log.moat 1

printPaths = (status, color, files) ->
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
