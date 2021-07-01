import { useState, useEffect } from 'react'
import * as d3 from 'd3'

const URL = 'https://raw.githubusercontent.com/vega/vega-datasets/master/data/penguins.json'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [dataset, setDataset] = useState([])

  useEffect(() => {
    if (dataset.length === 0) return

    console.table(dataset.slice(0, 10))
    console.log(d3.extent(dataset.map(d => d['Beak Length (mm)'])))
  }, [dataset])

  useEffect(() => {
    setIsLoading(true)
    fetch(URL)
      .then((response) => response.json())
      .then(json => {
        setDataset(json)
      })
      .catch(() => {
        window.alert('Errore!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const xScale = d3.scaleLinear()
    .range([0, 500])
    .domain(d3.extent(dataset.map(d => d['Beak Length (mm)'])))

  return (
    <div>
      {isLoading
      ? (<div>L O A D I N G . . .</div>)
      : (
        <svg width={500} height={500}>
          <rect fill="lightgreen" width={500} height={500} />

          {dataset.map((datum, i) =>
            <circle
              key={i}
              r={5}
              cx={xScale(datum['Beak Length (mm)'])}
              cy={datum['Flipper Length (mm)']}
            />
          )}
        </svg>
      )}
    </div>
  );
}

export default App;
