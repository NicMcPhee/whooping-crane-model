'use strict'

require 'mocha-cakes'

Clock = require '../lib/clock'
Bird = require '../lib/bird'
Population = require '../lib/population'

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

Feature "Populations",
  "In order to model crane populations",
  "as a modeler",
  "I need to model populations of birds", ->

    Feature "Initial population",
      "In order to be able to track birds",
      "as a modeler",
      "I need to be able to construct an initial population of birds", ->

        Scenario "New population", ->
          before -> Clock.reset()

          population = null
          numBirds = 100

          Given "I construct a population of #{numBirds} birds", ->
            population = new Population(numBirds)
          Then "the population size should be #{numBirds}", ->
            population.size().should.eql numBirds
          And "the birth year of every bird should be 0", ->
            bird.birthYear.should.eql 0 for bird in population.birds()
          And "there should be no pairings", ->
            population.matingPairs().length.should.eql 0

    Feature "Add new bird later",
      "In order to model the birth of birds",
      "as a modeler",
      "I need to be able to add birds to the population", ->

        Scenario "Adding birds a few years after the start", ->

          population = null
          numInitialBirds = 100
          numNewBirds = 13
          numYears = 17

          Given "I construct a population of #{numInitialBirds} birds", ->
            population = new Population(numInitialBirds)
          And "I set the clock forward #{numYears} years", ->
            Clock.setYear(numYears)
            (bird.age().should.eql numYears) for bird in population.birds()
          When "I add #{numNewBirds} birds", ->
            population.addBird() for [0...numNewBirds]
          Then "I have #{numInitialBirds + numNewBirds} birds", ->
            population.birds().length.should.eql (numInitialBirds + numNewBirds)
          And "#{numInitialBirds} should be #{numYears} years old", ->
            birds = population.birds()
            oldBirds = birds.filter((b) -> b.age() > 0)
            oldBirds.length.should.eql numInitialBirds
          And "#{numNewBirds} should have age zero", ->
            birds = population.birds()
            newBirds = birds.filter((b) -> b.age() == 0)
            newBirds.length.should.eql numNewBirds

    Feature "Get unpaired birds",
      "In order to pair up unpaired birds",
      "as a modeler",
      "I need to be able to get a list of unpaired birds", ->

        Scenario "New population", ->

          population = null
          numBirds = 100

          Given "I construct a population of #{numBirds} birds", ->
            population = new Population(numBirds)
          Then "all the birds should be unpaired", ->
            population.unpairedBirds().length.should.eql numBirds

    Feature "Pair unpaired birds",
      "In order to model the mating",
      "as a modeler",
      "I need to be able to pair unpaired birds old enough to pair", ->

        Scenario "No one old enough to pair", ->

          population = null
          numBirds = 100

          Given "I construct a population of #{numBirds} birds", ->
            Clock.reset()
            population = new Population(numBirds)
          When "I pair unpaired birds", ->
            population.mateUnpairedBirds()
          Then "all the birds are still unpaired because \
                  they're not old enough", ->
            population.unpairedBirds().length.should.eql numBirds

        Scenario "Everyone unpaired and old enough to pair", ->

          population = null
          numBirds = 100

          Given "I construct a population of #{numBirds} birds", ->
            population = new Population(numBirds)
          And "I set the clock ahead #{Bird.pairingAge} years", ->
            Clock.currentYear = Bird.pairingAge
          When "I pair unpaired birds", ->
            population.mateUnpairedBirds()
          Then "Everyone should be paired", ->
            population.unpairedBirds().length.should.eql 0
            population.matingPairs().length.should.eql (numBirds // 2)

        Scenario "Odd number to pair", ->
          before -> Clock.reset()

          population = null
          numBirds = 99

          Given "I construct a population of #{numBirds} birds", ->
            population = new Population(numBirds)
          And "I set the clock ahead #{Bird.pairingAge} years", ->
            Clock.currentYear = Bird.pairingAge
          When "I pair unpaired birds", ->
            population.mateUnpairedBirds()
          Then "All but one should be paired", ->
            population.unpairedBirds().length.should.eql 1
            population.matingPairs().length.should.eql (numBirds // 2)

        Scenario "Pairing a few new birds", ->

          population = null
          numOldBirds = 45
          numNewBirds = 15
          numBirds = numOldBirds + numNewBirds
          numPairs = numBirds // 2

          Given "I construct a population of #{numOldBirds} birds", ->
            population = new Population(numOldBirds)
          And "I set the clock ahead #{Bird.pairingAge} years", ->
            Clock.currentYear = Bird.pairingAge
          And "I pair unpaired birds", ->
            population.mateUnpairedBirds()
          And "I add #{numNewBirds} new birds", ->
            population.addBird() for [0...numNewBirds]
          And "I advance the clock another #{Bird.pairingAge} years", ->
            Clock.currentYear += Bird.pairingAge
          When "I pair unpaired birds", ->
            population.mateUnpairedBirds()
          Then "All should be paired", ->
            population.unpairedBirds().length.should.eql 0
            population.matingPairs().length.should.eql numPairs

    Feature "Collection of all birds combines paired and unpaired birds",
      "In order to model populations",
      "as a modeler",
      "I need to be able to get all the birds, both paired and unpaired", ->

        Scenario "Pairing old birds followed by adding unpaired birds", ->
          before -> Clock.reset()

          population = null
          numOldBirds = 45
          numNewBirds = 18
          totalBirds = numOldBirds + numNewBirds

          Given "I construct a population of #{numOldBirds} birds", ->
            population = new Population(numOldBirds)
          Then "The number of birds is #{numOldBirds}", ->
            population.birds().length.should.eql numOldBirds
          Given "I set the clock ahead #{Bird.pairingAge} years", ->
            Clock.currentYear = Bird.pairingAge
          And "I pair unpaired birds", ->
            population.mateUnpairedBirds()
          Then "The number of birds is #{numOldBirds}", ->
            population.birds().length.should.eql numOldBirds
          Given "I add #{numNewBirds} new birds", ->
            population.addBird() for [0...numNewBirds]
          Then "The number of birds is #{totalBirds}", ->
            population.birds().length.should.eql totalBirds
          Given "I advance the clock another #{Bird.pairingAge} years", ->
            Clock.currentYear += Bird.pairingAge
          When "I pair unpaired birds", ->
            population.mateUnpairedBirds()
          Then "All should be paired", ->
            population.unpairedBirds.length.should.eql 0
            population.matingPairs().length.should.eql totalBirds // 2
          And "The number of birds is #{totalBirds}", ->
            population.birds().length.should.eql totalBirds

    Feature "Mortality pass probabilistically kills birds",
      "In order to model the mortality of birds",
      "as a modeler",
      "We need birds to die with some probability", ->

        Scenario "A population of only immature birds", ->
          before -> Clock.reset()

          population = null
          numBirds = 101
          deceasedBirds = numBirds * Bird.firstYearMortalityRate
          remainingBirds = numBirds - deceasedBirds

          Given "I construct a population of #{numBirds} birds", ->
            population = new Population(numBirds)
          And "I pair the unpaired birds", ->
            population.mateUnpairedBirds()
          When "I run a mortality pass", ->
            population.mortalityPass()
          Then "the number of remaining birds should be lower", ->
            birds = population.birds()
            birds.length.should.be.below numBirds
          And "there should be approximately #{deceasedBirds} fewer", ->
            birds = population.birds()
            numBirdsLeft = birds.length
            numLostBirds = numBirds - numBirdsLeft
            numLostBirds.should.be.approximately deceasedBirds,
              0.33 * deceasedBirds
          And "none are paired", ->
            population.matingPairs().length.should.eql 0
            birds = population.birds()
            population.unpairedBirds().length.should.eql birds.length

        Scenario "A population of only one-year old birds", ->
          before -> Clock.reset()

          population = null
          numBirds = 101
          deceasedBirds = numBirds * Bird.matureMortalityRate
          remainingBirds = numBirds - deceasedBirds

          Given "I construct a population of #{numBirds} birds", ->
            population = new Population(numBirds)
          And "I advance the clock one year", ->
            Clock.incrementYear()
          And "I pair the unpaired birds", ->
            population.mateUnpairedBirds()
          When "I run a mortality pass", ->
            population.mortalityPass()
          Then "the number of remaining birds should be lower", ->
            birds = population.birds()
            birds.length.should.be.below numBirds
          And "there should be approximately #{deceasedBirds} birds fewer", ->
            birds = population.birds()
            numBirdsLeft = birds.length
            numLostBirds = numBirds - numBirdsLeft
            # The 0.8 is stupidly high because 10 out of 100 is
            # so low that you have to go down to 2 to get the p-value
            # to drop below 0.05.
            numLostBirds.should.be.approximately deceasedBirds,
              0.8 * deceasedBirds
          And "none are paired", ->
            population.matingPairs().length.should.eql 0
            birds = population.birds()
            population.unpairedBirds().length.should.eql birds.length

        Scenario "A population of only newly paired birds", ->
          before -> Clock.reset()

          population = null
          numBirds = 101
          deceasedBirds = numBirds * Bird.matureMortalityRate
          remainingBirds = numBirds - deceasedBirds
          nestMortality =
            Bird.matureMortalityRate +
            (1 - Bird.matureMortalityRate) * Bird.matureMortalityRate
          expectedPairs = (numBirds // 2) * (1 - nestMortality)
          expectedSingles = 1 + (numBirds // 2) * nestMortality

          Given "I construct a population of #{numBirds} birds", ->
            population = new Population(numBirds)
          And "I advance the clock #{Bird.pairingAge} years", ->
            Clock.setYear(Bird.pairingAge)
          And "I pair the unpaired birds", ->
            population.mateUnpairedBirds()
          When "I run a mortality pass", ->
            population.mortalityPass()
          Then "the number of remaining birds should be lower", ->
            birds = population.birds()
            birds.length.should.be.below numBirds
          And "there should be approximately #{deceasedBirds} birds fewer", ->
            birds = population.birds()
            numBirdsLeft = birds.length
            numLostBirds = numBirds - numBirdsLeft
            # The 0.8 is stupidly high because 10 out of 100 is
            # so low that you have to go down to 2 to get the p-value
            # to drop below 0.05.
            numLostBirds.should.be.approximately deceasedBirds,
              0.8 * deceasedBirds
          And "most are paired", ->
            population.matingPairs().length.should.be.approximately(
              expectedPairs, 0.33 * expectedPairs)
            birds = population.birds()
            # The 0.8 is stupidly high because 10 out of 100 is
            # so low that you have to go down to 2 to get the p-value
            # to drop below 0.05.
            population.unpairedBirds().length.should.be.approximately(
              expectedSingles, 0.8 * expectedSingles)
