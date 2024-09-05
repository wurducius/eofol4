import { isBrowser } from "../util"
import { prefetchAssets } from "../prefetch"
import { forceRerender, replayInitialEffect } from "../stateful"

export const init = () => {
  if (isBrowser()) {
    window.onresize = () => {
      forceRerender()
    }
    window.onload = () => {
      prefetchAssets()
      replayInitialEffect()
    }
  }
}
