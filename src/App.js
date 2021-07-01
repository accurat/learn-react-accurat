import { useState, useEffect } from 'react'

const URL = 'https://raw.githubusercontent.com/vega/vega-datasets/master/data/penguins.json'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [dataset, setDataset] = useState(null)

  console.log(dataset, isLoading)

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

  return (
    <div>
      <svg>

      </svg>
    </div>
  );
}

export default App;
