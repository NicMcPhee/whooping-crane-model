###

Basic model of a population's collection of nests.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

Bird = require '../lib/bird'
Nest = require '../lib/nest'

class Nesting

  constructor: (matingPairs) ->
    nestingPairs = matingPairs.filter((pr) -> Math.random() < Bird.nestingProbability)
    @_activeNests = (new Nest(p) for p in nestingPairs)
    @_abandonedNests = []

  activeNests: () -> @_activeNests

  abandonedNests: () -> @_abandonedNests

  abandonNests: () ->
    @_abandonedNests = @_activeNests.filter((n) -> n.isBlackFly)
    @_activeNests = @_activeNests.filter((n) -> not n.isBlackFly)

module.exports = Nesting
