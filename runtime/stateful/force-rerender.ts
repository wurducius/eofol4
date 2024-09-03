import { isBrowser } from "../util"
import { getInstances } from "../internals"
import { onComponentUpdate, onComponentUpdated } from "./lifecycle"
import { prune } from "./prune"
import { updateDom } from "./dom"

export const forceRerender = () => {
  if (isBrowser()) {
    const instances = getInstances()

    const updated: { id: string; result: any }[] = []
    Object.keys(instances).forEach((id) => {
      updated.push({ id, result: onComponentUpdate(id) })
    })
    updateDom(updated)
    updated.forEach((update) => {
      onComponentUpdated(update.id)
    })

    prune()

    // @TODO FIXME SLEEP
    // await sleepPromise()
  }
}
