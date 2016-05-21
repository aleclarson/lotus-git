
inArray = require "in-array"
log = require "log"
Q = require "q"

getBranchNames = require "../core/getBranchNames"
printStatus = require "../core/printStatus"
getStatus = require "../core/getStatus"

module.exports = (options) ->

  { Module } = lotus

  newBranch = options._.shift()
  assertType newBranch, String

  mods = Module.crawl lotus.path

  Q.all sync.map mods, (mod) ->

    getBranchNames mod.path

    .then (branches) ->

      if branches.current is newBranch
        log.moat 1
        log.yellow mod.name
        log.gray.dim " *"
        log.moat 1
        return mod

      unless inArray branches, newBranch
        return null

      getStatus mod.path

      .then (results) ->

        unless results
          return null

        ignored = no
        ignore = ->
          ignored = yes
          prompt._close()

        stash = ->
          git "stash", cwd: mod.path

        printStatus mod.name, results
        repl.sync { stash, ignore }

        if ignored
          return null

        # TODO: Change branches!
        return mod

  .then (mods) ->

    mods = sync.filter mods, (mod) ->
      return no unless isType mod, Module
      log.moat 1
      log.yellow mod.name
      log.moat 1
      # TODO: Change branches!
      return yes

    log.moat 1
    log.white "Found "
    log.yellow mods.length
    log.white " modules with a branch named "
    log.green newBranch
    log.white "!"
    log.moat 1
