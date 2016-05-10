
exec = require "exec"

module.exports = (modulePath) ->
  exec "git tag", cwd: modulePath
  .then (stdout) ->
    tags = stdout.split log.ln
    tags.shift() # Remove the starting newline.
    return tags
