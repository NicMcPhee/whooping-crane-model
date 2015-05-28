###

Basic model of an nest.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

Bird = require '../lib/bird'

class Nest

  constructor: (@_builders) ->
    firstParent = @_builders[0]
    secondParent = @_builders[1]
    if firstParent.nestingPreference() == secondParent.nestingPreference()
      @_nestingTime = firstParent.nestingPreference()
    else
      @_nestingTime = Bird.EARLY

  builders: -> @_builders

  nestingTime: -> @_nestingTime

module.exports = Nest
