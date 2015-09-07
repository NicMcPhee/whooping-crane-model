###
Code to export CSV data purely from the client (no need for a server).
Export logic taken from http://stackoverflow.com/a/24922761 – thanks!
###

'use strict'

exportToCsv = (filename, runs) ->

  runToRows = (run) ->
    entries = run.data
    entries.map (entry) ->
      [
        entry.runNumber
        entry.x
        entry.populationSize
        entry.proportionLateNesters
        entry.proportionWildBorn
      ]

  runsToRows = (runs) ->
    header = [
      "Run"
      "Year"
      "Population.size"
      "Proportion.late.nesters"
      "Proportion.wild.born"
    ]
    runs.reduce ((result, run) ->
      result.concat(runToRows(run))
    ), [header]

  processRow = (row) ->
    finalVal = ''
    j = 0
    while j < row.length
      innerValue = if row[j] == null then '' else row[j].toString()
      if row[j] instanceof Date
        innerValue = row[j].toLocaleString()
      result = innerValue.replace(/"/g, '""')
      if result.search(/("|,|\n)/g) >= 0
        result = '"' + result + '"'
      if j > 0
        finalVal += ','
      finalVal += result
      j++
    finalVal + '\n'

  rows = runsToRows(runs)
  csvFile = ''
  i = 0
  while i < rows.length
    csvFile += processRow(rows[i])
    i++
  blob = new Blob([ csvFile ], type: 'text/csv;charset=utf-8;')
  if navigator.msSaveBlob
    # IE 10+
    navigator.msSaveBlob blob, filename
  else
    link = document.createElement('a')
    if link.download != undefined
      # feature detection
      # Browsers that support HTML5 download attribute
      link.setAttribute 'download', filename
    else
      link.setAttribute "target", "_blank"
    link.setAttribute "style", "visibility:hidden"
    url = URL.createObjectURL(blob)
    link.setAttribute 'href', url
    document.body.appendChild link
    link.click()
    document.body.removeChild link
  return

module.exports = exportToCsv
