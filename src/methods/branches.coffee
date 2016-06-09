
Promise = require "Promise"
Path = require "path"
sync = require "sync"
log = require "log"

getBranches = require "../core/getBranches"

module.exports = (options) ->

  { Module } = lotus

  modulePath = options._.shift()

  if modulePath
    modulePath = Module.resolvePath modulePath
    moduleName = Path.basename modulePath
    mod = Module moduleName
    return printBranches mod

  mods = Module.crawl lotus.path
  Promise.chain mods, (mod) ->
    printBranches mod

printBranches = (mod) ->

  getBranches { modulePath: mod.path }

  .then (branches) ->
    return if branches.length is 0
    log.moat 1
    log.yellow mod.name
    log.moat 0
    log.plusIndent 2
    log.gray.dim branches.join "\n"
    log.popIndent()
    log.moat 1

  .fail (error) ->
    mod.reportError error, errorConfig

errorConfig =
  quiet: [
    "fatal: Not a git repository (or any of the parent directories): .git"
  ]
