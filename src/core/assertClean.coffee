
assertType = require "assertType"
Path = require "path"
exec = require "exec"
log = require "log"

getCurrentBranch = require "./getCurrentBranch"
hasChanges = require "./hasChanges"
pushStash = require "./pushStash"

module.exports = (modulePath) ->

  assertType modulePath, String

  hasChanges { modulePath }

  .then (hasChanges) ->

    return if not hasChanges

    getCurrentBranch modulePath

    .then (branchName) ->

      if branchName is null
        throw Error "An initial commit must exist!"

      moduleName = Path.relative lotus.path, modulePath
      log.moat 1
      log.red moduleName + "/" + branchName
      log.white " has uncommitted changes!"
      log.moat 1

      log.gray.dim "Want to call "
      log.yellow "git stash"
      log.gray.dim "?"

      shouldStash = prompt.sync { parseBool: yes }
      log.moat 1

      if not shouldStash
        throw Error "The current branch has uncommitted changes!"

      pushStash modulePath
