class RickshawStripChart
  tickLength: 100
  values: null
  year: 2015
  numCranes: 400
  numYears: 100
  runNumber: 0
  chart: null
  hoverDetail: null
  offset_param: 0.5
  
  constructor: ->
    @values = []
    @buildChart()
    @tick()
  
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
    @readField()
   
  readField: ->
    @offset_param = Number($( "#input_box" ).val())

  extendData: ->
    years = [@year...(@year+@numYears)]
    offsets = years.map (x) => Math.round(20*(Math.random() - @offset_param))
    start = @numCranes
    newVals = offsets.reduce ((l, r) -> l.concat([Math.max(0, l[l.length-1]+r)])), [start]
    firstZero = newVals.indexOf(0)
    if firstZero > -1
      newVals = newVals[..firstZero]
    newData = newVals.map (v, i) => { x: @year+i, y: v }
    @values.push({
      name: "Run ##{@runNumber}"
      color: "rgba(0, 0, 0, 0.1)"
      data: newData})

  tick: =>
    @extendData()
    @drawChart()
    @runNumber = @runNumber + 1
    console.log("Run number #{@runNumber}")
    setTimeout(@tick, @tickLength) if @runNumber < 50

window.RickshawStripChart = RickshawStripChart
