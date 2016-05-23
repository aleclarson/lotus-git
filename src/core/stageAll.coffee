
assertType = require "assertType"
exec = require "exec"

module.exports = (modulePath) ->

  assertType modulePath, String

  exec "git add --all :/", cwd: modulePath
