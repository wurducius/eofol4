import { getInstances } from "../internals"
import { State } from "../defs"

export type Instance = { id: string; name: string; state?: any }

const saveInstanceImpl = (instances: Record<string, Instance>) => (id: string, nextInstance: Instance) => {
  instances[id] = nextInstance
}

export const saveInstance = (id: string, nextInstance: Instance) => {
  return saveInstanceImpl(getInstances())(id, nextInstance)
}

export const removeInstance = (id: string) => {
  const instances = getInstances()
  delete instances[id]
}

export const getInstance = (id: string) => {
  return getInstances()[id]
}

export const saveStatefulInstanceImpl =
  (instances: Record<string, Instance>) => (id: string, name: string, state: State) => {
    const instance: Instance = { id, name }
    if (state) {
      instance.state = state
    }
    saveInstanceImpl(instances)(id, instance)
  }

export const saveStatefulInstance = (id: string, name: string, state: State) => {
  saveStatefulInstanceImpl(getInstances())(id, name, state)
}
