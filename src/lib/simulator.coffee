###

Basic simulator that's in charge of running through
the events for a year, and then running multiple
years.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

Clock = require './clock'
Nesting = require './nesting'

class Simulator

  constructor: (@population) ->

  advanceOneYear: () ->
    Clock.incrementYear()
    @population.mateUnpairedBirds()
    nesting = new Nesting(@population.matingPairs())
    newBirds = nesting.reproductionCycle()
    @population.addBird(b) for b in newBirds
    @population.mortalityPass()
    @population.capToCarryingCapacity()
    return

  getPopulation: () -> @population

module.exports = Simulator
