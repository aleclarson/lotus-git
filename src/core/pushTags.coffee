
assertTypes = require "assertTypes"
isType = require "isType"
exec = require "exec"
log = require "log"

optionTypes =
  modulePath: String
  remoteName: String.Maybe
  force: Boolean.Maybe

module.exports = (options) ->

  if isType options, String
    options = { modulePath: options }

  assertTypes options, optionTypes

  { modulePath, remoteName, force } = options

  remoteName ?= "origin"

  args = [ remoteName, "--tags" ]
  args.push "-f" if force

  exec "git push", args, cwd: modulePath

  .fail (error) ->

    lines = error.message.split log.ln

    if /\(already exists\)$/.test lines[1]
      throw Error "Tag already exists!"

    if /\(forced update\)$/.test lines[1]
      return # 'git push' incorrectly prints using stderr

    if /\* \[new tag\]/.test lines[1]
      return # 'git push' incorrectly prints using stderr

    throw error
