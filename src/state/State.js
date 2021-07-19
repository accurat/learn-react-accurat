import { types as t } from 'mobx-state-tree'

export const State = t
  .model({
    isLoading: t.optional(t.boolean, false),
    dataset: t.optional(t.array(t.frozen()), []),
  })
  .actions((self) => ({
    setDataset: function (ds) {
      self.dataset = ds
    },
    setIsLoading: function (v) {
      self.isLoading = v
    },
    fetchDataset: function () {
      const URL = 'https://raw.githubusercontent.com/vega/vega-datasets/master/data/penguins.json'

      self.setIsLoading(true)
      fetch(URL)
        .then((response) => response.json())
        .then((json) => {
          self.setDataset(json)
        })
        .catch(() => {
          window.alert('Errore!')
        })
        .finally(() => {
          self.setIsLoading(false)
        })
    },
  }))
