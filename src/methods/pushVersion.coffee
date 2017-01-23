
semver = require "node-semver"
git = require "git-utils"
log = require "log"

module.exports = (args) ->

  modulePath = process.cwd()

  version = args._.shift()

  if not semver.valid version
    log.moat 1
    log.red "Error: "
    log.white "Invalid version formatting! "
    log.gray.dim version
    log.moat 1
    return

  options =
    force: args.force ? args.f
    remote: args.remote or args.r or "origin"
    message: args.m

  git.assertRepo modulePath

  .then ->
    log.moat 1
    log.gray "Pushing..."
    log.moat 1
    git.pushVersion modulePath, version,
      force: options.force
      remote: options.remote
      message: options.message

  .then ->
    git.getBranch modulePath

  .then (currentBranch) ->

    git.getHead modulePath, currentBranch, options.remote

    .then (commit) ->
      log.moat 1
      log.green "Push success! "
      log.gray.dim options.remote + "/" + currentBranch
      log.moat 1
      log.yellow commit.id.slice 0, 7
      log.white " ", commit.message
      log.moat 1

  .fail (error) ->

    if error.message is "Must force push to overwrite remote commits!"
      log.moat 1
      log.red "Push failed!"
      log.moat 1
      log.gray.dim "Must use "
      log.white "--force"
      log.gray.dim " when overwriting remote commits!"
      log.moat 1
      return

    throw error
