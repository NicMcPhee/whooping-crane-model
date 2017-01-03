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
