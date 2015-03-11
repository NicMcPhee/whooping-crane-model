class RickshawStripChart
  tickLength: 10
  values: null
  year: 2015
  initialNumCranes: null
  numCranes: null
  percentageEggsToTake: null
  captiveEggSurvival: null
  wildEggSurvival: null
  overallMortalityRate: null
  numYears: 100
  runNumber: 0
  chart: null
  hoverDetail: null
  offset_param: null
  isRunning: false
  hasStarted: false
  notDone: true
  
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
    @initialNumCranes = Number($("#num_cranes").val())
    @percentageEggsToTake = Number($("#percentage_eggs_to_take").val())
    @captiveEggSurvival = Number($('#captive_egg_survival').val())
    @wildEggSurvival = Number($('#wild_egg_survival').val())
    @overallMortalityRate = Number($('#overall_mortality_rate').val())
    hasStarted = true
  
  buildChart: ->
    @chart = new Rickshaw.Graph({
      element: document.getElementById('chart')
      width: 800
      height: 300
      renderer: 'line'
      series: @values
      min: -50 # 'auto'
    })
    @hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: @chart
      xFormatter: (year) -> "Year #{year}"
      yFormatter: (numCranes) -> "#{Math.round(numCranes)} cranes"
    })
    x_axis = new Rickshaw.Graph.Axis.X({
      graph: @chart
    })
    y_axis = new Rickshaw.Graph.Axis.Y({
      graph: @chart
    })
  
  drawChart: ->
    @chart.render()
   
  readField: ->
    @offset_param = Number($( "#input_box" ).val())

  updatePopulation: (year) ->
    @numCranes = @numCranes + 20*(Math.random() - @offset_param)
    if @numCranes <= 0
      @numCranes = 0
    return(@numCranes)

  extendData: ->
    years = [@year...(@year+@numYears)]
    @numCranes = @initialNumCranes
    counts = years.map ((yr) => @updatePopulation(yr))
    firstZero = counts.indexOf(0)
    if firstZero > -1
      counts = counts[..firstZero]
    newData = counts.map (v, i) => { x: @year+i, y: v }
    @values.push({
      name: "Run ##{@runNumber}"
      color: "rgba(0, 0, 0, 0.1)"
      data: newData})

  tick: =>
    @readField()
    @extendData()
    @drawChart()
    @runNumber = @runNumber + 1
    @notDone = @runNumber < 100
    console.log("Run number #{@runNumber}")
    setTimeout(@tick, @tickLength) if @isRunning and @notDone

window.RickshawStripChart = RickshawStripChart
