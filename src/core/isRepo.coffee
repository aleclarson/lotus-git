
syncFs = require "io/sync"
Path = require "path"

module.exports = (path) ->

  if path[0] is "."
    path = Path.resolve process.cwd(), path

  else if path[0] isnt "/"
    path = lotus.path + "/" + path

  path = Path.join path, ".git"

  return syncFs.isDir path
