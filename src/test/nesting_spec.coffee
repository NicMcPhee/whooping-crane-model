'use strict'

require 'mocha-cakes'

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
          And "I set the clock ahead #{Bird.pairingAge} years", ->
            Clock.setYear(Bird.pairingAge)
          And "I create breeding pairs", ->
            population.mateUnpairedBirds()
          When "I construct nests from the breeding pairs", ->
            matingPairs = population.matingPairs()
            nesting = new Nesting(matingPairs)
            expectedNests = Bird.nestingProbability * matingPairs.length
          Then "I will usually have about #{expectedNests} nests", ->
            nesting.activeNests().length.should.be.above(0.75 * expectedNests)
            nesting.activeNests().length.should.be.below(1.25 * expectedNests)

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
          numCollectedNests = Math.floor(numEarlyNests * Bird.collectionProbability)
          numReleasedNests = Math.min(numCollectedNests, Bird.releaseCount)
          numUncollectedNests = numEarlyNests - numCollectedNests

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
          Then "I should have #{numUncollectedNests + numLateNests} active nests", ->
            nesting.activeNests().length.should.eql numUncollectedNests + numLateNests
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
            numCollectedNests = Math.floor(numEarlyNests * Bird.collectionProbability)
            numReleasedNests = Math.min(numCollectedNests, Bird.releaseCount)
            numUncollectedNests = numEarlyNests - numCollectedNests

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
            Then "I should have #{numUncollectedNests + numLateNests} active nests", ->
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
            numCollectedNests = Math.floor(numEarlyNests * Bird.collectionProbability)
            numReleasedNests = Math.min(numCollectedNests, Bird.releaseCount)
            numUncollectedNests = numEarlyNests - numCollectedNests

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
            Then "I should have #{numUncollectedNests + numLateNests} active nests", ->
              nesting.activeNests().length.should.eql numLateNests
            And "I should have #{numCollectedNests} collected nests", ->
              nesting.collectedNests().length.should.eql numCollectedNests
            And "I should have #{numReleasedNests} released nests", ->
              nesting.releasedNests().length.should.eql numReleasedNests
            And "I should have #{numEarlyNests} abandoned nests", ->
              nesting.abandonedNests().length.should.eql numUncollectedNests

###
    Feature "Egg hatching",
      "In order to model egg hatching",
      "as a modeler",
      "I need to model  of eggs to birds", ->

        Scenario "Correct number and type for all late nests", ->
          Given "I construct #{numLateNests} late nests", ->
            lateNests = (makeNest(Bird.LATE) for [0...numLateNests])
          And "I set the nesting to be those nests", ->
            nesting = new Nesting([])
            nesting._activeNests = lateNests
          And "Eggs are collected", ->
            nesting.collectEggs()
          And "Birds abandon their nests", ->
            nesting.abandonNests()
          When "we convert eggs", ->
            nesting.convertEggs()
          Then ""

###
