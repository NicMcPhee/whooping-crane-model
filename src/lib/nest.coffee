###

Basic model of an nest.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

Bird = require '../lib/bird'

class Nest

  constructor: (@_builders) ->

  builders: -> @_builders

module.exports = Nest
