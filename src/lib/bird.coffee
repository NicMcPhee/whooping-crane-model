###

Basic model of an individual bird (whooping crane).

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

Clock = require './clock'

class Bird
  @uuidFactory: require('uuid')
  @pairingAge: 4
  @nestingProbability: 0.5
  @collectionProbability: 0.5
  @releaseCount: 6
  @eggConversionRate: 0.5 # Unclear if we have the right number here
  @mutationRate: 0.001 # From the bat modeling paper

  @EARLY = 0
  @LATE = 1
  @WILD_REARED = 2
  @CAPTIVE_REARED = 3

  constructor: (@_nestingPreference, @_howReared) ->
    @birthYear = Clock.currentYear
    @uuid = Bird.uuidFactory.v4()
    @_nestingPreference ?= if Math.random() < 0.5
      Bird.EARLY
    else
      Bird.LATE

  @fromNest: (nest, howReared) ->
    firstParent = nest.builders()[0]
    secondParent = nest.builders()[1]
    if firstParent.nestingPreference() == secondParent.nestingPreference()
      babyPreference = firstParent.nestingPreference()
      if Math.random() < Bird.mutationRate
        babyPreference = Bird.flip(babyPreference)
    else if Math.random() < 0.5
      babyPreference = Bird.EARLY
    else
      babyPreference = Bird.LATE
    new Bird(babyPreference, howReared)

  age: -> Clock.currentYear - @birthYear

  canMate: -> @age() >= Bird.pairingAge

  nestingPreference: -> @_nestingPreference

  howReared: -> @_howReared

  @flip: (preference) ->
    if preference == Bird.EARLY
      Bird.LATE
    else
      Bird.EARLY

module.exports = Bird
