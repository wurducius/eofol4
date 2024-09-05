import { arrayCombinatorForEach, generateId } from "../util"
import { updateComponents } from "../stateful"
import { Store, StoreState } from "../types"
import { getDefs } from "../defs"
import { getInstances } from "../internals"
import { logStoreAlreadyExists, logStoreDoesNotExist } from "../logger"
import { typeStateful } from "../stateful/type-stateful"

const globalStore: Record<string, Store> = {}

const getSelectorId = (projectionSource: string) => `${projectionSource}-${generateId()}`

export const createStore = (id: string, initialState: StoreState) => {
  if (globalStore[id]) {
    logStoreAlreadyExists(id)
    return
  }
  globalStore[id] = { id, state: initialState }
}

const getStore = (id: string) => {
  const stored = globalStore[id]
  if (!stored) {
    logStoreDoesNotExist(id)
    return
  }
  return stored.state
}

export const selector = getStore

const updateSubscribed = (id: string) => {
  const namesUpdated: string[] = []
  const defs = getDefs()
  Object.keys(defs).forEach((defName) => {
    const def = typeStateful(defs[defName])
    arrayCombinatorForEach((subscribe) => {
      if (subscribe === id) {
        namesUpdated.push(defName)
      }
    })(def.subscribe)
  }, [])
  const updated: string[] = []
  const instances = getInstances()
  Object.keys(instances).forEach((instanceName) => {
    if (namesUpdated.includes(instances[instanceName].name)) {
      updated.push(instanceName)
    }
  })
  updateComponents(updated)
}

const setStoreImpl = (stored: Store, id: string, nextState: StoreState) => {
  if (!stored) {
    logStoreDoesNotExist(id)
    return
  }
  stored.state = nextState

  stored.projections?.forEach(({ id: projectionName, projection }) => {
    setStoreImpl(globalStore[projectionName], projectionName, projection(stored.state))
    updateSubscribed(projectionName)
  })
}

export const setStore = (id: string, nextState: StoreState) => {
  const stored = globalStore[id]
  setStoreImpl(stored, id, nextState)
  updateSubscribed(id)
}

export const mergeStore = (id: string, nextState: StoreState) => {
  const stored = globalStore[id]
  // @TODO merge deep
  setStoreImpl(stored, id, { ...stored.state, ...nextState })
  updateSubscribed(id)
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
