
assertTypes = require "assertTypes"
isType = require "isType"
exec = require "exec"

optionTypes =
  modulePath: String
  tagName: String
  force: Boolean.Maybe

module.exports = (options) ->

  if isType options, String
    options =
      modulePath: arguments[0]
      tagName: arguments[1]

  assertTypes options, optionTypes

  { tagName, modulePath, force } = options

  args = [ tagName ]
  args.unshift "-f" if force

  exec "git tag", args, cwd: modulePath

  .fail (error) ->

    if not force
      expected = "fatal: tag '#{tagName}' already exists"
      if error.message is expected
        throw Error "Tag already exists!"

    throw error
