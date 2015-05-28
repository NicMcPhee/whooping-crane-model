###

Basic model of a population's collection of nests.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

Bird = require '../lib/bird'
Nest = require '../lib/nest'

# Move shuffle, chunk to a util file

# From https://gist.github.com/ddgromit/859699
shuffle = (a) ->
  i = a.length
  while --i > 0
    j = ~~(Math.random() * (i + 1))
    t = a[j]
    a[j] = a[i]
    a[i] = t
  a

class Nesting

  constructor: (matingPairs) ->
    nestingPairs = matingPairs.filter((pr) -> Math.random() < Bird.nestingProbability)
    @_activeNests = (new Nest(p) for p in nestingPairs)
    @_collectedNests = []
    @_abandonedNests = []

  activeNests: () -> @_activeNests

  collectedNests: () -> @_collectedNests

  abandonedNests: () -> @_abandonedNests

  collectEggs: () ->
    earlyNests = @_activeNests.filter((n) -> n.nestingTime() is Bird.EARLY)
    shuffle(earlyNests)
    numToCollect = Math.floor(earlyNests.length * Bird.collectionProbability)
    @_collectedNests = earlyNests[0...numToCollect]
    @_activeNests = @_activeNests.filter((n) => n not in @_collectedNests)

  abandonNests: () ->
    @_abandonedNests = @_activeNests.filter((n) -> n.nestingTime() is Bird.EARLY)
    @_activeNests = @_activeNests.filter((n) -> n.nestingTime() is Bird.LATE)

module.exports = Nesting
