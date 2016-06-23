
Promise = require "Promise"
isType = require "isType"
Path = require "path"
sync = require "sync"
exec = require "exec"
git = require "git-utils"
log = require "log"

module.exports = (options) ->

  { Module } = lotus

  modulePath = options._.shift()
  assert modulePath, "Must provide a 'modulePath'!"

  modulePath = Module.resolvePath modulePath

  git.getTags modulePath

  .then (tags) ->

    unless tags.length
      log.moat 1
      log.gray.dim "No tags exist."
      log.moat 1
      return

    exec "git tag -d", tags, cwd: modulePath

    .then ->
      return unless isType options.remote, String
      Promise.all sync.map tags, (tag) ->
        exec "git push --delete #{options.remote} #{tag}"

    .then ->
      log.moat 1
      log.white "Deleted "
      log.red tags.length
      log.white " tags!"
      log.moat 1
