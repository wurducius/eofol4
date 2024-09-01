import { State } from "../defs"
import { saveInstance } from "../instances"
import { getInstances } from "../internals"
import { forceRerender } from "./force-rerender"

export const getInitialState = (initialState: State) => (initialState ? { ...initialState } : undefined)

export const getState = (id: string) => {
  const instance = getInstances()["index.html"][id]
  return instance?.state
}

export const getSetState = (id: string) => (nextState: State) => {
  // @TODO merge
  //const instance = getInstance(id)
  const instance = getInstances()["index.html"][id]
  saveInstance(id, { ...instance, state: nextState })
  forceRerender()
}
