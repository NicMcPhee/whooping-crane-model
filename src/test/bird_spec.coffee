'use strict'

require 'mocha-cakes'

Clock = require '../lib/clock'
Bird = require '../lib/bird'

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

Feature "Birds",
  "In order to model crane populations",
  "as a modeler",
  "I need to model individual birds", ->

    before -> Clock.reset()

    Feature "Bird UUIDs",
      "In order to be able to track birds",
      "as a modeler",
      "I want every bird to have a unique ID", ->

        Scenario "New birds", ->

          firstBird = null
          secondBird = null

          Given "I construct two birds", ->
            firstBird = new Bird()
            secondBird = new Bird()
          Then "their UUIDs should be different", ->
            firstBird.uuid.should.not.eql secondBird.uuid

    Feature "Bird birth years",
      "In order to be able to track birds",
      "as a modeler",
      "I want to know what 'year' a bird was 'born'", ->

        Scenario "New bird", ->

          bird = null
          birthYear = 2015

          Given "I set the clock to #{birthYear}", ->
            Clock.currentYear = birthYear
          Given "I construct a bird", ->
            bird = new Bird()
          Then "it's birth year should be #{birthYear}", ->
            bird.birthYear.should.eql birthYear

    Feature "Bird ages",
      "In order to be able to manage birds",
      "as a modeler",
      "I need to know how 'old' a bird is", ->

        Scenario "Bird at year zero", ->
          bird = null
          Given "I construct a bird with no birth year", ->
            bird = new Bird()
          Then "it's age should be zero", ->
            bird.age().should.eql 0

        Scenario "New bird at later year", ->
          bird = null
          testYear = 314
          Given "I set the clock to #{testYear}", ->
            Clock.setYear(testYear)
          Given "I construct a bird born in year #{testYear}", ->
            bird = new Bird(testYear)
          Then "it's age should be zero", ->
            bird.age().should.eql 0

        Scenario "Year zero bird a few years later", ->
          bird = null
          numYears = 17
          Given "I construct a bird with no birth year", ->
            bird = new Bird()
          When "I increment the clock #{numYears} times", ->
            Clock.incrementYear() for [0...numYears]
          Then "the bird's age should be #{numYears}", ->
            bird.age().should.eql numYears

    Feature "Birds of mating age",
      "In order to simulate mating",
      "as a modeler",
      "I need to know if a bird is old enough to mate", ->

        Scenario "Newborn bird at year zero", ->
          bird = null
          Given "I construct a bird with no birth year", ->
            bird = new Bird()
          Then "it shouldn't be old enough to mate", ->
            bird.canMate().should.be.false

        Scenario "Newborn bird at later year", ->
          bird = null
          testYear = 314
          Given "I set the clock to #{testYear}", ->
            Clock.setYear(testYear)
          And "I construct a bird born in year #{testYear}", ->
            bird = new Bird(testYear)
          Then "the bird shouldn't be old enough to mate", ->
            bird.canMate().should.be.false

        Scenario "Year zero bird one year past mating age", ->
          bird = null
          Given "I construct a bird with no birth year", ->
            bird = new Bird()
          When "I increment the clock 'pairingAge'+1 years", ->
            Clock.incrementYear() for [0...Bird.pairingAge+1]
          Then "the bird should be able to mate", ->
            bird.canMate().should.be.true

        Scenario "Year zero bird just old enough", ->
          bird = null
          Given "I construct a bird with no birth year", ->
            bird = new Bird()
          When "I increment the clock 'pairingAge' years", ->
            Clock.incrementYear() for [0...Bird.pairingAge]
          Then "the bird should be able to mate", ->
            bird.canMate().should.be.true

        Scenario "Year zero bird one year before mating age", ->
          bird = null
          Given "I construct a bird with no birth year", ->
            bird = new Bird()
          When "I increment the clock 'pairingAge'-1 years", ->
            Clock.incrementYear() for [0...Bird.pairingAge-1]
          Then "the bird should be able to mate", ->
            bird.canMate().should.be.false
