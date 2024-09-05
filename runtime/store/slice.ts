import { createStore, selector, setStore } from "./store"
import { State } from "../types"
import { mergeDeep } from "../util"

export type Payload = any

// eslint-disable-next-line no-unused-vars
export type Action = (state: State, payload: Payload) => State

// eslint-disable-next-line no-unused-vars
export type MiddlewareAction = (state: State, payload: Payload) => { state: State; payload: Payload }

export type Middleware = { before?: MiddlewareAction; after?: MiddlewareAction }

export type Slice = {
  state: State
  actions: Record<string, Action>
  middleware?: Record<string, Middleware>
}

const slices: Record<string, Slice> = {}

export const createSlice = (name: string, sliceData: Slice) => {
  createStore(name, sliceData.state)
  slices[name] = sliceData
}

export const dispatch = (name: string) => (type: string, payload?: Payload) => {
  const storeState = selector(name)
  const slice = slices[name]

  let beforeProps = { state: storeState, payload, type }
  if (slice.middleware) {
    // @ts-ignore
    beforeProps = Object.keys(slice.middleware).reduce(
      // @ts-ignore
      (acc, next) => {
        // @ts-ignore
        const thisMiddleware = slice.middleware[next]
        if (thisMiddleware.before) {
          // @ts-ignore
          return thisMiddleware.before(acc)
        }
        return acc
      },
      { state: storeState, payload, type },
    )
  }

  let mergedState = beforeProps.state
  if (beforeProps.type) {
    const action = slice.actions[beforeProps.type]
    const resultState = action(beforeProps.state, beforeProps.payload)
    mergedState = mergeDeep(beforeProps.state, resultState)
  }

  let afterProps = { state: mergedState, payload: beforeProps.payload, type: beforeProps.type }
  if (slice.middleware) {
    // @ts-ignore
    afterProps = Object.keys(slice.middleware).reduce(
      // @ts-ignore
      (acc, next) => {
        // @ts-ignore
        const thisMiddleware = slice.middleware[next]
        if (thisMiddleware.after) {
          // @ts-ignore
          return thisMiddleware.after(acc)
        }
        return acc
      },
      afterProps,
    )
  }

  setStore(name, afterProps.state)
}
