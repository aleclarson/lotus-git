
assertTypes = require "assertTypes"
Finder = require "finder"
isType = require "isType"
exec = require "exec"
log = require "log"

optionTypes =
  modulePath: String
  remoteName: String.Maybe
  parseOutput: Boolean.Maybe

module.exports = (options) ->

  if isType options, String
    options =
      modulePath: arguments[0]
      remoteName: arguments[1]

  assertTypes options, optionTypes

  { modulePath, remoteName, parseOutput } = options

  if remoteName

    return getRemotes modulePath

    .then (remotes) ->
      remoteUri = remotes[remoteName].push
      exec "git ls-remote --heads #{remoteUri}", cwd: modulePath

    .then (stdout) ->

      if parseOutput is no
        return stdout

      findName = Finder /refs\/heads\/(.+)$/
      branches = []
      for line in stdout.split log.ln
        name = findName line
        continue if not name
        branches.push name

      return branches

  return exec "git branch", cwd: modulePath

  .then (stdout) ->

    if parseOutput is no
      return stdout

    findName = Finder /^[\*\s]+([a-zA-Z0-9_\-\.]+)$/
    branches = []
    for line in stdout.split log.ln
      name = findName line
      continue if not name
      branches.push name
      if line[0] is "*"
        branches.current = name

    return branches
