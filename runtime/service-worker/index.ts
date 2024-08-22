import { isBrowser } from "../util"
import { SERVICE_WORKER } from "../constants"

// @TODO Extract service worker scriot filename to ENV
export const registerServiceworker = (serviceworkerPath?: string) => {
  if (isBrowser() && "serviceWorker" in navigator) {
    navigator.serviceWorker.register(`${serviceworkerPath ?? "./"}${SERVICE_WORKER.SCRIPT_FILENAME}`)
  }
}
