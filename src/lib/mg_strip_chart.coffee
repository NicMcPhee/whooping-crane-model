class MGStripChart
  tickLength: 2000
  values: null
  year: 2015
  numCranes: 400
  numYears: 100
  runNumber: 0
  
  constructor: ->
    @values = []
    @tick()
    
  drawChart: ->
    MG.data_graphic({
      # title: "Cranes"
      chart_type: "line"
      area: false
      description: "This graphic shows a time-series of cranes."
      data: @values
      min_x: @year
      max_x: @year + @numYears
      baselines: [{value: 0, label: 'Extinction'}]
      width: 600
      height: 250
      target: '#chart'
      x_accessor: 'Year'
      y_accessor: 'Number of cranes'
    })
   
  extendData: ->
    years = [@year...(@year+@numYears)]
    offsets = years.map (x) -> Math.round(20*(Math.random()-0.65))
    start = @numCranes
    newVals = offsets.reduce ((l, r) -> l.concat([l[l.length-1]+r])), [start]
    #console.log(JSON.stringify(newVals))
    newData = newVals.map (v, i) => { 'Year': @year+i, 'Number of cranes': v }
    #console.log(JSON.stringify(newData))
    @values.push(newData)
  
  tick: =>
    @extendData()
    console.log(JSON.stringify(@values))
    @drawChart()
    @runNumber = @runNumber + 1
    setTimeout(@tick, @tickLength)

window.MGStripChart = MGStripChart
