
assertTypes = require "assertTypes"
isType = require "isType"
assert = require "assert"
exec = require "exec"
log = require "log"

getCurrentBranch = require "./getCurrentBranch"

optionTypes =
  modulePath: String
  remoteName: String.Maybe
  upstream: Boolean.Maybe
  force: Boolean.Maybe

module.exports = (options) ->

  if isType options, String
    options = { modulePath: options }

  assertTypes options, optionTypes

  { modulePath, remoteName, upstream, force } = options

  remoteName ?= "origin"

  args = [ remoteName ]

  getCurrentBranch modulePath

  .then (currentBranch) ->

    if currentBranch is null
      throw Error "An initial commit must exist!"

    args.push "-u", currentBranch if upstream
    args.push "-f" if force

    exec "git push", args, cwd: modulePath

    .fail (error) ->

      lines = error.message.split log.ln

      if not force
        needsForce = /\(non-fast-forward\)$/.test lines[1]
        assert not needsForce, "Must force push to overwrite remote commits!"

      # Detect "force updates" and normal pushes. 'git push' incorrectly prints to 'stderr'!
      regex = RegExp "(\\+|\\s)[\\s]+([a-z0-9]{7})[\\.]{2,3}([a-z0-9]{7})[\\s]+(HEAD|#{currentBranch})[\\s]+->[\\s]+#{currentBranch}"
      return if regex.test lines[1]

      # Detect new branch pushes. 'git push' incorrectly prints to 'stderr'!
      regex = RegExp "\\*[\\s]+\\[new branch\\][\\s]+#{currentBranch}[\\s]+->[\\s]+#{currentBranch}"
      return if regex.test lines[1]

      throw error
