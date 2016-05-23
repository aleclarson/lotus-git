
hasChanges = require "./hasChanges"

module.exports = (modulePath) ->

  hasChanges modulePath, { group: "staged" }

  .then (hasStagedChanges) ->

    if not hasStagedChanges
      throw Error "No changes are staged!"
