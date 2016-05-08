
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
    mod = Module moduleName
    printBranches mod
    .then -> process.exit()
    .done()
    return

  mods = Module.crawl lotus.path
  Q.all sync.map mods, printBranches
  .then -> process.exit()
  .done()

printBranches = (mod) ->

  git.branches mod.path

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
