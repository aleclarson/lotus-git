
assertType = require "assertType"
exec = require "exec"

module.exports = (modulePath) ->

  assertType modulePath, String

  exec "git stash", cwd: modulePath

  .fail (error) ->

    if /bad revision 'HEAD'/.test error.message
      throw Error "Cannot stash unless an initial commit exists!"

    throw error
