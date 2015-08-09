'use strict'

require 'mocha-cakes'

ModelParameters = require '../lib/model_parameters'
Clock = require '../lib/clock'
Bird = require '../lib/bird'
Nesting = require '../lib/nesting'
Population = require '../lib/population'
Simulator = require '../lib/simulator'

###
======== A Handy Little Mocha-cakes Reference ========
https://github.com/quangv/mocha-cakes
https://github.com/visionmedia/should.js
https://github.com/visionmedia/mocha

Mocha-cakes:
  Feature, Scenario: maps to describe
  Given, When, Then: maps to it,
    but if first message argument is ommited, it'll be a describe
  And, But, I: maps to it,
    but if first message argument is ommited, it'll be a describe

Mocha hooks:
  before ()-> # before describe
  after ()-> # after describe
  beforeEach ()-> # before each it
  afterEach ()-> # after each it

Should assertions:
  should.exist('hello')
  should.fail('expected an error!')
  true.should.be.ok
  true.should.be.true
  false.should.be.false

  (()-> arguments)(1,2,3).should.be.arguments
  [1,2,3].should.eql([1,2,3])
  should.strictEqual(undefined, value)
  user.age.should.be.within(5, 50)
  username.should.match(/^\w+$/)

  user.should.be.a('object')
  [].should.be.an.instanceOf(Array)

  user.should.have.property('age', 15)

  user.age.should.be.above(5)
  user.age.should.be.below(100)
  user.pets.should.have.length(5)

  res.should.have.status(200) #res.statusCode should be 200
  res.should.be.json
  res.should.be.html
  res.should.have.header('Content-Length', '123')

  [].should.be.empty
  [1,2,3].should.include(3)
  'foo bar baz'.should.include('foo')
  { name: 'TJ', pet: tobi }.user.should.include({ pet: tobi, name: 'TJ' })
  { foo: 'bar', baz: 'raz' }.should.have.keys('foo', 'bar')

  (()-> throw new Error('failed to baz')).should.throwError(/^fail.+/)

  user.should.have.property('pets').with.lengthOf(4)
  user.should.be.a('object').and.have.property('name', 'tj')
###

Feature "Simulation",
  "In order to model crane populations",
  "as a modeler",
  "I need to be able to run the annual simulation loop", ->

    Scenario "Run one generation, all one-year old", ->
      before -> Clock.reset()

      numInitialBirds = 200
      simulator = null
      expectedMortality = numInitialBirds * ModelParameters.matureMortalityRate
      expectedNewPopSize = numInitialBirds - expectedMortality

      Given "I construct a population of #{numInitialBirds} \
              early nesting birds", ->
        population = new Population(0)
        population.addBird(new Bird(Bird.EARLY)) for [0...numInitialBirds]
        simulator = new Simulator(population)
      When "I run the simulation for one year", ->
        simulator.advanceOneYear()
      Then "the clock has advanced a year", ->
        Clock.currentYear.should.eql 1
      And "the population size is approximately #{expectedNewPopSize}", ->
        population = simulator.getPopulation()
        population.birds().length.should.be.approximately expectedNewPopSize,
          0.1 * expectedNewPopSize
      And "no birds are paired", ->
        population = simulator.getPopulation()
        population.matingPairs().length.should.eql 0
      And "all birds are one year old", ->
        population = simulator.getPopulation()
        birds = population.birds()
        for b in birds
          b.age().should.eql 1

    Scenario "Run one generation, all mature early nesters", ->
      before -> Clock.reset()

      numInitialBirds = 200
      numInitialNests = numInitialBirds // 2
      simulator = null
      expectedNumNewBirds = 6
      expectedSurvivingNewBirds =
        expectedNumNewBirds * (1 - ModelParameters.firstYearMortalityRate)
      expectedMortality =
        expectedNumNewBirds * ModelParameters.firstYearMortalityRate +
        numInitialBirds * ModelParameters.matureMortalityRate
      expectedNewPopSize =
        numInitialBirds + expectedNumNewBirds - expectedMortality
      brokenNestProbability =
        ModelParameters.matureMortalityRate +
        (1 - ModelParameters.matureMortalityRate) * ModelParameters.matureMortalityRate
      expectedBrokenNests = numInitialNests * brokenNestProbability
      expectedRemainingNests = numInitialNests - expectedBrokenNests
      expectedUnpairedBirds = expectedSurvivingNewBirds + expectedBrokenNests

      Given "I construct a population of #{numInitialBirds} \
              early nesting birds", ->
        population = new Population(0)
        population.addBird(new Bird(Bird.EARLY)) for [0...numInitialBirds]
        simulator = new Simulator(population)
      And "I advance the clock #{ModelParameters.pairingAge} years", ->
        Clock.setYear(ModelParameters.pairingAge)
        Clock.currentYear.should.eql ModelParameters.pairingAge
      When "I run the simulation for one year", ->
        simulator.advanceOneYear()
      Then "the clock has advanced a year", ->
        Clock.currentYear.should.eql (ModelParameters.pairingAge+1)
      And "the population size is approximately #{expectedNewPopSize}", ->
        population = simulator.getPopulation()
        population.birds().length.should.be.approximately expectedNewPopSize,
          0.1 * expectedNewPopSize
      And "most of the birds are paired", ->
        population = simulator.getPopulation()
        population.matingPairs().length.should.be.approximately(
          expectedRemainingNests, 0.33 * expectedRemainingNests)
        population.unpairedBirds().length.should.be.approximately(
          expectedUnpairedBirds, 0.33 * expectedUnpairedBirds)
      And "about #{expectedNumNewBirds} birds to have age 0", ->
        population = simulator.getPopulation()
        newborns = population.birds().filter((b) -> b.age() is 0)
        newborns.length.should.be.approximately expectedSurvivingNewBirds, 2
      And "all newborns are captive born", ->
        population = simulator.getPopulation()
        newborns = population.birds().filter((b) -> b.age() is 0)
        newborns.every((b) -> b.howReared() == Bird.CAPTIVE_REARED)

    Scenario "Run one generation, all mature late nesters", ->
      before -> Clock.reset()

      numInitialBirds = 200
      numInitialNests = numInitialBirds // 2
      simulator = null
      expectedNumNewBirds =
        numInitialNests * ModelParameters.nestingProbability * ModelParameters.eggConversionRate
      expectedSurvivingNewBirds =
        expectedNumNewBirds * (1 - ModelParameters.firstYearMortalityRate)
      expectedMortality =
        expectedNumNewBirds * ModelParameters.firstYearMortalityRate +
        numInitialBirds * ModelParameters.matureMortalityRate
      expectedNewPopSize =
        numInitialBirds + expectedNumNewBirds - expectedMortality
      brokenNestProbability =
        ModelParameters.matureMortalityRate +
        (1 - ModelParameters.matureMortalityRate) * ModelParameters.matureMortalityRate
      expectedBrokenNests = numInitialNests * brokenNestProbability
      expectedRemainingNests = numInitialNests - expectedBrokenNests
      expectedUnpairedBirds = expectedSurvivingNewBirds + expectedBrokenNests

      Given "I construct a population of #{numInitialBirds} \
              early nesting birds", ->
        population = new Population(0)
        population.addBird(new Bird(Bird.LATE)) for [0...numInitialBirds]
        simulator = new Simulator(population)
      And "I advance the clock #{ModelParameters.pairingAge} years", ->
        Clock.setYear(ModelParameters.pairingAge)
        Clock.currentYear.should.eql ModelParameters.pairingAge
      When "I run the simulation for one year", ->
        simulator.advanceOneYear()
      Then "the clock has advanced a year", ->
        Clock.currentYear.should.eql (ModelParameters.pairingAge+1)
      And "the population size is approximately #{expectedNewPopSize}", ->
        population = simulator.getPopulation()
        population.birds().length.should.be.approximately expectedNewPopSize,
          0.1 * expectedNewPopSize
      And "most of the birds are paired", ->
        population = simulator.getPopulation()
        population.matingPairs().length.should.be.approximately(
          expectedRemainingNests, 0.33 * expectedRemainingNests)
        population.unpairedBirds().length.should.be.approximately(
          expectedUnpairedBirds, 0.33 * expectedUnpairedBirds)
      And "about #{expectedSurvivingNewBirds} birds to have age 0", ->
        population = simulator.getPopulation()
        newborns = population.birds().filter((b) -> b.age() is 0)
        newborns.length.should.be.approximately expectedSurvivingNewBirds,
          0.5 * expectedSurvivingNewBirds
      And "all newborns are wild born", ->
        population = simulator.getPopulation()
        newborns = population.birds().filter((b) -> b.age() is 0)
        newborns.every((b) -> b.howReared() == Bird.WILD_REARED)

    Scenario "Smoke test of 10 generations", ->
      before -> Clock.reset()

      numInitialBirds = 200
      simulator = null

      Given "I construct a population of #{numInitialBirds}, \
              half early and half late", ->
        population = new Population(0)
        population.addBird(new Bird(Bird.EARLY)) for [0...numInitialBirds // 2]
        population.addBird(new Bird(Bird.LATE)) for [0...numInitialBirds // 2]
        simulator = new Simulator(population)
      When "I run the simulation 10 generations", ->
        simulator.advanceOneYear() for [0...10]
      Then "I should still have some birds", ->
        population = simulator.getPopulation()
        # console.log(population)
        population.birds().length.should.be.above 0
