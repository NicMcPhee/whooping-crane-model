###

Basic model of an individual bird (whooping crane).

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

ModelParameters = require './model_parameters'
Clock = require './clock'

class Bird
  @uuidFactory: require('uuid')

  @EARLY = 0
  @LATE = 1
  @WILD_REARED = 2
  @CAPTIVE_REARED = 3
  @INITIAL_AGE = ModelParameters.pairingAge + 1

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
      if Math.random() < ModelParameters.mutationRate
        babyPreference = Bird.flip(babyPreference)
    else if Math.random() < 0.5
      babyPreference = Bird.EARLY
    else
      babyPreference = Bird.LATE
    new Bird(babyPreference, howReared)

  rollBackBirthYear: ->
    @birthYear = @birthYear - Bird.INITIAL_AGE

  age: -> Clock.currentYear - @birthYear

  canMate: -> @age() >= ModelParameters.pairingAge

  nestingPreference: -> @_nestingPreference

  isEarly: -> @_nestingPreference is Bird.EARLY

  isLate: -> @_nestingPreference is Bird.LATE

  howReared: -> @_howReared

  isCaptive: -> @_howReared is Bird.CAPTIVE_REARED

  isWild: -> @_howReared is Bird.WILD_REARED

  @flip: (preference) ->
    if preference == Bird.EARLY
      Bird.LATE
    else
      Bird.EARLY

  survives: ->
    mortality = ModelParameters.matureMortalityRate
    Math.random() >= mortality

module.exports = Bird
