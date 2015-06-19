'use strict'

require 'mocha-cakes'

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

    Scenario false, "Run one generation, all immature", ->
      before -> Clock.reset()

      numInitialBirds = 200
      simulator = null
      expectedMortality = numInitialBirds * Bird.firstYearMortalityRate
      expectedNewPopSize = numInitialBirds - expectedMortality
      expectedSurvivingNewBirds = -1000

      Given "I construct a population of #{numInitialBirds} \
              early nesting birds", ->
        population = new Population(0)
        population.addBird(new Bird(Bird.EARLY)) for [0...numInitialBirds]
        simulator = new Simulator(population)
      And "I advance the clock #{Bird.pairingAge} years", ->
        Clock.setYear(Bird.pairingAge)
        Clock.currentYear.should.eql Bird.pairingAge
      When "I run the simulation for one year", ->
        simulator.advanceOneYear()
      Then "the clock has advanced a year", ->
        Clock.currentYear.should.eql (Bird.pairingAge+1)
      And "the population size is approximately #{expectedNewPopSize}", ->
        population = simulator.getPopulation()
        population.birds().length.should.be.approximately expectedNewPopSize,
          0.1 * expectedNewPopSize
      And "the number of new birds is \
              approximately #{expectedSurvivingNewBirds}", ->
        population = simulator.getPopulation()
        console.log(population.birds().length)
        ages = (b.age() for b in population.birds())
        newBirds = population.birds().filter((b) -> b.age() == 0)
        console.log(newBirds.length)
        newBirds.length.should.be.approximately expectedSurvivingNewBirds,
          expectedSurvivingNewBirds * 0.33

    Scenario false, "Run one generation, all mature early nesters", ->
      before -> Clock.reset()

      numInitialBirds = 200
      simulator = null
      expectedNumNewBirds = 6
      expectedSurvivingNewBirds =
        expectedNumNewBirds * (1 - Bird.firstYearMortalityRate)
      expectedMortality =
        expectedNumNewBirds * Bird.firstYearMortalityRate +
        numInitialBirds * Bird.matureMortalityRate
      expectedNewPopSize =
        numInitialBirds + expectedNumNewBirds - expectedMortality

      Given "I construct a population of #{numInitialBirds} \
              early nesting birds", ->
        population = new Population(0)
        population.addBird(new Bird(Bird.EARLY)) for [0...numInitialBirds]
        simulator = new Simulator(population)
      And "I advance the clock #{Bird.pairingAge} years", ->
        Clock.setYear(Bird.pairingAge)
        Clock.currentYear.should.eql Bird.pairingAge
      When "I run the simulation for one year", ->
        simulator.advanceOneYear()
      Then "the clock has advanced a year", ->
        Clock.currentYear.should.eql (Bird.pairingAge+1)
      And "the population size is approximately #{expectedNewPopSize}", ->
        population = simulator.getPopulation()
        population.birds().length.should.be.approximately expectedNewPopSize,
          0.1 * expectedNewPopSize
      And "the number of new birds is \
              approximately #{expectedSurvivingNewBirds}", ->
        population = simulator.getPopulation()
        console.log(population.birds().length)
        ages = (b.age() for b in population.birds())
        newBirds = population.birds().filter((b) -> b.age() == 0)
        console.log(newBirds.length)
        newBirds.length.should.be.approximately expectedSurvivingNewBirds,
          expectedSurvivingNewBirds * 0.33
