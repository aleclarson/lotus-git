
assertTypes = require "assertTypes"
Promise = require "Promise"
isType = require "isType"
exec = require "exec"

pushStash = require "./pushStash"
popStash = require "./popStash"

optionTypes =
  modulePath: String
  keepChanges: Boolean.Maybe

module.exports = (options) ->

  if isType options, String
    options = { modulePath: arguments[0] }

  assertTypes options, optionTypes

  { modulePath, keepChanges } = options

  args = [ "HEAD^" ]
  args.unshift if keepChanges is no then "--hard" else "--soft"

  Promise.try ->
    # If the commit's changes should be scrapped,
    # we need to stash the working tree.
    # Otherwise, the hard reset will erase everything!
    if keepChanges is no
      pushStash modulePath

  .then ->
    exec "git reset", args, cwd: modulePath

  .fail (error) ->

    isFirstCommit = /ambiguous argument 'HEAD(\^)?'/.test error.message
    throw error if not isFirstCommit

    exec "git update-ref -d HEAD", cwd: modulePath

    .then ->
      return if keepChanges isnt no
      exec "git reset --hard", cwd: modulePath

  .then ->
    if keepChanges is no
      popStash modulePath
