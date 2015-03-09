class RickshawStripChart
  tickLength: 1000
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
    @chart = new Rickshaw.Graph( {
      element: document.getElementById('chart')
      width: 960
      height: 500
      renderer: 'line'
      series: [
          {
            color: 'steelblue',
            data: [ { x: 0, y: 23}, { x: 1, y: 15 }, { x: 2, y: 79 } ]
          }, {
            color: 'lightblue',
            data: [ { x: 0, y: 30}, { x: 1, y: 20 }, { x: 2, y: 64 } ]
          }
        ]
      #series: []
    })
  
  drawChart: ->
    @chart.render()
   
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
    # @extendData()
    # console.log(JSON.stringify(@values))
    @drawChart()
    @runNumber = @runNumber + 1
    # setTimeout(@tick, @tickLength)

window.RickshawStripChart = RickshawStripChart