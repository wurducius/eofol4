import { onComponentUnmount, onComponentUnmounted } from "./lifecycle"
import { getInstances } from "../internals"

export const prune = () => {
  // @TODO FIXME UNMOUNT
  Object.keys(getInstances()).forEach((id) => {
    const element = document.getElementById(id)
    if (!element) {
      onComponentUnmount(id)
      onComponentUnmounted()
    }
  })
}
