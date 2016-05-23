
assertType = require "assertType"
exec = require "exec"
log = require "log"

module.exports = (modulePath) ->

  assertType modulePath, String

  exec "git tag", cwd: modulePath

  .then (stdout) ->

    if stdout.length is 0
      return []

    return stdout.split log.ln
