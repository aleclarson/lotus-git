
{ trackFailure } = require "failure"

Promise = require "Promise"
Path = require "path"
sync = require "sync"
exec = require "exec"
log = require "log"

printStatus = require "../core/printStatus"
assertRepo = require "../core/assertRepo"
getStatus = require "../core/getStatus"
isRepo = require "../core/isRepo"

module.exports = (options) ->

  { Module } = lotus

  parseOutput = options.names isnt yes

  modulePath = options._.shift()

  if modulePath

    modulePath = Module.resolvePath modulePath

    return assertRepo modulePath

    .then ->
      getStatus { modulePath, parseOutput }

    .then (results) ->
      moduleName = Path.relative lotus.path, modulePath
      printStatus moduleName, results

    .fail (error) ->
      throw error

  log.clear()
  log.moat 1 if not parseOutput

  mods = Module.crawl lotus.path

  log.moat 1
  log.white "Found "
  log.yellow mods.length
  log.white " modules in "
  log.cyan lotus.path
  log.moat 1

  Promise.map mods, (mod) ->

    return if not isRepo mod.path

    getStatus { modulePath: mod.path, parseOutput }

    .then (status) ->

      if not parseOutput
        return if not status.length
        log.moat 0
        log.bold mod.name
        return

      printStatus mod.name, status

    .fail (error) ->
      trackFailure error, { mod }

  .then ->
    log.moat 1 if not parseOutput
