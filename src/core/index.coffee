
{ isType, assertType } = require "type-utils"

define = require "define"

module.exports = require "./exec"

define module.exports,

  isRepo: lazy: ->
    require "./isRepo"

  status: lazy: ->
    require "./status"

  branches: lazy: ->
    require "./branches"

  currentBranch: lazy: ->
    require "./currentBranch"
