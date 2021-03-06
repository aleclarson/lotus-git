
Promise = require "Promise"
Path = require "path"
sync = require "sync"
exec = require "exec"
git = require "git-utils"
log = require "log"

printStatus = require "../utils/printStatus"

module.exports = (options) ->

  if moduleName = options._.shift()

    return lotus.Module.load moduleName

    .then (module) ->
      unless git.isRepo module.path
        throw Error "Expected a repository: '#{module.path}'"

      git.getStatus module.path

      .then (status) ->
        printStatus module.name, status

  log.moat 1 if options.names

  lotus.Module.crawl lotus.path

  .then (modules) ->

    log.moat 1
    log.white "Found "
    log.yellow modules.length
    log.white " modules in "
    log.cyan lotus.path
    log.moat 1

    Promise.chain modules, (module) ->

      return if not git.isRepo module.path
      return if lotus.isModuleIgnored module.name

      git.getStatus module.path,
        raw: options.names

      .then (status) ->

        if options.names
          return if not status.length
          log.moat 0
          log.bold module.name
          return

        printStatus module.name, status

    .then ->
      log.moat 1 if options.names
