'use strict'

require 'mocha-cakes'

ModelParameters = require '../lib/model_parameters'
Clock = require '../lib/clock'

Feature "Model parameters",
  "In order to model crane populations",
  "as a modeler",
  "I need to be able to control model parameters", ->

    before -> Clock.reset()

    Feature "Default parameters",
      "In order to model populations",
      "as a modeler",
      "I want parameters to have default values", ->

        Scenario "Initial setup", ->

          Then "the pairing age shouldn't be NaN", ->
            isNaN(ModelParameters.pairingAge).should.eql false
          And "the pairing age should be 4", ->
            ModelParameters.pairingAge.should.eql 4
          And "the collection probability shouldn't be NaN", ->
            isNaN(ModelParameters.collectionProbability()).should.eql false
          And "the pairing age should be 0.5", ->
            ModelParameters.collectionProbability().should.eql 0.5

    Feature "Collection probability should change with time",
      "In order to model dynamic management",
      "as a modeler",
      "I want collection probabilities to change over time", ->

        Scenario "Time advances", ->

          Given "we have the initial setup and reset the clock", ->
            Clock.reset()
          Then "the collection probability should be 0.5", ->
            ModelParameters.collectionProbability().should.eql 0.5
          When "we advance the clock 50 years", ->
            Clock.setYear(50)
          Then "the collection probability should be 0.25", ->
            ModelParameters.collectionProbability().should.eql 0.25
          When "we advance the clock 100 years", ->
            Clock.setYear(100)
          Then "the collection probability should be 0", ->
            ModelParameters.collectionProbability().should.eql 0
