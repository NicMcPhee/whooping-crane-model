###

Basic model of a population of birds (whooping cranes).

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

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

  constructor: (popSize) ->
    @_unpairedBirds = (new Bird() for [0...popSize])
    @_pairings = []

  addBird: (bird) ->
    bird ?= new Bird()
    @_unpairedBirds.push(bird)

  birds: -> @_unpairedBirds.concat([].concat.apply([], @_pairings))

  unpairedBirds: -> @_unpairedBirds

  matingPairs: -> @_pairings

  size: -> @_unpairedBirds.length + 2*@_pairings.length

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
    # Undefined

module.exports = Population
