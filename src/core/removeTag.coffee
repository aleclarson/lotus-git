
assertTypes = require "assertTypes"
isType = require "isType"
exec = require "exec"

optionTypes =
  modulePath: String
  tagName: String
  remoteName: String.Maybe

module.exports = (options) ->

  if isType options, String
    options =
      modulePath: arguments[0]
      tagName: arguments[1]

  assertTypes options, optionTypes

  { modulePath, tagName, remoteName } = options

  exec "git tag -d #{tagName}", cwd: modulePath

  .then ->
    return if not remoteName
    exec "git push #{remoteName} :#{tagName}", cwd: modulePath
