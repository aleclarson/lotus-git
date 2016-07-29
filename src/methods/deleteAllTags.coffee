
Promise = require "Promise"
isType = require "isType"
assert = require "assert"
Path = require "path"
sync = require "sync"
exec = require "exec"
git = require "git-utils"
log = require "log"

module.exports = (options) ->

  moduleName = options._.shift()
  assert moduleName, "Must provide a 'moduleName'!"

  lotus.Module.load moduleName

  .then (module) ->

    git.getTags module.path

    .then (tags) ->

      unless tags.length
        log.moat 1
        log.gray.dim "No tags exist."
        log.moat 1
        return

      exec.async "git tag -d", tags, cwd: module.path

      .then ->
        return unless isType options.remote, String
        Promise.all sync.map tags, (tag) ->
          exec.async "git push --delete #{options.remote} #{tag}"

      .then ->
        log.moat 1
        log.white "Deleted "
        log.red tags.length
        log.white " tags!"
        log.moat 1
