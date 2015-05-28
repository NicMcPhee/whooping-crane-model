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
    @_nests = (new Nest(p) for p in nestingPairs)

  nests: () -> @_nests

module.exports = Nesting
