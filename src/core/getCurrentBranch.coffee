
assertType = require "assertType"
exec = require "exec"

module.exports = (modulePath) ->

  assertType modulePath, String

  exec "git rev-parse --abbrev-ref HEAD", cwd: modulePath

  .fail (error) ->

    if /ambiguous argument 'HEAD'/.test error.message
      return null

    throw error
