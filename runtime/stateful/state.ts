import { getInstance, mergeInstance } from "../instances"
import { updateComponents } from "./render"
import { State } from "../types"

export const getInitialState = (initialState: State) => (initialState ? { ...initialState } : undefined)

export const getState = (id: string) => {
  const instance = getInstance(id)
  return instance?.state
}

export const getSetState = (id: string) => (nextState: State) => {
  mergeInstance(id, { state: nextState })
  updateComponents(id)
}
