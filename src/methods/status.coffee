
{ isType } = require "type-utils"

Path = require "path"
sync = require "sync"
Q = require "q"

git = require "../core"

module.exports = (options) ->

  { Module } = lotus

  modulePath = options._.shift()

  if modulePath

    modulePath = Module.resolvePath modulePath
    moduleName = Path.relative lotus.path, modulePath

    git.status modulePath

    .then (results) ->
      git.status.printModuleStatus moduleName, results

    .fail (error) ->
      log.moat 1
      log.red moduleName
      log.moat 0
      log.gray.dim error.stack
      log.moat 1

    .then -> process.exit()

    .done()

    return

  config =
    raw: options.names is yes

  log.clear()

  mods = Module.crawl lotus.path

  if config.raw
    log.moat 1

  Q.all sync.map mods, (mod) ->

    git.status mod.path, config

    .then (results) ->

      if config.raw
        return unless results
        log.moat 0
        log.bold mod.name
        return

      git.status.printModuleStatus mod.name, results

    .fail (error) ->
      mod.reportError error, errorConfig

  .then ->

    if config.raw
      log.moat 1

    process.exit()

  .done()

errorConfig =
  quiet: [
    "fatal: Not a git repository (or any of the parent directories): .git"
  ]
