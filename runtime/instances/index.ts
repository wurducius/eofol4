import { getInstances } from "../internals"
import { Attributes, Instance, State } from "../types"

const saveInstanceImpl = (instances: Record<string, Instance>) => (id: string, nextInstance: Instance) => {
  instances[id] = nextInstance
}

export const saveInstance = (id: string, nextInstance: Instance) => {
  return saveInstanceImpl(getInstances())(id, nextInstance)
}

export const mergeInstance = (id: string, nextInstance: Partial<Instance>) => {
  const instances = getInstances()
  const prevInstance = instances[id]
  return saveInstanceImpl(instances)(id, { ...prevInstance, ...nextInstance })
}

export const removeInstance = (id: string) => {
  const instances = getInstances()
  delete instances[id]
}

export const getInstance = (id: string) => {
  return getInstances()[id]
}

export const saveStatefulInstanceImpl =
  (instances: Record<string, Instance>) => (id: string, name: string, attributes: Attributes, state: State) => {
    const instance: Instance = { id, name, attributes }
    if (state) {
      instance.state = state
    }
    saveInstanceImpl(instances)(id, instance)
  }

export const saveStatefulInstance = (id: string, name: string, attributes: Attributes, state: State) => {
  saveStatefulInstanceImpl(getInstances())(id, name, attributes, state)
}
