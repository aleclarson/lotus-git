
Repository = require "git-repo"
Promise = require "Promise"
os = require "os"

# TODO: Run the 'build' phase of lotus.
module.exports = (args) ->

  options =
    force: args.force ? args.f
    remote: args.remote or args.r or "origin"
    message: args.m

  repo = Repository process.cwd()

  repo.stageFiles "*"

  .then ->
    repo.isStaged()
    .assert "No changes were staged!"

  .then ->

    message = getDateString()

    if options.message
      message += os.EOL + options.message

    repo.commit message

  .then ->

    log.moat 1
    log.gray "Pushing..."
    log.moat 1

    repo.pushBranch
      force: options.force
      remote: options.remote

    .fail (error) ->

      log.moat 1
      log.red error.stack
      log.moat 1

      # Force an upstream branch to exist.
      if /The current branch [^\s]+ has no upstream branch/.test error.message
        return repo.pushBranch
          force: options.force
          remote: options.remote
          upstream: yes

      throw error

    .then ->

      repo.getBranch()

      .then (currentBranch) ->

        repo.getHead currentBranch,
          remote: options.remote
          message: yes

        .then (commit) ->
          log.moat 1
          log.green "Push success! "
          log.gray.dim options.remote + "/" + currentBranch
          log.moat 1
          log.yellow commit.id.slice 0, 7
          log.white " ", commit.message
          log.moat 1

    .fail (error) ->

      repo.resetBranch "HEAD^"

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
