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
  @pairingAge: 4 # Is this right? I should look it up.
  @nestingProbability: 0.5
  @EARLY = 0
  @LATE = 1

  constructor: (@_nestingPreference) ->
    @birthYear = Clock.currentYear
    @uuid = Bird.uuidFactory.v4()
    @_nestingPreference ?= if Math.random() < 0.5
      Bird.EARLY
    else
      Bird.LATE

  age: -> Clock.currentYear - @birthYear

  canMate: -> @age() >= Bird.pairingAge

  nestingPreference: -> @_nestingPreference

module.exports = Bird
