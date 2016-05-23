
hasKeys = require "hasKeys"
exec = require "exec"
log = require "log"

assertClean = require "../core/assertClean"
mergeBranch = require "../core/mergeBranch"
getBranches = require "../core/getBranches"
unstageAll = require "../core/unstageAll"
assertRepo = require "../core/assertRepo"
getStatus = require "../core/getStatus"
stageAll = require "../core/stageAll"

module.exports = (options) ->

  modulePath = process.cwd()

  fromBranch = options._.shift()

  force = options.force ?= options.f

  assertRepo modulePath

  .then ->
    assertClean modulePath

  .then ->

    if not fromBranch

      log.moat 1
      log.red "Error: "
      log.white "Must provide a branch name!"
      log.moat 1

      return getBranches modulePath

      .then (branches) ->
        log.plusIndent 2
        log.moat 1
        for branchName in branches
          log.white branchName
          log.green " *" if branchName is branches.current
          log.moat 1
        log.popIndent()

    mergeBranch { modulePath, fromBranch, force }

    .then ->
      getStatus modulePath

    .then (status) ->

      if status.unmerged.length
        log.moat 1
        log.red "Merge conflicts detected!"
        log.moat 1
        log.plusIndent 2
        for { path } in status.unmerged
          log.white path
          log.moat 1
        log.popIndent()
        return

      log.moat 1
      log.green "Merge success! "
      log.gray.dim "Changes are now staged."
      log.moat 1

      return if not hasKeys status.staged

      unstageAll modulePath

      .then -> # We must use 'git commit' to conclude the merge.
        exec "git commit", cwd: modulePath

      .then ->
        stageAll modulePath
