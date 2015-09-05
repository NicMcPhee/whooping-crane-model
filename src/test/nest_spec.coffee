'use strict'

require 'mocha-cakes'

ModelParameters = require '../lib/model_parameters'
Bird = require '../lib/bird'
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
      "In order to model nesting",
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

    Feature "Nests have a nesting time",
      "In order to model nesting",
      "as a modeler",
      "every nest needs to have a early/late nesting time", ->

        Scenario "Early nester wins", ->

          Scenario "Both parents are early nesters", ->

            firstBird = null
            secondBird = null
            nest = null

            Given "I construct two early nesters", ->
              firstBird = new Bird(Bird.EARLY)
              secondBird = new Bird(Bird.EARLY)
            When "they construct a nest", ->
              nest = new Nest([firstBird, secondBird])
            Then "the nest will be EARLY", ->
              nest.nestingTime().should.eql Bird.EARLY

          Scenario "Both parents are late nesters", ->

            firstBird = null
            secondBird = null
            nest = null

            Given "I construct two early nesters", ->
              firstBird = new Bird(Bird.LATE)
              secondBird = new Bird(Bird.LATE)
            When "they construct a nest", ->
              nest = new Nest([firstBird, secondBird])
            Then "the nest will be LATE", ->
              nest.nestingTime().should.eql Bird.LATE

          Scenario "Parents have different preferences", ->

            firstBird = null
            secondBird = null
            nest = null

            Given "I construct two preferences with different preferences", ->
              firstBird = new Bird(Bird.EARLY)
              secondBird = new Bird(Bird.LATE)
            When "they construct a nest", ->
              nest = new Nest([firstBird, secondBird])
            Then "the nest will be EARLY", ->
              nest.nestingTime().should.eql Bird.EARLY
