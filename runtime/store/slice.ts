import { createStore, selector, setStore } from "./store"
import { State } from "../types"
import { mergeDeep } from "../util"

export type Payload = any

// eslint-disable-next-line no-unused-vars
export type Action = (state: State, payload: Payload) => State

// eslint-disable-next-line no-unused-vars
export type Middleware = (payload: Payload) => State

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

export const dispatch = (name: string) => (props: { type: string; payload?: Payload }) => {
  const storeState = selector(name)
  const slice = slices[name]
  const action = slice.actions[props.type]
  const resultState = action(storeState, props.payload)
  const mergedState = mergeDeep(storeState, resultState)
  if (slice.middleware) {
    // @ts-ignore
    Object.keys(slice.middleware).reduce((acc, next) => slice.middleware[next](acc), mergedState)
  }
  setStore(name, mergedState)
}
