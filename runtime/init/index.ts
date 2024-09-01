import { isBrowser } from "../util"
import { prefetchAssets } from "../prefetch"
import { replayInitialEffect } from "../stateful"

export const init = () => {
  if (isBrowser()) {
    window.onload = () => {
      prefetchAssets()
      // @TODO FIXME SLEEP
      setTimeout(() => {
        replayInitialEffect()
      }, 100)
    }
  }
}
