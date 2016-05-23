
assertType = require "assertType"
exec = require "exec"

module.exports = (modulePath) ->

  assertType modulePath, String

  exec "git reset", cwd: modulePath
