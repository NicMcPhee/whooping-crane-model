###

Basic model of a population's collection of nests.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

ModelParameters = require './model_parameters'
Bird = require './bird'
Nest = require './nest'

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
    nestingPairs = matingPairs.filter(
      (pr) -> Math.random() < ModelParameters.nestingProbability)
    @_activeNests = (new Nest(p) for p in nestingPairs)
    @_collectedNests = []
    @_releasedNests = []
    @_abandonedNests = []

  activeNests: () -> @_activeNests

  collectedNests: () -> @_collectedNests

  releasedNests: () -> @_releasedNests

  abandonedNests: () -> @_abandonedNests

  collectEggs: () ->
    earlyNests = @_activeNests.filter((n) -> n.nestingTime() is Bird.EARLY)
    shuffle(earlyNests)
    numToCollect = Math.floor(
      earlyNests.length * ModelParameters.collectionProbability)
    @_collectedNests = earlyNests[0...numToCollect]
    @_activeNests = @_activeNests.filter((n) => n not in @_collectedNests)
    # Only some collected eggs will be released back into the wild.
    @_releasedNests = @_collectedNests[0...ModelParameters.releaseCount]

  abandonNests: () ->
    @_abandonedNests = @_activeNests.filter(
      (n) -> n.nestingTime() is Bird.EARLY)
    @_activeNests = @_activeNests.filter(
      (n) -> n.nestingTime() is Bird.LATE)

  renest: () ->
    canRenest = @_abandonedNests.concat(@_collectedNests)
    secondNests = canRenest.filter((n) ->
      Math.random() < ModelParameters.renestingProbability)
    @_activeNests = @_activeNests.concat(secondNests)

  hatchNests: (birdType, nests) ->
    Bird.fromNest(nest, birdType) for nest in nests

  hatchEggs: () ->
    hatchedWildNests = @_activeNests.filter(
      (n) -> Math.random() < ModelParameters.eggConversionRate)
    newWildBirds = @hatchNests(Bird.WILD_REARED, hatchedWildNests)
    newCaptiveBirds = @hatchNests(Bird.CAPTIVE_REARED, @._releasedNests)
    newWildBirds.concat(newCaptiveBirds)

  reproductionCycle: () ->
    @collectEggs()
    @abandonNests()
    @renest()
    @hatchEggs()

module.exports = Nesting
