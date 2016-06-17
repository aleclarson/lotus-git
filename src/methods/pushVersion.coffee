
semver = require "node-semver"
log = require "log"

getCurrentBranch = require "../core/getCurrentBranch"
getLatestCommit = require "../core/getLatestCommit"
pushVersion = require "../core/pushVersion"
assertRepo = require "../core/assertRepo"

module.exports = (options) ->

  modulePath = process.cwd()

  version = options._.shift()

  if not semver.valid version
    log.moat 1
    log.red "Error: "
    log.white "Invalid version formatting! "
    log.gray.dim version
    log.moat 1
    return

  force = options.force ?= options.f
  message = options.m
  remoteName = options.remote or options.r or "origin"

  assertRepo modulePath

  .then ->
    log.moat 1
    log.gray "Pushing..."
    log.moat 1
    pushVersion { modulePath, version, remoteName, message, force }

  .then ->
    getCurrentBranch modulePath

  .then (currentBranch) ->

    getLatestCommit modulePath, remoteName, currentBranch

    .then (commit) ->
      log.moat 1
      log.green "Push success! "
      log.gray.dim remoteName + "/" + currentBranch
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
