###

The global clock for the simulation that knows what
year it is in the simulation.

https://github.com/NicMcPhee/whooping-crane-model

Copyright (c) 2015 Nic McPhee
Licensed under the MIT license.

###

'use strict'

class Clock
  @currentYear: 0

  @reset: ->
    @currentYear = 0

  @incrementYear: ->
    @currentYear = @currentYear + 1

  @setYear: (year) ->
    @currentYear = year

module.exports = Clock
