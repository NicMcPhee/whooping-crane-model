class RickshawStripChart
  tickLength: 10
  values: null
  year: 2015
  numCranes: 400
  numYears: 100
  runNumber: 0
  chart: null
  
  constructor: ->
    @values = []
    @buildChart()
    @tick()
  
  buildChart: ->
    @chart = new Rickshaw.Graph({
      element: document.getElementById('chart')
      width: 960
      height: 500
      renderer: 'line'
      series: @values
      min: 'auto'
    })
  
  drawChart: ->
    @chart.render()
   
  extendData: ->
    years = [@year...(@year+@numYears)]
    offsets = years.map (x) -> Math.round(20*(Math.random()-0.65))
    start = @numCranes
    newVals = offsets.reduce ((l, r) -> l.concat([Math.max(0, l[l.length-1]+r)])), [start]
    firstZero = newVals.indexOf(0)
    if firstZero > -1
      newVals = newVals[..firstZero]
    newData = newVals.map (v, i) => { x: @year+i, y: v }
    @values.push({color: "rgba(0, 0, 0, 0.1)", data: newData})

  tick: =>
    @extendData()
    @drawChart()
    @runNumber = @runNumber + 1
    console.log("Run number #{@runNumber}")
    setTimeout(@tick, @tickLength) if @runNumber < 250

window.RickshawStripChart = RickshawStripChart
