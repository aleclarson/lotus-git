
changeBranch = require "../core/changeBranch"
pushVersion = require "./pushVersion"
assertRepo = require "../core/assertRepo"
become = require "./become"

module.exports = (options) ->

  modulePath = process.cwd()

  version = options._.shift()

  force = options.force ?= options.f

  assertRepo modulePath

  .then -> changeBranch modulePath, "master"

  .then ->

    _ = [ "unstable" ]

    become { _, force }

  .then ({ error }) ->

    if error is "empty"
      return changeBranch modulePath, "unstable"

    if error is "conflicts"
      return

    _ = [ version ]

    pushVersion { _, force }

    .then -> changeBranch modulePath, "unstable"

  .fail (error) ->

    changeBranch modulePath, "unstable"

    .then -> throw error
