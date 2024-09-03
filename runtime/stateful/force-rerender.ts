import { isBrowser } from "../util"
import { getInstances } from "../internals"
import { updateComponents } from "./render"

export const forceRerender = () => {
  if (isBrowser()) {
    updateComponents(Object.keys(getInstances()))
  }
}
