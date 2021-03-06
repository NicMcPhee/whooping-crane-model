###

Basic model of a population of birds (whooping cranes).

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

ModelParameters = require './model_parameters'
Bird = require './bird'

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

# From http://bl.ocks.org/milafrerichs/7301183
chunk = (array, chunkSize) ->
  [].concat.apply [], array.map((elem, i) ->
    (if i % chunkSize then [] else [array.slice(i, i + chunkSize)])
  )

class Population

  constructor: (popSize, proportionEarlyNesters = 0.5) ->
    @_unpairedBirds =
      @makeBird(proportionEarlyNesters) for [0...popSize]
    @_pairings = []

  makeBird: (proportionEarlyNesters) ->
    bird = new Bird(@nestingPreference(proportionEarlyNesters))
    bird.rollBackBirthYear()
    bird

  nestingPreference: (proportionEarlyNesters) ->
    if Math.random() < proportionEarlyNesters
      Bird.EARLY
    else
      Bird.LATE

  addBird: (bird) ->
    bird ?= new Bird()
    @_unpairedBirds.push(bird)

  birds: -> @_unpairedBirds.concat([].concat.apply([], @_pairings))

  unpairedBirds: -> @_unpairedBirds

  matingPairs: -> @_pairings

  size: -> @_unpairedBirds.length + 2*@_pairings.length

  proportionLateNesters: ->
    return 0 if @size() == 0
    @birds().filter((b) -> b.isLate()).length / @size()

  proportionWildBorn: ->
    return 0 if @size() == 0
    @birds().filter((b) -> b.isWild()).length / @size()

  mateUnpairedBirds: ->
    toMate = @_unpairedBirds.filter((b) -> b.canMate())
    if toMate.length % 2 == 1
      toMate = toMate[1..]
    shuffle(toMate)
    @_unpairedBirds = @_unpairedBirds.filter((b) -> not (b in toMate))
    @_pairings = @_pairings.concat(chunk(toMate, 2))

  mortalityPass: ->
    @_unpairedBirds =
      @_unpairedBirds.filter((b) -> b.survives())
    survivingPairs = []
    for pair in @_pairings
      survivors = pair.filter((b) -> b.survives())
      if survivors.length == 2
        survivingPairs.push(pair)
      else if survivors.length == 1
        @_unpairedBirds.push(survivors[0])
    @_pairings = survivingPairs

  capToCarryingCapacity: ->
    @mortalityPass() while @size() > ModelParameters.carryingCapacity

module.exports = Population
