import { useState, useEffect } from 'react'
import * as d3 from 'd3'

const URL = 'https://raw.githubusercontent.com/vega/vega-datasets/master/data/penguins.json'

export function Scatterplot() {
  const [isLoading, setIsLoading] = useState(false)
  const [dataset, setDataset] = useState([])

  useEffect(() => {
    if (dataset.length === 0) return

    console.table(dataset)
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
    top: 20,
    left: 30,
    right: 20,
    bottom: 20,
  }

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset.map((d) => d['Beak Length (mm)'])))
    .range([0 + margins.left, 500 - margins.right])
    .nice(5)

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset.map((d) => d['Flipper Length (mm)'])))
    .range([500 - margins.bottom, 0 + margins.top])
    .nice(5)

  const colorScale = d3.scaleOrdinal().range(['tomato', 'steelblue', 'green'])

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

          {xScale.ticks(10).map((tick) => (
            <g key={tick}>
              <text
                x={xScale(tick)}
                y={yScale.range()[0] + 5}
                fontSize={9}
                textAnchor="middle"
                dominantBaseline="hanging"
              >
                {tick}
              </text>
              <line
                x1={xScale(tick)}
                y1={yScale.range()[0]}
                x2={xScale(tick)}
                y2={yScale.range()[0] - 5}
                stroke="black"
              />
            </g>
          ))}

          {yScale.ticks(10).map((tick) => (
            <g key={tick}>
              <text
                x={xScale.range()[0] - 5}
                y={yScale(tick)}
                fontSize={9}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {tick}
              </text>
              <line
                x1={xScale.range()[0] + 5}
                y1={yScale(tick)}
                x2={xScale.range()[0]}
                y2={yScale(tick)}
                stroke="black"
              />
            </g>
          ))}

          {/* Fixes the "L" shape between ticks at the origin */}
          <rect x={xScale.range()[0] - 0.5} y={yScale.range()[0] - 0.5} width={1} height={1} />

          <rect
            x={395}
            y={0}
            width={500 - 400}
            height={70}
            fill="white"
            fillOpacity="0.5"
            stroke="gray"
          />
          {colorScale.domain().map((singleSpecies, i) => (
            <g key={singleSpecies}>
              <text x={420} y={20 + 20 * i}>
                {singleSpecies}
              </text>
              <circle r={5} cx={410} cy={15 + 20 * i} fill={colorScale(singleSpecies)} />
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}
