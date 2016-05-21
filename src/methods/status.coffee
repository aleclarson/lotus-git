
ErrorMap = require "ErrorMap"
isType = require "isType"
Path = require "path"
sync = require "sync"
log = require "log"
Q = require "q"

printStatus = require "../core/printStatus"
getStatus = require "../core/getStatus"

module.exports = (options) ->

  { Module } = lotus

  modulePath = options._.shift()

  if modulePath

    modulePath = Module.resolvePath modulePath
    moduleName = Path.relative lotus.path, modulePath

    return getStatus modulePath

    .then (results) ->
      printStatus moduleName, results

    .fail (error) ->
      log.moat 1
      log.red moduleName
      log.moat 0
      log.gray.dim error.stack
      log.moat 1

  config =
    raw: options.names is yes

  log.clear()

  mods = Module.crawl lotus.path

  if config.raw
    log.moat 1

  Q.all sync.map mods, (mod) ->

    getStatus mod.path, config

    .then (results) ->

      if config.raw
        return unless results
        log.moat 0
        log.bold mod.name
        return

      printStatus mod.name, results

    .fail (error) ->
      errors.resolve error, ->
        log.yellow mod.name

  .then ->
    if config.raw
      log.moat 1

errors = ErrorMap

  quiet: [
    "fatal: Not a git repository (or any of the parent directories): .git"
  ]
