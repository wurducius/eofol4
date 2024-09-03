import { State } from "../defs"
import { getInstance, mergeInstance } from "../instances"
import { onComponentUpdate, onComponentUpdated } from "./lifecycle"
import { prune } from "./prune"
import { updateDom } from "./dom"

export const getInitialState = (initialState: State) => (initialState ? { ...initialState } : undefined)

export const getState = (id: string) => {
  const instance = getInstance(id)
  return instance?.state
}

export const getSetState = (id: string) => (nextState: State) => {
  mergeInstance(id, { state: nextState })
  const result = onComponentUpdate(id)
  if (result) {
    updateDom({ id, result })
  }
  onComponentUpdated(id)
  prune()
}
