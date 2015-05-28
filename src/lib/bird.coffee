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

  constructor: (@birthYear=Clock.currentYear) ->
    @uuid = Bird.uuidFactory.v4()

  age: -> Clock.currentYear - @birthYear

  canMate: -> @age() >= Bird.pairingAge

module.exports = Bird
