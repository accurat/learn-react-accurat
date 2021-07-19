import { useEffect } from 'react'
import { Provider, inject, observer } from 'mobx-react'
import { State } from './state/State'
import { Scatterplot } from './Scatterplot'
import { Header } from './Header'

export function App() {
  const state = State.create()

  useEffect(() => state.fetchDataset(), [])

  return (
    <Provider state={state}>
      <div>
        <Header />
        <Scatterplot />
      </div>
    </Provider>
  )
}
