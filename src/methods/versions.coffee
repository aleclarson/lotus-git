
# Fetches the Git tags that use semantic versioning, as well as when each was last modified.
# Watches the Git tag directory for changes in versions!

# exports.initModule = (module) ->
#
#   versionCount = 0
#
#   tagDirPath = Path.join module.path, ".git/refs/tags"
#
#   Q.try ->
#     return unless syncFs.isDir tagDirPath
#     tags = syncFs.readDir tagDirPath
#     return unless tags?
#     sync.each tags, (tag, i) ->
#       return unless SemVer.valid tag
#       stats = syncFs.stats Path.join tagDirPath, tag
#       versionCount++
#       module.versions[tag] = lastModified: stats.mtime

  # .then ->
    # gaze = new Gaze tagDirPath + "/*"
    # gaze.on "ready", ->
    #   gaze.on "all", (event, path) ->
    #
    #     version = Path.basename path
    #     return if semver.valid(version) is null
    #
    #     switch event
    #
    #       when "add"
    #         style = "green"
    #         module.versions[version] = lastModified: new Date
    #         # TODO: If `--force` was used, replace old versions with this version.
    #         # TODO: Else, log that a new version is available and list modules that might be interested.
    #
    #       when "unlink"
    #         style = "red"
    #         delete module.versions[version]
    #         # TODO: Warn if any module relies on this version.
    #
    #       when "change"
    #         style = "blue"
    #         module.versions[version].lastModified = new Date
    #         # TODO: Reinstall this version for any modules that rely on it.
    #
    #     log.moat 1
    #     log color[style].dim event + " "
    #     log module.name + " "
    #     log color[style] version
    #     log.moat 1
    #
