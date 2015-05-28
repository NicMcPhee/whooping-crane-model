'use strict'

require 'mocha-cakes'

Clock = require '../lib/clock'
Bird = require '../lib/bird'
Population = require '../lib/population'
Nest = require '../lib/nest'

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

Feature "Nests",
  "In order to model crane populations",
  "as a modeler",
  "I need to model nests", ->

    Feature "Nests have a pair of birds",
      "In order to be able to model nesting",
      "as a modeler",
      "every nest needs to have one pair of birds that 'built' it", ->

        Scenario "New nest", ->

          firstBird = null
          secondBird = null
          nest = null

          Given "I construct two birds", ->
            firstBird = new Bird()
            secondBird = new Bird()
          When "I construct a nest with that pair", ->
            nest = new Nest([firstBird, secondBird])
          Then "the nest should be built by those birds", ->
            builders = nest.builders()
            builders.length.should.eql 2
            builders.should.include firstBird
            builders.should.include secondBird


    Feature "Can build nests from list of breeding pairs",
      "In order to be able to model nesting",
      "as a modeler",
      "I want to be able to construct nests from breeding pairs", ->

        Scenario "New nests from breeding pairs", ->

          population = null
          numBirds = 100
          nests = null
          expectedNests = null

          Given "I construct a population of #{numBirds} birds", ->
            population = new Population(100)
          And "I set the clock ahead #{Bird.pairingAge} years", ->
            Clock.setYear(Bird.pairingAge)
          And "I create breeding pairs", ->
            population.mateUnpairedBirds()
          When "I construct nests from the breeding pairs", ->
            matingPairs = population.matingPairs()
            nests = Nest.constructNests(matingPairs)
            expectedNests = Bird.nestingProbability * matingPairs.length
          Then "I should have about #{expectedNests} nests", ->
            nests.length.should.be.above(0.75 * expectedNests)
            nests.length.should.be.below(1.25 * expectedNests)
