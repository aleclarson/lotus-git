
git = require "git-utils"

pushVersion = require "./pushVersion"
become = require "./become"

module.exports = (options) ->

  modulePath = process.cwd()

  version = options._.shift()

  force = options.force ?= options.f

  git.assertRepo modulePath

  .then -> git.setBranch modulePath, "master"

  .then ->

    _ = [ "unstable" ]

    become { _, force }

  .then ({ error }) ->

    if error is "empty"
      return git.setBranch modulePath, "unstable"

    if error is "conflicts"
      return

    _ = [ version ]

    pushVersion { _, force }

    .then -> git.setBranch modulePath, "unstable"

  .fail (error) ->

    git.setBranch modulePath, "unstable"

    .then -> throw error
