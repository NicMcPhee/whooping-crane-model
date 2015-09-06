'use strict'

require 'mocha-cakes'

ModelParameters = require '../lib/model_parameters'
Clock = require '../lib/clock'
Bird = require '../lib/bird'
Population = require '../lib/population'
Nest = require '../lib/nest'
Nesting = require '../lib/nesting'

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

###
  It's possible that I could build the simulation without
  creating these nest objects (just act on pairs of individuals)
  but it's easier for me to think about this way, so I think
  I'm going to go with it for now.
###

makeNest = (nestingTime) ->
  firstBird = new Bird()
  secondBird = new Bird()
  nest = new Nest([firstBird, secondBird])
  nest._nestingTime = nestingTime
  nest

sleep = (ms) ->
  start = new Date().getTime()
  continue while new Date().getTime() - start < ms

Feature "Nesting",
  "In order to model crane populations",
  "as a modeler",
  "I need to model nesting and nest management", ->

    Feature "Can build nests from list of breeding pairs",
      "In order to model nesting",
      "as a modeler",
      "I want to be able to construct nests from breeding pairs", ->

        Scenario "New nests from breeding pairs", ->
          before -> Clock.reset()

          population = null
          numBirds = 100
          nesting = null
          expectedNests = null

          Given "I construct a population of #{numBirds} birds", ->
            population = new Population(100)
          And "I set the clock ahead #{ModelParameters.pairingAge} years", ->
            Clock.setYear(ModelParameters.pairingAge)
          And "I create breeding pairs", ->
            population.mateUnpairedBirds()
          When "I construct nests from the breeding pairs", ->
            matingPairs = population.matingPairs()
            expectedNests =
              ModelParameters.nestingProbability * matingPairs.length
            nesting = new Nesting(matingPairs)
          Then "I will usually have about #{expectedNests} nests", ->
            nesting.activeNests().length.should.be.approximately(expectedNests,
              0.33 * expectedNests)
            #nesting.should.fail("WHY DOES THIS KEEP PRINTING NULL?")

    Feature "Can model egg collection",
      "In order to model nest management",
      "as a modeler",
      "I need to model human collection of eggs from early nests", ->

        Scenario "Egg collection from proportion of early nests", ->
          numEarlyNests = 17
          numLateNests = 32
          totalNests = numEarlyNests + numLateNests
          earlyNests = null
          lateNests = null
          nesting = null
          numCollectedNests =
            Math.floor(numEarlyNests * ModelParameters.collectionProbability)
          numReleasedNests =
            Math.min(numCollectedNests, ModelParameters.releaseCount)
          numUncollectedNests =
            numEarlyNests - numCollectedNests
          numActiveNests = numUncollectedNests + numLateNests

          Given "I construct #{numEarlyNests} early nests", ->
            earlyNests = (makeNest(Bird.EARLY) for [0...numEarlyNests])
          And "I construct #{numLateNests} late nests", ->
            lateNests = (makeNest(Bird.LATE) for [0...numLateNests])
          And "I set the nesting to be those nests", ->
            nesting = new Nesting([])
            nesting._activeNests = earlyNests.concat(lateNests)
          Then "there should be #{totalNests} nests", ->
            nesting.activeNests().length.should.eql totalNests
          When "Eggs are collected", ->
            nesting.collectEggs()
          Then "I should have #{numUncollectedNests + numLateNests} \
                    active nests", ->
            nesting.activeNests().length.should.eql numActiveNests
          And "I should have #{numCollectedNests} collected nests", ->
            nesting.collectedNests().length.should.eql numCollectedNests
          And "I should have #{numReleasedNests} released nests", ->
            nesting.releasedNests().length.should.eql numReleasedNests

    Feature "Can model nest abandonment",
      "In order to model nesting",
      "as as modeler",
      "I need to be able to model nest abandonment", ->

        Scenario "Abandoment of all early nests w/o collection", ->
          numEarlyNests = 37
          numLateNests = 18
          totalNests = numEarlyNests + numLateNests
          earlyNests = null
          lateNests = null
          nesting = null

          Given "I construct #{numEarlyNests} early nests", ->
            earlyNests = (makeNest(Bird.EARLY) for [0...numEarlyNests])
          And "I construct #{numLateNests} late nests", ->
            lateNests = (makeNest(Bird.LATE) for [0...numLateNests])
          And "I set the nesting to be those nests", ->
            nesting = new Nesting([])
            nesting._activeNests = earlyNests.concat(lateNests)
          Then "Total number of nests should be #{totalNests}", ->
            nesting.activeNests().length.should.eql totalNests
          When "Birds abandon their nests", ->
            nesting.abandonNests()
          Then "I should have #{numEarlyNests} abandoned nests", ->
            nesting.abandonedNests().length.should.eql numEarlyNests
          And "I should have #{numLateNests} active nests", ->
            nesting.activeNests().length.should.eql numLateNests

        Scenario "Abandoment of all early nests after collection", ->

          Scenario "More early nests than relase count", ->
            numEarlyNests = 37
            numLateNests = 5
            totalNests = numEarlyNests + numLateNests
            earlyNests = null
            lateNests = null
            nesting = null
            numCollectedNests =
              Math.floor(numEarlyNests * ModelParameters.collectionProbability)
            numReleasedNests =
              Math.min(numCollectedNests, ModelParameters.releaseCount)
            numUncollectedNests =
              numEarlyNests - numCollectedNests

            Given "I construct #{numEarlyNests} early nests", ->
              earlyNests = (makeNest(Bird.EARLY) for [0...numEarlyNests])
            And "I construct #{numLateNests} late nests", ->
              lateNests = (makeNest(Bird.LATE) for [0...numLateNests])
            And "I set the nesting to be those nests", ->
              nesting = new Nesting([])
              nesting._activeNests = earlyNests.concat(lateNests)
            Then "Total number of nests should be #{totalNests}", ->
              nesting.activeNests().length.should.eql totalNests
            When "Eggs are collected", ->
              nesting.collectEggs()
            And "Birds abandon their nests", ->
              nesting.abandonNests()
            Then "I should have #{numUncollectedNests + numLateNests} \
                    active nests", ->
              nesting.activeNests().length.should.eql numLateNests
            And "I should have #{numCollectedNests} collected nests", ->
              nesting.collectedNests().length.should.eql numCollectedNests
            And "I should have #{numReleasedNests} released nests", ->
              nesting.releasedNests().length.should.eql numReleasedNests
            And "I should have #{numEarlyNests} abandoned nests", ->
              nesting.abandonedNests().length.should.eql numUncollectedNests

          Scenario "Fewer early nests than relase count", ->
            numEarlyNests = 3
            numLateNests = 5
            totalNests = numEarlyNests + numLateNests
            earlyNests = null
            lateNests = null
            nesting = null
            numCollectedNests =
              Math.floor(numEarlyNests * ModelParameters.collectionProbability)
            numReleasedNests =
              Math.min(numCollectedNests, ModelParameters.releaseCount)
            numUncollectedNests =
              numEarlyNests - numCollectedNests

            Given "I construct #{numEarlyNests} early nests", ->
              earlyNests = (makeNest(Bird.EARLY) for [0...numEarlyNests])
            And "I construct #{numLateNests} late nests", ->
              lateNests = (makeNest(Bird.LATE) for [0...numLateNests])
            And "I set the nesting to be those nests", ->
              nesting = new Nesting([])
              nesting._activeNests = earlyNests.concat(lateNests)
            Then "Total number of nests should be #{totalNests}", ->
              nesting.activeNests().length.should.eql totalNests
            When "Eggs are collected", ->
              nesting.collectEggs()
            And "Birds abandon their nests", ->
              nesting.abandonNests()
            Then "I should have #{numUncollectedNests + numLateNests} \
                    active nests", ->
              nesting.activeNests().length.should.eql numLateNests
            And "I should have #{numCollectedNests} collected nests", ->
              nesting.collectedNests().length.should.eql numCollectedNests
            And "I should have #{numReleasedNests} released nests", ->
              nesting.releasedNests().length.should.eql numReleasedNests
            And "I should have #{numEarlyNests} abandoned nests", ->
              nesting.abandonedNests().length.should.eql numUncollectedNests

    Feature "Egg hatching",
      "In order to model egg hatching",
      "as a modeler",
      "I need to model the conversion of eggs into birds", ->

        Scenario "Correct number and type with only late nests", ->
          numLateNests = 37
          lateNests = null
          nesting = null
          numBirds =
            Math.floor(numLateNests * ModelParameters.eggConversionRate)
          newBirds = null

          Given "I construct #{numLateNests} late nests", ->
            lateNests = (makeNest(Bird.LATE) for [0...numLateNests])
          And "I set the nesting to be those nests", ->
            nesting = new Nesting([])
            nesting._activeNests = lateNests
          And "Eggs are collected", ->
            nesting.collectEggs()
          And "Birds abandon their nests", ->
            nesting.abandonNests()
          When "eggs hatch", ->
            newBirds = nesting.hatchEggs()
          Then "there should be about #{numBirds} new birds", ->
            newBirds.length.should.be.approximately(numBirds, 0.33*numBirds)
          And "all those birds should be wild reared", ->
            bird.howReared().should.eql Bird.WILD_REARED for bird in newBirds

        Scenario "Correct number and type with only early nests", ->
          numEarlyNests = 37
          earlyNests = null
          nesting = null
          numCollectedNests =
            numEarlyNests * ModelParameters.collectionProbability
          numBirds = Math.min(ModelParameters.releaseCount, numCollectedNests)
          newBirds = null

          Given "I construct #{numEarlyNests} early nests", ->
            earlyNests = (makeNest(Bird.EARLY) for [0...numEarlyNests])
          And "I set the nesting to be those nests", ->
            nesting = new Nesting([])
            nesting._activeNests = earlyNests
          And "Eggs are collected", ->
            nesting.collectEggs()
          And "Birds abandon their nests", ->
            nesting.abandonNests()
          When "eggs hatch", ->
            newBirds = nesting.hatchEggs()
          Then "there should be #{numBirds} new birds", ->
            newBirds.length.should.eql numBirds
          And "all those birds should be captive reared", ->
            bird.howReared().should.eql Bird.CAPTIVE_REARED for bird in newBirds

        Scenario "Correct number and type with mixed nests", ->
          numEarlyNests = 37
          numLateNests = 45
          earlyNests = null
          lateNests = null
          nesting = null
          numCollectedNests =
            numEarlyNests * ModelParameters.collectionProbability
          numEarlyBirds =
            Math.min(ModelParameters.releaseCount, numCollectedNests)
          numLateBirds =
            Math.floor(numLateNests * ModelParameters.eggConversionRate)
          numBirds = numEarlyBirds + numLateBirds
          newBirds = null
          numCaptiveReared = null

          Given "I construct #{numEarlyNests} early nests", ->
            earlyNests = (makeNest(Bird.EARLY) for [0...numEarlyNests])
          And "I construct #{numLateNests} late nests", ->
            lateNests = (makeNest(Bird.LATE) for [0...numLateNests])
          And "I set the nesting to be the combination of \
                  both of those nest sets", ->
            nesting = new Nesting([])
            nesting._activeNests = earlyNests.concat(lateNests)
          And "Eggs are collected", ->
            nesting.collectEggs()
          And "Birds abandon their nests", ->
            nesting.abandonNests()
          When "eggs hatch", ->
            newBirds = nesting.hatchEggs()
          Then "there should be about #{numBirds} new birds", ->
            newBirds.length.should.be.approximately(numBirds, 0.5 * numBirds)
          And "#{numEarlyBirds} of those birds should be captive reared", ->
            captiveReared = newBirds.filter((b) -> b.isCaptive())
            numCaptiveReared = captiveReared.length
            numCaptiveReared.should.eql numEarlyBirds
          And "the rest of those birds should be wild reared", ->
            wildReared = newBirds.filter((b) -> b.isWild())
            numWildReared = wildReared.length
            wildReared.length.should.eql (newBirds.length - numCaptiveReared)

    Feature "Full reproduction cycle",
      "In order to model the crane lifecycle",
      "as a modeler",
      "I need to be able to model a full year reproduction cycle", ->

        Scenario "Initial population is all late nesters", ->
          numInitialBirds = 200
          population = new Population(0)
          nesting = null
          newBirds = null
          numPairs = numInitialBirds // 2
          numNests = numPairs * ModelParameters.nestingProbability
          expectedNumBirds = numNests * ModelParameters.eggConversionRate

          Given "I construct a population of #{numInitialBirds} birds", ->
            Clock.reset()
            population.addBird(new Bird(Bird.LATE)) for [0...numInitialBirds]
          And "I set the clock ahead #{ModelParameters.pairingAge} years", ->
            Clock.setYear(ModelParameters.pairingAge)
          And "I create mating pairs", ->
            population.mateUnpairedBirds()
          And "I create a nesting environment", ->
            nesting = new Nesting(population.matingPairs())
          When "I run the reproduction cycle", ->
            newBirds = nesting.reproductionCycle()
          Then "I will usually have about #{expectedNumBirds} new birds", ->
            newBirds.length.should.be.approximately(expectedNumBirds,
              0.5 * expectedNumBirds)
          And "almost all of them will be late nesters", ->
            lateNesters = newBirds.filter((b) -> b.isLate())
            expectedLate = expectedNumBirds * (1 - ModelParameters.mutationRate)
            lateNesters.length.should.be.approximately(expectedLate,
              expectedLate * 0.5)

        Scenario false, "Large initial population is all early nesters", ->
          numInitialBirds = 100
          population = new Population(0)
          nesting = null
          newBirds = null
          numPairs = numInitialBirds // 2
          numNests = numPairs * ModelParameters.nestingProbability
          expectedNumBirds =
            Math.min(numNests * ModelParameters.collectionProbability,
                      ModelParameters.releaseCount)

          Given "I construct a population of #{numInitialBirds} birds", ->
            Clock.reset()
            population.addBird(new Bird(Bird.EARLY)) for [0...numInitialBirds]
          And "I set the clock ahead #{ModelParameters.pairingAge} years", ->
            Clock.setYear(ModelParameters.pairingAge)
          And "I create mating pairs", ->
            population.mateUnpairedBirds()
          And "I create a nesting environment", ->
            nesting = new Nesting(population.matingPairs())
          When "I run the reproduction cycle", ->
            newBirds = nesting.reproductionCycle()
          Then "I will usually have about #{expectedNumBirds} new birds", ->
            newBirds.length.should.be.approximately(expectedNumBirds,
              0.5 * expectedNumBirds)
          And "almost all of them will be early nesters", ->
            earlyNesters = newBirds.filter((b) -> b.isEarly())
            expectedEarly =
              expectedNumBirds * (1 - ModelParameters.mutationRate)
            earlyNesters.length.should.be.approximately(expectedEarly,
              expectedEarly * 0.5)

        Scenario false, "Small initial population is all early nesters", ->
          # Small enough that the expected number of birds is less than
          # ModelParameters.releaseCount
          numInitialBirds = 32
          population = new Population(0)
          nesting = null
          newBirds = null
          numPairs = numInitialBirds // 2
          numNests = numPairs * ModelParameters.nestingProbability
          expectedNumBirds =
            Math.min(numNests * ModelParameters.collectionProbability,
                      ModelParameters.releaseCount)

          Given "I construct a population of #{numInitialBirds} birds", ->
            Clock.reset()
            population.addBird(new Bird(Bird.EARLY)) for [0...numInitialBirds]
          And "I set the clock ahead #{ModelParameters.pairingAge} years", ->
            Clock.setYear(ModelParameters.pairingAge)
          And "I create mating pairs", ->
            population.mateUnpairedBirds()
          And "I create a nesting environment", ->
            nesting = new Nesting(population.matingPairs())
          When "I run the reproduction cycle", ->
            newBirds = nesting.reproductionCycle()
          Then "I will usually have about #{expectedNumBirds} new birds", ->
            newBirds.length.should.be.approximately(expectedNumBirds,
              0.5 * expectedNumBirds)
          And "almost all of them will be early nesters", ->
            earlyNesters = newBirds.filter((b) -> b.isEarly())
            expectedEarly =
              expectedNumBirds * (1 - ModelParameters.mutationRate)
            earlyNesters.length.should.be.approximately(expectedEarly,
              expectedEarly * 0.5)

        Scenario false, "Mixed initial population of early and late nesters", ->
          numEarlyNesters = 200
          numLateNesters = 200
          numInitialBirds = numEarlyNesters + numLateNesters
          numPairs = numInitialBirds // 2
          numNests = numPairs * ModelParameters.nestingProbability
          numNests.should.eql 100
          numAllEarlyNests = 0.25 * numNests
          numAllLateNests = 0.25 * numNests
          numMixedNests = 0.5 * numNests
          numAllEarlyNests.should.eql 25
          numAllLateNests.should.eql 25
          numMixedNests.should.eql 50
          # Assumes the early wins strategy
          numEarlyNests = numAllEarlyNests + numMixedNests
          numLateNests = numAllLateNests
          numReNests = numEarlyNests * ModelParameters.renestingProbability
          numEarlyNests.should.eql 75
          numLateNests.should.eql 25
          numReNests.should.eql 37.5
          numWildNests = numReNests + numLateNests
          numWildNests.should.eql 62.5
          expectedCaptiveBirds =
            Math.min(numNests * ModelParameters.collectionProbability,
                      ModelParameters.releaseCount)
          expectedCaptiveBirds.should.eql 6
          expectedWildBirds = numWildNests * ModelParameters.eggConversionRate
          expectedWildBirds.should.eql 31.25
          expectedNumBirds = expectedCaptiveBirds + expectedWildBirds
          expectedNumBirds.should.eql 37.25
          # The 2/3 comes from:
          #   1/3 of these nests come from early-early (EE) pairs and
          #   2/3 come from early-late (EL) pairs.
          # All of the EE pairs generate early-nesting offspring, and
          # 1/2 of the EL pairs generate early-nesting offspring, so we
          # get 1/3 + (2/3)*(1/2) = 1/3 + 1/3 = 2/3 of these birds will
          # be early nesters.
          expectedEarlyNesters =
            2/3 * (expectedCaptiveBirds +
                    numReNests * ModelParameters.eggConversionRate)
          expectedEarlyNesters.should.eql 16.5
          # The 1/3 comes from the math above.
          expectedLateNesters =
            numLateNests * ModelParameters.eggConversionRate +
            (1/3) * (expectedCaptiveBirds +
                            numReNests * ModelParameters.eggConversionRate)
          expectedLateNesters.should.eql 20.75
          expectedNumBirds.should.eql (expectedEarlyNesters+expectedLateNesters)

          population = new Population(0)
          nesting = null
          newBirds = null

          Given "I construct a population of #{numEarlyNesters} \
                  early birds and #{numLateNesters} late birds", ->
            Clock.reset()
            population.addBird(new Bird(Bird.EARLY)) for [0...numEarlyNesters]
            population.addBird(new Bird(Bird.LATE)) for [0...numLateNesters]
          And "I set the clock ahead #{ModelParameters.pairingAge} years", ->
            Clock.setYear(ModelParameters.pairingAge)
          And "I create mating pairs", ->
            population.mateUnpairedBirds()
          And "I create a nesting environment", ->
            nesting = new Nesting(population.matingPairs())
          When "I run the reproduction cycle", ->
            newBirds = nesting.reproductionCycle()
          Then "I will usually have about #{expectedNumBirds} new birds", ->
            newBirds.length.should.be.approximately(expectedNumBirds,
              0.33 * expectedNumBirds)
          And "approximately #{expectedEarlyNesters} should be \
                  early nesters", ->
            earlyNesters = newBirds.filter((b) -> b.isEarly())
            earlyNesters.length.should.be.approximately(expectedEarlyNesters,
              expectedEarlyNesters)
          And "approximately #{expectedLateNesters} should be late nesters", ->
            lateNesters = newBirds.filter((b) -> b.isLate())
            lateNesters.length.should.be.approximately(expectedLateNesters,
              expectedLateNesters * 0.5)
          And "the original birds are all
                #{ModelParameters.pairingAge} years old", ->
            population.birds().every(
              (b) -> b.age().should.eql ModelParameters.pairingAge)
          And "the new birds are all 0 years old", ->
            newBirds.every((b) -> b.age().should.eql 0)
