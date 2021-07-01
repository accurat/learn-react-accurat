import { useState, useEffect } from 'react'
import * as d3 from 'd3'
import { uniq, zipObject } from 'lodash'

const URL = 'https://raw.githubusercontent.com/vega/vega-datasets/master/data/penguins.json'

export function Scatterplot() {
  const [isLoading, setIsLoading] = useState(false)
  const [dataset, setDataset] = useState([])

  useEffect(() => {
    if (dataset.length === 0) return

    console.table(dataset.slice(0, 10))
    console.log(d3.extent(dataset.map((d) => d['Beak Length (mm)'])))
  }, [dataset])

  useEffect(() => {
    setIsLoading(true)
    fetch(URL)
      .then((response) => response.json())
      .then((json) => {
        setDataset(json)
      })
      .catch(() => {
        window.alert('Errore!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const margins = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  }

  const xScale = d3
    .scaleLinear()
    .range([0 + margins.left, 500 - margins.right])
    .domain(d3.extent(dataset.map((d) => d['Beak Length (mm)'])))

  const yScale = d3
    .scaleLinear()
    .range([500 - margins.bottom, 0 + margins.top])
    .domain(d3.extent(dataset.map((d) => d['Flipper Length (mm)'])))

  const species = uniq(dataset.map((d) => d['Species']))
  const colors = ['tomato', 'steelblue', 'green']
  const speciesColorsTranslation = zipObject(species, colors)

  const colorScale = (specie) => {
    return speciesColorsTranslation[specie]
  }

  return (
    <div>
      {isLoading ? (
        <div>L O A D I N G . . .</div>
      ) : (
        <svg width={500} height={500}>
          <rect fill="aliceblue" width={500} height={500} />

          {dataset
            .filter((d) => d['Beak Length (mm)'] !== null && d['Flipper Length (mm)'] !== null)
            .map((datum, i) => (
              <g key={i}>
                <circle
                  r={5}
                  cx={xScale(datum['Beak Length (mm)'])}
                  cy={yScale(datum['Flipper Length (mm)'])}
                  fill={colorScale(datum['Species'])}
                />
              </g>
            ))}
        </svg>
      )}
    </div>
  )
}
