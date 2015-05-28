###

Basic model of an individual bird (whooping crane).

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

Bird = require '../lib/bird'

class Nest

  constructor: (@_builders) ->

  @constructNests: (matingPairs) ->
    nestingPairs = matingPairs.filter((pr) -> Math.random() < Bird.nestingProbability)
    (new Nest(p)) for p in nestingPairs

  builders: -> @_builders

module.exports = Nest
