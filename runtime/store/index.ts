import { generateId } from "../util"
import { forceRerender } from "../stateful"
import { Store, StoreState } from "../types"

const globalStore: Record<string, Store> = {}

const getSelectorId = (projectionSource: string) => `${projectionSource}-${generateId()}`

// @TODO Extract error logging

export const createStore = (id: string, initialState: StoreState) => {
  if (globalStore[id]) {
    console.log(`Eofol error: Store with id = "${id}" already exists.`)
    return
  }
  globalStore[id] = { id, state: initialState }
}

const getStore = (id: string) => {
  const stored = globalStore[id]
  if (!stored) {
    console.log(`Eofol error: Store with id = "${id}" does not exist.`)
    return
  }
  return stored.state
}

export const selector = getStore

const setStoreImpl = (stored: Store, id: string, nextState: StoreState) => {
  if (!stored) {
    console.log(`Eofol error: Store with id = "${id}" does not exist.`)
    return
  }
  stored.state = nextState

  stored.projections?.forEach(({ id: projectionName, projection }) => {
    setStoreImpl(globalStore[projectionName], projectionName, projection(stored.state))
  })
}

export const setStore = (id: string, nextState: StoreState) => {
  const stored = globalStore[id]
  setStoreImpl(stored, id, nextState)
  // @TODO update subscribed components
  forceRerender()
}

export const mergeStore = (id: string, nextState: StoreState) => {
  const stored = globalStore[id]
  // @TODO merge deep
  setStoreImpl(stored, id, { ...stored.state, ...nextState })
  // @TODO update subscribed components
  forceRerender()
}

export const createProjection = (
  id: string,
  projectionSource: string,
  // eslint-disable-next-line no-unused-vars
  projectionMap: (nextState: StoreState) => StoreState,
) => {
  const stored = globalStore[projectionSource]
  createStore(id, projectionMap(stored.state))
  if (!stored.projections) {
    stored.projections = []
  }
  stored.projections.push({
    id,
    projection: projectionMap,
  })
}

// eslint-disable-next-line no-unused-vars
export const createSelector = (projectionSource: string, projectionMap: (nextState: StoreState) => StoreState) => {
  const id = getSelectorId(projectionSource)
  createProjection(id, projectionSource, projectionMap)
  return { id, selector: () => selector(id) }
}
