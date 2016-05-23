
assertTypes = require "assertTypes"
exec = require "exec"

optionTypes =
  modulePath: String
  branchName: String
  remoteName: String.Maybe

module.exports = ->

  assertTypes options, optionTypes

  { modulePath, branchName, remoteName } = options

  exec "git branch -D #{branchName}", cwd: modulePath

  .then ->

    return if not remoteName

    exec "git push #{remoteName} --delete #{branchName}", cwd: modulePath

  .fail (error) ->

    expected = "error: Cannot delete the branch '#{branchName}' which you are currently on."
    if error.message is expected
      throw Error "Cannot delete the current branch!"

    lines = error.message.split log.ln
    expected = "fatal: '#{branchName}' does not appear to be a git repository"
    if lines[0] is expected
      throw Error "The given remote repository does not exist!"

    throw error
