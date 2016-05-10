
{ assertType } = require "type-utils"

exec = require "exec"

module.exports = (modulePath) ->
  assertType modulePath, String
  exec "git rev-parse --abbrev-ref HEAD", cwd: modulePath
