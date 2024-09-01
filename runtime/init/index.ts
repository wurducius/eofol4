import { isBrowser, sleepHandler } from "../util"
import { prefetchAssets } from "../prefetch"
import { replayInitialEffect } from "../stateful"

export const init = () => {
  if (isBrowser()) {
    window.onload = () => {
      prefetchAssets()
      // @TODO Add register service worker
      // @TODO FIXME SLEEP
      sleepHandler(() => {
        replayInitialEffect()
      })
    }
  }
}
