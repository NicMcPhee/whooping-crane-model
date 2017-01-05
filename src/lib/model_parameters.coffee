###

Place to store the different model parameters.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

Clock = require './clock'

class ModelParameters
  @pairingAge: 4
  @nestingProbability: 0.5
  @_collectionProbability: 0.5
  @releaseCount: 6
  @renestingProbability: 0.5
  @eggConversionRate: 0.5
  @mutationRate: 0.001
  @firstYearMortalityRate: 0.6
  @matureMortalityRate: 0.1
  @carryingCapacity: 300
  @clockStart: 0

  @collectionProbability: ->
    console.log(Clock.currentYear)
    elapsed = Clock.currentYear - @clockStart
    if elapsed >= 100
      0
    else
      @_collectionProbability * (100-elapsed) / 100.0

  @setCollectionProbability: (collectionProbability) ->
    @_collectionProbability = collectionProbability
    @clockStart = Clock.currentYear

module.exports = ModelParameters
