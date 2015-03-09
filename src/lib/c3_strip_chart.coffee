class C3StripChart
  tickLength: 0
  values: null
  chart: null
  year: 2015
  numCranes: 400
  runNumber: 0
  
  constructor: ->
    @createChart()
    # @seed()
    @tick()
    
  createChart: ->
    @chart = c3.generate {
      bindto: '#chart'
      data:
        x : 'Year'
        xFormat : "%Y-%m"
        columns: [
          ['Year'].concat([2015...2015+100].map (y) -> "#{y}-01")
#          ["Number of cranes (run #{@runNumber})"]
#          ['Year', "#{@year}-01"]
#          ["Number of cranes (run #{@runNumber})", @numCranes]
#          ['Year', "#{@year-1}-01", "#{@year}-01"]
#          ['Number of cranes', Math.random(), Math.random()]
#          ['Year', '2014', '2015']
#          ['Number of cranes', Math.random(), Math.random()]
        ]
      axis:
        x:
          type: 'timeseries'
          tick:
            format: '%Y'
    }

  seed: ->
    @values = [Math.random()]
    
  extendData: ->
    years = [@year...(@year+100)]
    offsets = years.map (x) -> Math.round(20*(Math.random()-0.65))
    start = 400
    newVals = offsets.reduce ((l, r) -> l.concat([l[l.length-1]+r])), [start]
#    @year = @year + 1
#    if @year > 2115
#      @year = 2015
#      @runNumber = @runNumber + 1
#      @numCranes = 400
#    else
#      offset = 10*(Math.random()-0.6)
#      @numCranes = @numCranes + offset
    @chart.flow {
      columns: [
        ['Year'].concat(years.map (y) -> "#{y}-01")
        ["Number of cranes (run #{@runNumber})"].concat(newVals)
#        ['Year', "#{@year}-01"]
#        ["Number of cranes (run #{@runNumber})", @numCranes]
      ]
      length: 0
    }
    @runNumber = @runNumber + 1
  
  tick: =>
    @extendData()
    setTimeout @tick, @tickLength

window.C3StripChart = C3StripChart
