'use strict'

require 'mocha-cakes'

ModelParameters = require '../lib/model_parameters'
Bird = require '../lib/bird'
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

Feature "model no release of captive raised birds",
"In order to model crane populations",
"as a modeler",
"the model should handle the case where we
  never release any captive raised birds", ->

  Scenario "Standard early egg collection rate with no release", ->
    # I really should use mocking to hack the parameters.
    originalReleaseCount = ModelParameters.releaseCount
    pairingAge = ModelParameters.pairingAge
    population = new Population(1000)
    simulator = new Simulator(population)

    Given "I set the release count to 0
          (so no captive raised birds released)", ->
      ModelParameters.releaseCount = 0
    When "I run a population for #{2*pairingAge} years", ->
      simulator.advanceOneYear() for [0...2*pairingAge]
      ModelParameters.releaseCount = originalReleaseCount
    Then "all birds whose age is < #{pairingAge} should be wild raised", ->
      birds = simulator.getPopulation().birds()
      youngBirds = birds.filter((b) -> b.age() < pairingAge)
      youngBirds.every((b) -> b.howReared().should.eql Bird.WILD_REARED)

  Scenario "Early egg collection rate of 1 with no release", ->
    # I really should use mocking to hack the parameters.
    originalCollectionProbability = ModelParameters.collectionProbability
    originalReleaseCount = ModelParameters.releaseCount
    pairingAge = ModelParameters.pairingAge
    population = new Population(1000)
    simulator = new Simulator(population)

    Given "I set the collection probability to 1
          (so all early nests collected)", ->
      ModelParameters.collectionProbability = 1
    And "I set the release count to 0 (so no captive raised birds released)", ->
      ModelParameters.releaseCount = 0
    When "I run a population for #{2*pairingAge} years", ->
      simulator.advanceOneYear() for [0...2*pairingAge]
      ModelParameters.collectionProbability = originalCollectionProbability
      ModelParameters.releaseCount = originalReleaseCount
    Then "all birds whose age is < #{pairingAge} should be wild raised", ->
      birds = simulator.getPopulation().birds()
      youngBirds = birds.filter((b) -> b.age() < pairingAge)
      youngBirds.every((b) -> b.howReared().should.eql Bird.WILD_REARED)
