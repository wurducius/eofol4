import { State } from "../defs"
import { getInstance, saveInstance } from "../instances"
import { forceRerender } from "./force-rerender"

export const getInitialState = (initialState: State) => (initialState ? { ...initialState } : undefined)

export const getState = (id: string) => {
  const instance = getInstance(id)
  return instance?.state
}

export const getSetState = (id: string) => (nextState: State) => {
  const instance = getInstance(id)
  saveInstance(id, { ...instance, state: nextState })
  forceRerender()
}
