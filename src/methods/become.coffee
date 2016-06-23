
hasKeys = require "hasKeys"
exec = require "exec"
git = require "git-utils"
log = require "log"

module.exports = (options) ->

  modulePath = process.cwd()

  fromBranch = options._.shift()

  force = options.force ?= options.f

  git.assertRepo modulePath

  .then ->
    git.assertClean modulePath

  .then ->

    if not fromBranch

      log.moat 1
      log.red "Error: "
      log.white "Must provide a branch name!"
      log.moat 1

      return git.getBranches modulePath

      .then (branches) ->
        log.plusIndent 2
        log.moat 1
        for branchName in branches
          log.white branchName
          log.green " *" if branchName is branches.current
          log.moat 1
        log.popIndent()

    git.mergeBranch { modulePath, fromBranch, force }

    .then ->
      git.getStatus modulePath

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
        return { error: "conflicts" }

      hasChanges = hasKeys(status.staged) or hasKeys(status.tracked)
      if not hasChanges
        log.moat 1
        log.red "Merge did nothing!"
        log.moat 0
        log.gray.dim "No changes were detected."
        log.moat 1
        return exec "git reset", cwd: modulePath
        .then -> { error: "empty" }

      git.unstageAll modulePath

      .then -> # We must use 'git commit' to conclude the merge.
        exec "git commit", cwd: modulePath

      .then ->
        git.stageAll modulePath

      .then ->

        log.moat 1
        log.green "Merge success! "
        log.gray.dim "Changes are now staged."
        log.moat 1

        { error: null }
