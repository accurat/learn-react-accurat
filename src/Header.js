import { inject, observer } from 'mobx-react'

export const Header = inject('state')(
  observer(function Header({ state }) {
    return <div>Scatterplot pinguini -- {state.dataset.length} pinguini</div>
  })
)
