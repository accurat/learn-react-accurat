import { useState } from 'react'
import * as d3 from 'd3'
import { uniq } from 'lodash'
import { inject, observer } from 'mobx-react'

export const Scatterplot = inject('state')(
  observer(function Scatterplot({ state }) {
    const { dataset, isLoading } = state

    const [filterOnSpecies, setFilterOnSpecies] = useState({})

    const toggleFilterOnSpecies = (category) => {
      const oldCategoryValue = filterOnSpecies[category]
      setFilterOnSpecies({ ...filterOnSpecies, [category]: !oldCategoryValue })
    }

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

    const colorScale = d3
      .scaleOrdinal()
      .range(['tomato', 'steelblue', 'green'])
      .domain(uniq(dataset.map((d) => d['Species'])))

    return (
      <div>
        {isLoading ? (
          <div>L O A D I N G . . .</div>
        ) : (
          <svg width={500} height={500}>
            <rect fill="aliceblue" width={500} height={500} />

            {dataset
              .filter((d) => d['Beak Length (mm)'] !== null && d['Flipper Length (mm)'] !== null)
              .filter((d) => filterOnSpecies[d['Species']] === true)
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

            <Legend
              scale={colorScale}
              x={390}
              y={5}
              onCategoryClick={(category) => {
                toggleFilterOnSpecies(category)
              }}
            />
          </svg>
        )}
      </div>
    )
  })
)

function Legend({ scale, x, y, onCategoryClick }) {
  return (
    <g className="-legend">
      <rect x={x} y={y} width={105} height={70} fill="white" fillOpacity="0.5" stroke="gray" />

      {scale.domain().map((category, i) => (
        <g key={category}>
          <text x={x + 25} y={y + 16 + 20 * i} dominantBaseline="middle" fontSize={12}>
            {category}
          </text>
          <circle
            r={5}
            cx={x + 15}
            cy={y + 15 + 20 * i}
            fill={scale(category)}
            onClick={() => {
              onCategoryClick(category)
            }}
            style={{
              cursor: 'pointer',
            }}
          />
        </g>
      ))}
    </g>
  )
}
