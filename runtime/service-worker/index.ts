import { isBrowser } from "../util"
import { SERVICE_WORKER } from "../constants"
import { getConfig, getEnv } from "../internals"

export const registerServiceworker = () => {
  if (isBrowser() && "serviceWorker" in navigator) {
    const { BASE_URL } = getEnv()
    navigator.serviceWorker.register(`${BASE_URL}${SERVICE_WORKER.SCRIPT_FILENAME}`)
    console.log("Service worker registered.")
  }
}

if (isBrowser()) {
  const { SERVICE_WORKER_REGISTER_AUTOMATICALLY } = getConfig()
  if (SERVICE_WORKER_REGISTER_AUTOMATICALLY) {
    registerServiceworker()
  }
}
