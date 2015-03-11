class RickshawStripChart
  tickLength: 10
  values: null
  year: 2015
  numCranes: 400
  numYears: 100
  runNumber: 0
  chart: null
  hoverDetail: null
  
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
#    @chart.render()
#    label = d3.select("svg.y_axis")
#                .attr("width", "5em") # make svg wide enough for label
#                .append("svg:text")
#                .attr("class", "y label")
#                .style("text-anchor", "end")
#                .attr("x", -150)
#               .attr("y", 6)
#                .attr("dy", ".75em")
#                .attr("transform", "rotate(-90)")
#                .text("Label text")
#    label = d3.select("svg.y_axis")
#      .attr("width", "5em")
#      .append("svg:text")
#      .attr("class", "y label")
#      .style("text-anchor", "end")
#      .attr("x", -150)
#      .attr("y", 6)
#      .attr("dy", ".75em")
#      .attr("transform", "rotate(-90)")
#      .text("lsdkjfslkdjf")
  
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
