import { isBrowser, sleepPromise } from "../util"
import { getInstances } from "../internals"
import { onComponentUnmount, onComponentUnmounted, onComponentUpdate, onComponentUpdated } from "./lifecycle"

export const forceRerender = async () => {
  if (isBrowser()) {
    const instances = getInstances()
    Object.keys(instances).forEach((id) => {
      onComponentUpdate(id)
      onComponentUpdated(id)
    })
    // @TODO FIXME SLEEP
    await sleepPromise()
    // @TODO FIXME UNMOUNT
    Object.keys(instances).forEach((id) => {
      const element = document.getElementById(id)
      if (!element) {
        onComponentUnmount(id)
        onComponentUnmounted(id)
      }
    })
  }
}
