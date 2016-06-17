
log = require "log"

undoLatestCommit = require "../core/undoLatestCommit"
getCurrentBranch = require "../core/getCurrentBranch"
getLatestCommit = require "../core/getLatestCommit"
assertStaged = require "../core/assertStaged"
pushChanges = require "../core/pushChanges"
assertRepo = require "../core/assertRepo"
addCommit = require "../core/addCommit"
stageAll = require "../core/stageAll"

optionTypes =
  modulePath: String

# TODO: Run the 'build' phase of lotus.
module.exports = (options) ->

  modulePath = process.cwd()

  force = options.force ?= options.f
  message = options.m
  remoteName = options.remote or options.r or "origin"

  assertRepo modulePath

  .then ->
    stageAll modulePath

  .then ->
    assertStaged modulePath

  .then ->

    message = getDateString() +
      if message then log.ln + message
      else ""

    addCommit modulePath, message

  .then ->

    log.moat 1
    log.gray "Pushing..."
    log.moat 1

    pushChanges { modulePath, remoteName, force }

    .fail (error) ->

      # Force an upstream branch to exist. Is this possibly dangerous?
      if /^fatal: The current branch [^\s]+ has no upstream branch/.test error.message
        return pushChanges { modulePath, remoteName, force, upstream: yes }

      throw error

    .then ->

      getCurrentBranch modulePath

      .then (currentBranch) ->

        getLatestCommit modulePath, remoteName, currentBranch

        .then (commit) ->
          log.moat 1
          log.green "Push success! "
          log.gray.dim remoteName + "/" + currentBranch
          log.moat 1
          log.yellow commit.id.slice 0, 7
          log.white " ", commit.message
          log.moat 1

    .fail (error) ->

      undoLatestCommit modulePath

      .then ->

        if error.message is "Must force push to overwrite remote commits!"
          log.moat 1
          log.red "Push failed!"
          log.moat 1
          log.gray.dim "Must use "
          log.white "--force"
          log.gray.dim " when overwriting remote commits!"
          log.moat 1
          return

        throw error

getDateString = ->

  array = []

  date = new Date

  month = date.getMonth() + 1
  month = "0" + month if month < 10
  array.push month

  day = date.getDate()
  day = "0" + day if day < 10
  array.push "/", day

  array.push "/", date.getFullYear()

  hours = date.getHours() % 12
  array.push " ", if hours is 0 then 12 else hours

  minutes = date.getMinutes()
  minutes = "0" + minutes if minutes < 10
  array.push ":", minutes

  array.push " ", if date.getHours() > 12 then "PM" else "AM"

  return array.join ""
