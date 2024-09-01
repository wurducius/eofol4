import { isBrowser, sleepPromise } from "../util"
import { getInstances } from "../internals"
import { onComponentUpdate, onComponentUpdated } from "./lifecycle"

export const forceRerender = async () => {
  if (isBrowser()) {
    const instances = getInstances()
    Object.keys(instances).forEach((id) => {
      onComponentUpdate(id)
      onComponentUpdated(id)
    })
    // @TODO FIXME SLEEP
    await sleepPromise()
  }
}
