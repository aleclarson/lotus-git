
Promise = require "Promise"
Path = require "path"
sync = require "sync"
git = require "git-utils"
log = require "log"

module.exports = (options) ->

  if moduleName = options._.shift()
    return lotus.Module.load moduleName
      .then printBranches

  return lotus.Module.crawl lotus.path
    .then (mods) ->
      Promise.chain mods, (mod) ->
        printBranches mod

printBranches = (mod) ->

  git.getBranches mod.path

  .then (branches) ->
    return if branches.length is 0
    log.moat 1
    log.yellow mod.name
    log.moat 0
    log.plusIndent 2
    log.gray.dim branches.join "\n"
    log.popIndent()
    log.moat 1
