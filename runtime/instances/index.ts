import { getInstances } from "../internals"

type Instance = { id: string; name: string; state?: any }

export const saveInstance = (id: string, nextInstance: Instance) => {
  const instances = getInstances()
  instances[id] = nextInstance
}

export const removeInstance = (id: string) => {
  const instances = getInstances()
  delete instances[id]
}

export const getInstance = (id: string) => {
  return getInstances()[id]
}
