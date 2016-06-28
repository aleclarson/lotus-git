
Promise = require "Promise"
Path = require "path"
sync = require "sync"
exec = require "exec"
git = require "git-utils"
log = require "log"

printStatus = require "../utils/printStatus"

module.exports = (options) ->

  { Module } = lotus

  modulePath = options._.shift()

  if modulePath

    modulePath = Module.resolvePath modulePath

    return git.assertRepo modulePath

    .then ->
      git.getStatus modulePath,
        raw: options.names isnt yes

    .then (results) ->
      moduleName = Path.relative lotus.path, modulePath
      printStatus moduleName, results

    .fail (error) ->
      throw error

  log.clear()
  log.moat 1 if options.names

  mods = Module.crawl lotus.path

  log.moat 1
  log.white "Found "
  log.yellow mods.length
  log.white " modules in "
  log.cyan lotus.path
  log.moat 1

  Promise.map mods, (mod) ->

    return if not git.isRepo mod.path

    git.getStatus mod.path,
      raw: options.names isnt yes

    .then (status) ->

      if options.names
        return if not status.length
        log.moat 0
        log.bold mod.name
        return

      printStatus mod.name, status

  .then ->
    log.moat 1 if options.names
