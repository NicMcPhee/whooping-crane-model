'use strict'

ModelParameters = require './model_parameters'
Simulator = require './simulator'
Population = require './population'

class RickshawStripChart
  values: null
  year: new Date().getFullYear()
  runNumber: 0

  tickLength: 1
  isRunning: false
  hasStarted: false
  notDone: true

  # initialNumCranes: null
  # carryingCapacity: 1000
  # percentageEggsToTake: null
  # captiveEggSurvival: null
  # wildEggSurvival: null
  # overallMortalityRate: null
  # clutchSize: 2

  constructor: ->
    @values = []
    @buildChart()
    $("#start_button").click =>
      @toggle_running()

  toggle_running: ->
    @isRunning = not @isRunning
    if not @hasStarted
      @start()
    if @isRunning and @notDone
      $("#start_button").text("Stop")
      @tick()
    else
      $("#start_button").text("Start")

  start: ->
    @numRuns = Number($("#num_runs").val())
    @numYears = Number($("#num_years").val())
    @initialNumCranes = Number($("#num_cranes").val())
    @proportionEarlyNesters = Number($("#prop_early_nesters").val())
    ModelParameters.carryingCapacity = Number($("#carrying_capacity").val())
    pairingAge = Number($("#pairing_age").val())
    ModelParameters.pairingAge = pairingAge
    nestingProbability = Number($("#nesting_probability").val())
    ModelParameters.nestingProbability = nestingProbability
    collectionProbability = Number($("#collection_probability").val())
    ModelParameters.collectionProbability = collectionProbability
    releaseCount = Number($("#release_count").val())
    ModelParameters.releaseCount = releaseCount
    eggConversionRate = Number($("#egg_conversion_rate").val())
    ModelParameters.eggConversionRate = eggConversionRate
    mutationRate = Number($("#mutation_rate").val())
    ModelParameters.mutationRate = mutationRate
    firstYearMortalityRate = Number($("#first_year_mortality_rate").val())
    ModelParameters.firstYearMortalityRate = firstYearMortalityRate
    matureMortalityRate = Number($("#mature_mortality_rate").val())
    ModelParameters.matureMortalityRate = matureMortalityRate
    @values.length = 0
    @runNumber = 0
    @hasStarted = true
    @notDone = true

  buildChart: ->
    @chart = new Rickshaw.Graph({
      element: document.getElementById('chart')
      width: 800
      height: 300
      renderer: 'line'
      series: @values
      min: 'auto'
    })
    xAxis = new Rickshaw.Graph.Axis.X({
      graph: @chart
    })
    yAxis = new Rickshaw.Graph.Axis.Y({
      graph: @chart
    })
    hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: @chart
      xFormatter: (year) -> "Year #{year}"
      yFormatter: (numCranes) -> "#{Math.round(numCranes)} cranes"
    })

  drawChart: ->
    @chart.render()

  extendData: ->
    years = [@year...(@year+@numYears)]
    population = new Population(@initialNumCranes, @proportionEarlyNesters)
    simulator = new Simulator(population)
    entries = []
    for year in years
      popSize = simulator.getPopulation().birds().length
      entry = { x: year, y: popSize }
      entries.push(entry)
      if popSize <= 0
        break
      simulator.advanceOneYear()
    @values.push({
      name: "Run ##{@runNumber}"
      color: "rgba(0, 0, 0, 0.1)"
      data: entries
      })

  finalPopSizes: ->
    runs = (v.data for v in @values)
    finalSizes = (r.pop().y for r in runs)
    return finalSizes

  mean: (values) ->
    return 0 if values.length is 0
    sum = values.reduce (s,i) -> s + i
    sum / values.length

  variance: (values) ->
    avg = @mean(values)
    squares = (v*v for v in values)
    avgSquares = @mean(squares)
    return avgSquares - avg*avg

  # Assumes we're always going to do a 95% confidence interval.
  # We'd need to have z-score lookup if we want other intervals.
  marginOfError: (stdev, sampleSize) ->
    # Assumes a 95% confidence interval
    zScore = 1.96
    return zScore * stdev / Math.sqrt(sampleSize)

  displayFinalStats: ->
    sizes = @finalPopSizes()
    mn = @mean(sizes)
    vr = @variance(sizes)
    stdev = Math.sqrt(vr)
    margin = @marginOfError(stdev, sizes.length)
    statsString =
      "<hr><p>
       <strong>Mean population size:</strong> #{mn.toFixed(1)}, with
       <strong>stdev:</strong> #{stdev.toFixed(2)}
       <br>
       <strong>95% confidence interval</strong> for the population size
       [#{(mn-margin).toFixed(1)}, #{(mn+margin).toFixed(1)}]
       </p><hr>"
    document.getElementById('final_stats').innerHTML = statsString

  tick: =>
    @extendData()
    @drawChart()
    @runNumber = @runNumber + 1
    @notDone = @runNumber < @numRuns
    if not @notDone
      @isRunning = false
      @hasStarted = false
      $("#start_button").text("Restart")
      @displayFinalStats()
    console.log("Run number #{@runNumber}, len vals = #{@values.length}")
    setTimeout(@tick, @tickLength) if @isRunning and @notDone

window.RickshawStripChart = RickshawStripChart
