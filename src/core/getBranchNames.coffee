
{ assertType } = require "type-utils"

Finder = require "finder"
sync = require "sync"
exec = require "exec"

module.exports = (modulePath) ->

  assertType modulePath, String

  exec "git branch", cwd: modulePath

  .then (stdout) ->

    branches = []

    findName = Finder /^[\*\s]+([a-zA-Z0-9_\-\.]+)$/
    findName.group = 1

    lines = stdout.split "\n"
    sync.each lines, (line) ->
      name = findName line
      return unless name
      branches.push name
      if line[0] is "*"
        branches.current = name

    return branches
