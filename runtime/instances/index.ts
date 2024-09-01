import { getInstances } from "../internals"

type Instance = { id: string; name: string; state?: any }

const updateInstance = (id: string, nextInstance: Instance | undefined) => {
  const instances = getInstances()
  instances[id] = nextInstance
}

export const saveInstance = (id: string, nextInstance: Instance) => {
  updateInstance(id, nextInstance)
}

export const removeInstance = (id: string) => {
  updateInstance(id, undefined)
}

export const getInstance = (id: string) => {
  const instance = getInstances()[id]
  if (instance) {
    return instance
  } else {
    console.log(`EOFOL ERROR: Instance with id = ${id} does not exist.`)
  }
}
