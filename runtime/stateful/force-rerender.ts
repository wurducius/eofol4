import { isBrowser, sleepPromise } from "../util"
import { getInstances } from "../internals"
import { onComponentUnmount, onComponentUnmounted, onComponentUpdate, onComponentUpdated } from "./lifecycle"
import { domAppendChildren, domClearChildren } from "../dom"

export const forceRerender = async () => {
  if (isBrowser()) {
    const instances = getInstances()

    const updated: { id: string; result: any }[] = []
    Object.keys(instances).forEach((id) => {
      updated.push({ id, result: onComponentUpdate(id) })
    })
    updated.forEach((update) => {
      const target = document.getElementById(update.id)
      if (target) {
        domClearChildren(target)
        domAppendChildren(update.result, target)
      } else {
        // @TODO FIXME
      }
    })
    updated.forEach((update) => {
      onComponentUpdated(update.id)
    })

    // @TODO FIXME UNMOUNT
    Object.keys(instances).forEach((id) => {
      const element = document.getElementById(id)
      if (!element) {
        onComponentUnmount(id)
        onComponentUnmounted(id)
      }
    })

    // @TODO FIXME SLEEP
    await sleepPromise()
  }
}
